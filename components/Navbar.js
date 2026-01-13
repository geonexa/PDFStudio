'use client'

import Link from 'next/link'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import './Navbar.css'

export default function Navbar() {
  const tools = [
    { name: 'Split PDF', href: '/split',  available: true },
    { name: 'Merge PDF', href: '/merge', available: true },
    { name: 'Compress PDF', href: '/compress', available: true },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          PDFStudio
        </Link>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="navbar-dropdown-trigger" aria-label="Tools menu">
              Tools
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="dropdown-arrow"
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="navbar-dropdown-content" sideOffset={5}>
              {tools.map((tool) => (
                tool.available ? (
                  <DropdownMenu.Item key={tool.name} asChild>
                    <Link href={tool.href} className="navbar-dropdown-item">
                      <span className="tool-icon-small">{tool.icon}</span>
                      <span>{tool.name}</span>
                    </Link>
                  </DropdownMenu.Item>
                ) : (
                  <DropdownMenu.Item
                    key={tool.name}
                    disabled
                    className="navbar-dropdown-item disabled"
                  >

                    <span>{tool.name}</span>
                    <span className="coming-soon-badge">Soon</span>
                  </DropdownMenu.Item>
                )
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </nav>
  )
}