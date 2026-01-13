'use client'

import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="copyright">© {new Date().getFullYear()} PDFStudio. All rights reserved.</p>
      </div>
    </footer>
  )
}