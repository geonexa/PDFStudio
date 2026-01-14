'use client'
import Link from 'next/link'
import Image from 'next/image'
import { LockClosedIcon, LightningBoltIcon, CheckCircledIcon, RocketIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import * as Accordion from '@radix-ui/react-accordion'
import './home.css'

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
            <p className="trust-statement">
              The PDF editing tool trusted by thousands of users
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

          <div className="features-section">
            <h2 className="features-title">Why Choose PDFStudio?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <LockClosedIcon width={48} height={48} />
                </div>
                <h3 className="feature-title">100% Secure</h3>
                <p className="feature-text">
                  All PDF processing happens locally in your browser. Your files never leave your device.
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <LightningBoltIcon width={48} height={48} />
                </div>
                <h3 className="feature-title">Lightning Fast</h3>
                <p className="feature-text">
                  Process your PDFs instantly without waiting for server uploads or downloads.
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <CheckCircledIcon width={48} height={48} />
                </div>
                <h3 className="feature-title">Completely Free</h3>
                <p className="feature-text">
                  No hidden fees, no subscriptions, no credit card required. Use all features for free.
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <RocketIcon width={48} height={48} />
                </div>
                <h3 className="feature-title">Easy to Use</h3>
                <p className="feature-text">
                  Simple, intuitive interface. No technical knowledge required. Get started in seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="faq-section">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <Accordion.Root type="single" collapsible className="faq-accordion">
              <Accordion.Item value="item-1" className="faq-item">
                <Accordion.Trigger className="faq-trigger">
                  <span className="faq-question">Is PDFStudio really free?</span>
                  <ChevronDownIcon className="faq-chevron" />
                </Accordion.Trigger>
                <Accordion.Content className="faq-content">
                  <p className="faq-answer">
                    Yes! PDFStudio is completely free to use. There are no hidden fees, subscriptions, or premium tiers. All features are available to everyone at no cost.
                  </p>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="item-2" className="faq-item">
                <Accordion.Trigger className="faq-trigger">
                  <span className="faq-question">Is my data safe and secure?</span>
                  <ChevronDownIcon className="faq-chevron" />
                </Accordion.Trigger>
                <Accordion.Content className="faq-content">
                  <p className="faq-answer">
                    Absolutely! All PDF processing happens directly in your browser on your device. Your files are never uploaded to any server, ensuring complete privacy and security.
                  </p>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="item-3" className="faq-item">
                <Accordion.Trigger className="faq-trigger">
                  <span className="faq-question">Do I need to create an account?</span>
                  <ChevronDownIcon className="faq-chevron" />
                </Accordion.Trigger>
                <Accordion.Content className="faq-content">
                  <p className="faq-answer">
                    No account registration is required. Simply visit the tool you need and start processing your PDFs immediately.
                  </p>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="item-4" className="faq-item">
                <Accordion.Trigger className="faq-trigger">
                  <span className="faq-question">What file size limits are there?</span>
                  <ChevronDownIcon className="faq-chevron" />
                </Accordion.Trigger>
                <Accordion.Content className="faq-content">
                  <p className="faq-answer">
                    Since all processing happens in your browser, the limits depend on your device's memory. Most modern devices can handle PDFs up to several hundred megabytes without issues.
                  </p>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="item-5" className="faq-item">
                <Accordion.Trigger className="faq-trigger">
                  <span className="faq-question">Can I use PDFStudio offline?</span>
                  <ChevronDownIcon className="faq-chevron" />
                </Accordion.Trigger>
                <Accordion.Content className="faq-content">
                  <p className="faq-answer">
                    PDFStudio requires an internet connection to load the application, but once loaded, you can process PDFs offline as all operations run locally in your browser.
                  </p>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="item-6" className="faq-item">
                <Accordion.Trigger className="faq-trigger">
                  <span className="faq-question">What browsers are supported?</span>
                  <ChevronDownIcon className="faq-chevron" />
                </Accordion.Trigger>
                <Accordion.Content className="faq-content">
                  <p className="faq-answer">
                    PDFStudio works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        </div>
      </main>
    </div>
  )
}