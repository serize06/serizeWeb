import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      padding: '48px 64px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        color: '#4a4a6a',
        fontSize: '13px'
      }}>
        © 2025 SecLab. All rights reserved.
      </div>
      
      <div style={{ display: 'flex', gap: '24px' }}>
        {['GitHub', 'Twitter', 'Contact'].map((link) => (
          <a
            key={link}
            href="#"
            style={{
              color: '#5a5a7a',
              fontSize: '13px',
              transition: 'color 0.2s ease'
            }}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}
