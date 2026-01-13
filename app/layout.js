import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'PDFStudio - Split, Merge, Compress PDFs Online',
  description: 'PDFStudio - Free online PDF editing tools to split, merge, compress, and edit PDF files. Simple, secure, and no registration required. All processing happens in your browser.',
  keywords: 'PDFStudio, PDF editor, PDF editing tools, PDF splitter, PDF merger, PDF compressor, online PDF tools, PDF tools, edit PDF online',
  authors: [{ name: 'PDFStudio' }],
  openGraph: {
    title: 'PDFStudio - Split, Merge, Compress PDFs Online',
    description: 'PDFStudio - Free online PDF editing tools to split, merge, compress, and edit PDF files.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  viewport: 'width=device-width, initial-scale=1',
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}