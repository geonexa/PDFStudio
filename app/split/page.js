'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'
import './split.css'

export default function SplitPage() {
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [fileName, setFileName] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [ranges, setRanges] = useState([{ start: 1, end: 1 }])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file')
      return
    }

    setError('')
    setFile(selectedFile)
    setFileName(selectedFile.name)
    
    // Create URL for preview
    const url = URL.createObjectURL(selectedFile)
    setFileUrl(url)

    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pages = pdfDoc.getPageCount()
      setTotalPages(pages)
      setRanges([{ start: 1, end: pages }])
    } catch (err) {
      setError('Failed to load PDF. Please try another file.')
      console.error(err)
    }
  }

  const addRange = () => {
    setRanges([...ranges, { start: 1, end: 1 }])
  }

  const removeRange = (index) => {
    if (ranges.length > 1) {
      setRanges(ranges.filter((_, i) => i !== index))
    }
  }

  const updateRange = (index, field, value) => {
    const numValue = parseInt(value) || 1
    const newRanges = [...ranges]
    newRanges[index] = {
      ...newRanges[index],
      [field]: Math.max(1, Math.min(numValue, totalPages || 1)),
    }
    
    // Ensure start <= end
    if (field === 'start' && newRanges[index].start > newRanges[index].end) {
      newRanges[index].end = newRanges[index].start
    }
    if (field === 'end' && newRanges[index].end < newRanges[index].start) {
      newRanges[index].start = newRanges[index].end
    }

    setRanges(newRanges)
  }

  const validateRanges = () => {
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i]
      if (range.start < 1 || range.end < 1) {
        return `Range ${i + 1}: Start and end must be at least 1`
      }
      if (range.start > range.end) {
        return `Range ${i + 1}: Start page must be less than or equal to end page`
      }
      if (range.end > totalPages) {
        return `Range ${i + 1}: End page exceeds total pages (${totalPages})`
      }
    }
    return null
  }

  const handleSplit = async () => {
    if (!file) {
      setError('Please select a PDF file first')
      return
    }

    const validationError = validateRanges()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setProgress(0)
    setError('')

    try {
      const arrayBuffer = await file.arrayBuffer()
      const sourcePdf = await PDFDocument.load(arrayBuffer)
      
      const baseName = fileName.replace(/\.pdf$/i, '')
      
      for (let i = 0; i < ranges.length; i++) {
        setProgress(((i + 1) / ranges.length) * 100)
        
        const range = ranges[i]
        const newPdf = await PDFDocument.create()
        
        const pages = await newPdf.copyPages(
          sourcePdf,
          Array.from({ length: range.end - range.start + 1 }, (_, idx) => range.start - 1 + idx)
        )
        
        pages.forEach((page) => {
          newPdf.addPage(page)
        })

        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        
        const outputName = ranges.length > 1 
          ? `${baseName}_part${i + 1}_pages${range.start}-${range.end}.pdf`
          : `${baseName}_pages${range.start}-${range.end}.pdf`
        
        saveAs(blob, outputName)
      }

      setProgress(100)
      setDialogOpen(true)
      
      // Reset after a delay
      setTimeout(() => {
        if (fileUrl) {
          URL.revokeObjectURL(fileUrl)
        }
        setFile(null)
        setFileUrl(null)
        setFileName('')
        setTotalPages(0)
        setRanges([{ start: 1, end: 1 }])
        setProgress(0)
      }, 2000)
    } catch (err) {
      setError('Failed to split PDF. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getPageUrl = (pageNumber) => {
    if (!fileUrl) return null
    return `${fileUrl}#page=${pageNumber}`
  }

  return (
    <div className="split-page">
      <header className="split-header">
        <div className="container">
          {/* <Link href="/" className="back-link">← Back to Home</Link> */}
          <h1 className="split-title">Split PDF</h1>
          <p className="split-subtitle">
            Split your PDF into multiple files by page ranges.
          </p>
        </div>
      </header>

      <main className="split-main">
        <div className="container">
          <div className="split-container">
            <div className="upload-section">
              <label htmlFor="pdf-upload" className="upload-label">
                <div className="upload-area">
                  <div className="upload-icon">📄</div>
                  <div className="upload-text">
                    {fileName ? (
                      <>
                        <strong>{fileName}</strong>
                        {totalPages > 0 && (
                          <span className="page-count">({totalPages} pages)</span>
                        )}
                      </>
                    ) : (
                      <>
                        <strong>Choose PDF File</strong>
                        <span>or drag and drop</span>
                      </>
                    )}
                  </div>
                </div>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="upload-input"
                  disabled={loading}
                />
              </label>
            </div>

            {error && (
              <div className="error-message">{error}</div>
            )}

            {totalPages > 0 && (
              <div className="ranges-section">
                <div className="section-header">
                  <h2 className="section-title">Page Ranges</h2>
                  <button
                    type="button"
                    onClick={addRange}
                    className="add-button"
                    disabled={loading}
                  >
                    + Add Range
                  </button>
                </div>

                <div className="ranges-list">
                  {ranges.map((range, index) => (
                    <div key={index} className="range-item">
                      <div className="range-label">Range {index + 1}</div>
                      <div className="range-content">
                        <div className="range-inputs">
                          <div className="input-group">
                            <label>From Page</label>
                            <input
                              type="number"
                              min="1"
                              max={totalPages}
                              value={range.start}
                              onChange={(e) => updateRange(index, 'start', e.target.value)}
                              disabled={loading}
                              className="number-input"
                            />
                          </div>
                          <span className="range-separator">to</span>
                          <div className="input-group">
                            <label>To Page</label>
                            <input
                              type="number"
                              min="1"
                              max={totalPages}
                              value={range.end}
                              onChange={(e) => updateRange(index, 'end', e.target.value)}
                              disabled={loading}
                              className="number-input"
                            />
                          </div>
                          {ranges.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRange(index)}
                              className="remove-button"
                              disabled={loading}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        {fileUrl && range.start === range.end ? (
                          <div className="range-preview">
                            <div className="preview-label">Preview (Page {range.start}):</div>
                            <div className="preview-container">
                              <object
                                data={getPageUrl(range.start)}
                                type="application/pdf"
                                className="range-pdf-preview"
                              >
                                <div className="preview-fallback">Page {range.start}</div>
                              </object>
                            </div>
                          </div>
                        ) : fileUrl && (
                          <div className="range-preview">
                            <div className="preview-label">Preview (Pages {range.start}-{range.end}):</div>
                            <div className="preview-container">
                              <div className="preview-pages">
                                <div className="preview-page-item">
                                  <div className="preview-page-label">Start: {range.start}</div>
                                  <object
                                    data={getPageUrl(range.start)}
                                    type="application/pdf"
                                    className="range-pdf-preview"
                                  >
                                    <div className="preview-fallback">Page {range.start}</div>
                                  </object>
                                </div>
                                <div className="preview-page-item">
                                  <div className="preview-page-label">End: {range.end}</div>
                                  <object
                                    data={getPageUrl(range.end)}
                                    type="application/pdf"
                                    className="range-pdf-preview"
                                  >
                                    <div className="preview-fallback">Page {range.end}</div>
                                  </object>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {loading && (
                  <div className="progress-section">
                    <div className="progress-root">
                      <div
                        className="progress-indicator"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="progress-text">
                      Splitting PDF... {Math.round(progress)}%
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSplit}
                  disabled={loading || !file}
                  className="split-button"
                >
                  {loading ? 'Splitting...' : 'Split PDF'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {previewFile && (
        <Dialog.Root open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="pdf-viewer-dialog">
              <Dialog.Title className="pdf-viewer-title">{previewFile.name}</Dialog.Title>
              <div className="pdf-viewer-container">
                <iframe
                  src={previewFile.url}
                  className="pdf-viewer-iframe"
                  title="PDF Viewer"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="dialog-button"
                >
                  Close
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">Success!</Dialog.Title>
            <Dialog.Description className="dialog-description">
              Your PDF has been split successfully. The files have been downloaded.
            </Dialog.Description>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setDialogOpen(false)}
                className="dialog-button"
              >
                OK
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}