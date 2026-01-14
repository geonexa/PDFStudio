import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pdfstudio.online'),
  title: {
    default: 'PDFStudio - Split, Merge, Compress PDFs Online',
    template: '%s | PDFStudio'
  },
  description: 'PDFStudio - Free online PDF editing tools to split, merge, compress, and edit PDF files. Simple, secure, and no registration required. All processing happens in your browser.',
  keywords: ['PDFStudio', 'PDF editor', 'PDF editing tools', 'PDF splitter', 'PDF merger', 'PDF compressor', 'online PDF tools', 'PDF tools', 'edit PDF online', 'free PDF editor', 'split PDF online', 'merge PDF online', 'compress PDF online'],
  authors: [{ name: 'PDFStudio' }],
  creator: 'PDFStudio',
  publisher: 'PDFStudio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'PDFStudio',
    title: 'PDFStudio - Split, Merge, Compress PDFs Online',
    description: 'PDFStudio - Free online PDF editing tools to split, merge, compress, and edit PDF files.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDFStudio - Split, Merge, Compress PDFs Online',
    description: 'Free online PDF editing tools to split, merge, compress, and edit PDF files.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: '/',
  },
  category: 'technology',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
