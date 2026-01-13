'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'
import './compress.css'

export default function CompressPage() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

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
    setOriginalSize(selectedFile.size)
    setCompressedSize(0)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getCompressionRatio = () => {
    if (originalSize === 0) return 0
    return ((1 - compressedSize / originalSize) * 100).toFixed(1)
  }

  const handleCompress = async () => {
    if (!file) {
      setError('Please select a PDF file first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const arrayBuffer = await file.arrayBuffer()
      
      // Load PDF and save with options that reduce size
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: false,
      })

      // Create a new PDF to remove unused objects and optimize structure
      const compressedPdf = await PDFDocument.create()
      
      // Copy all pages
      const pages = await compressedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
      pages.forEach((page) => {
        compressedPdf.addPage(page)
      })

      // Save with options to reduce file size
      const pdfBytes = await compressedPdf.save({
        useObjectStreams: false,
        addDefaultPage: false,
      })

      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      setCompressedSize(blob.size)

      const baseName = fileName.replace(/\.pdf$/i, '')
      saveAs(blob, `${baseName}_compressed.pdf`)

      setDialogOpen(true)
    } catch (err) {
      setError('Failed to compress PDF. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="compress-page">
      <header className="compress-header">
        <div className="container">
          {/* <Link href="/" className="back-link">← Back to Home</Link> */}
          <h1 className="compress-title">Compress PDF</h1>
          <p className="compress-subtitle">
            Reduce PDF file size while maintaining quality
          </p>
        </div>
      </header>

      <main className="compress-main">
        <div className="container">
          <div className="compress-container">
            <div className="upload-section">
              <label htmlFor="pdf-upload" className="upload-label">
                <div className="upload-area">
                  <div className="upload-icon">📄</div>
                  <div className="upload-text">
                    {fileName ? (
                      <>
                        <strong>{fileName}</strong>
                        <span className="file-size">{formatFileSize(originalSize)}</span>
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

            {file && (
              <div className="compress-section">
                <div className="size-info">
                  <div className="size-item">
                    <div className="size-label">Original Size</div>
                    <div className="size-value">{formatFileSize(originalSize)}</div>
                  </div>
                  {compressedSize > 0 && (
                    <>
                      <div className="size-arrow">→</div>
                      <div className="size-item">
                        <div className="size-label">Compressed Size</div>
                        <div className="size-value compressed">
                          {formatFileSize(compressedSize)}
                        </div>
                      </div>
                      <div className="size-item">
                        <div className="size-label">Reduction</div>
                        <div className="size-value reduction">
                          {getCompressionRatio()}%
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="info-box">
                  <p>
                    <strong>Note:</strong> This tool optimizes PDF structure and removes 
                    unused objects. For best results with image-heavy PDFs, consider using 
                    specialized compression software.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCompress}
                  disabled={loading || !file}
                  className="compress-button"
                >
                  {loading ? 'Compressing...' : 'Compress PDF'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">Success!</Dialog.Title>
            <Dialog.Description className="dialog-description">
              Your PDF has been compressed successfully. The file has been downloaded.
              {compressedSize > 0 && (
                <div style={{ marginTop: '0.5rem', fontWeight: 500 }}>
                  Size reduced by {getCompressionRatio()}%
                </div>
              )}
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