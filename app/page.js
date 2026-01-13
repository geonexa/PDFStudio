import Link from 'next/link'
import Image from 'next/image'
import './home.css'

export const metadata = {
  title: 'PDFStudio - Split, Merge, Compress PDFs Online',
  description: 'PDFStudio - Free online PDF editing tools to split, merge, compress, and edit PDF files. Simple, secure, and no registration required.',
}

export default function Home() {
  return (
    <div className="home-container">
      <main className="main-content">
        <div className="container">
          <div className="hero">
            <h1 className="hero-title">PDFStudio</h1>
            <p className="hero-description">
              Powerful Free PDF editing tools. 
              All processing happens locally for maximum security - no registration required.
            </p>
          </div>

          <div className="tools-grid">
            <Link href="/split" className="tool-card">
              <div className="tool-icon">
                <Image 
                  src="/split.png" 
                  alt="Split PDF" 
                  style={{borderRadius: '10px',}}
                  width={84} 
                  height={84}
                  priority
                />
              </div>
              <h3 className="tool-title">Split PDF</h3>
              <p className="tool-description">
                Split a PDF into multiple files by page ranges
              </p>
            </Link>

            <Link href="/merge" className="tool-card">
              <div className="tool-icon">
                <Image 
                  src="/merge.png" 
                  alt="Merge PDF" 
                  style={{borderRadius: '10px',}}
                  width={84} 
                  height={84}
                  priority
                />
              </div>
              <h3 className="tool-title">Merge PDF</h3>
              <p className="tool-description">
                Combine multiple PDF files into one document
              </p>
            </Link>

            <Link href="/compress" className="tool-card">
              <div className="tool-icon">
                <Image 
                  src="/compress.png" 
                  alt="Compress PDF" 
                  style={{borderRadius: '10px',}}
                  width={84} 
                  height={84}
                  priority
                />
              </div>
              <h3 className="tool-title">Compress PDF</h3>
              <p className="tool-description">
                Reduce PDF file size while maintaining quality
              </p>
            </Link>


          </div>
        </div>
      </main>
    </div>
  )
}