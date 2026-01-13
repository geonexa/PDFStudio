'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'
import './merge.css'

export default function MergePage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [previewFile, setPreviewFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files)
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length === 0) {
      setError('Please select valid PDF files')
      return
    }

    setError('')
    
    const filesWithInfo = await Promise.all(
      pdfFiles.map(async (file) => {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const pdfDoc = await PDFDocument.load(arrayBuffer)
          const pageCount = pdfDoc.getPageCount()
          const url = URL.createObjectURL(file)
          return {
            file,
            name: file.name,
            size: file.size,
            pages: pageCount,
            id: Math.random().toString(36).substr(2, 9),
            url
          }
        } catch (err) {
          return null
        }
      })
    )

    const validFiles = filesWithInfo.filter(f => f !== null)
    setFiles([...files, ...validFiles])
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (id) => {
    const fileToRemove = files.find(f => f.id === id)
    if (fileToRemove?.url) {
      URL.revokeObjectURL(fileToRemove.url)
    }
    setFiles(files.filter(f => f.id !== id))
    if (previewFile?.id === id) {
      setPreviewFile(null)
    }
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newFiles = [...files]
    const draggedFile = newFiles[draggedIndex]
    newFiles.splice(draggedIndex, 1)
    newFiles.splice(dropIndex, 0, draggedFile)
    setFiles(newFiles)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge')
      return
    }

    setLoading(true)
    setProgress(0)
    setError('')

    try {
      const mergedPdf = await PDFDocument.create()

      for (let i = 0; i < files.length; i++) {
        setProgress(((i + 1) / files.length) * 100)
        
        const fileData = files[i].file
        const arrayBuffer = await fileData.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        
        pages.forEach((page) => {
          mergedPdf.addPage(page)
        })
      }

      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, 'merged.pdf')

      setProgress(100)
      setDialogOpen(true)
      
      setTimeout(() => {
        files.forEach(f => {
          if (f.url) URL.revokeObjectURL(f.url)
        })
        setFiles([])
        setPreviewFile(null)
        setProgress(0)
      }, 2000)
    } catch (err) {
      setError('Failed to merge PDFs. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="merge-page">
      <header className="merge-header">
        <div className="container">
          {/* <Link href="/" className="back-link">← Back to Home</Link> */}
          <h1 className="merge-title">Merge PDF</h1>
          <p className="merge-subtitle">
            Combine multiple PDF files into one document. Drag to reorder.
          </p>
        </div>
      </header>

      <main className="merge-main">
        <div className="container">
          <div className="merge-container">
            <div className="upload-section">
              <label htmlFor="pdf-upload" className="upload-label">
                <div className="upload-area">
                  <div className="upload-icon">📄</div>
                  <div className="upload-text">
                    <strong>Choose PDF Files</strong>
                    <span>Select multiple files to merge</span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="upload-input"
                  disabled={loading}
                />
              </label>
            </div>

            {error && (
              <div className="error-message">{error}</div>
            )}

            {files.length > 0 && (
              <div className="files-section">
                <div className="section-header">
                  <h2 className="section-title">Files to Merge ({files.length})</h2>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="add-button"
                    disabled={loading}
                  >
                    + Add More Files
                  </button>
                </div>

                <div className="files-list">
                  {files.map((file, index) => (
                    <div
                      key={file.id}
                      className={`file-item ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                      draggable={!loading}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="file-preview-container">
                        <div className="file-preview">
                          <object
                            data={file.url}
                            type="application/pdf"
                            className="pdf-preview"
                            title={file.name}
                          >
                            <div className="pdf-preview-fallback">
                              <div className="pdf-icon">📄</div>
                              <div>Preview not available</div>
                            </div>
                          </object>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewFile(file)}
                          className="preview-button"
                          disabled={loading}
                          title="View PDF"
                        >
                          👁️ View
                        </button>
                      </div>
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-details">
                          {file.pages} pages • {formatFileSize(file.size)}
                        </div>
                        <div className="drag-hint">Drag to reorder</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="remove-button"
                        disabled={loading}
                        aria-label="Remove"
                      >
                        ✕
                      </button>
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
                      Merging PDFs... {Math.round(progress)}%
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleMerge}
                  disabled={loading || files.length < 2}
                  className="merge-button"
                >
                  {loading ? 'Merging...' : 'Merge PDFs'}
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
              Your PDFs have been merged successfully. The file has been downloaded.
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