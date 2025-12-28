import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/challenges', label: 'Challenges' },
    { path: '/exploits', label: 'Exploits' },
    { path: '/about', label: 'About' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 64px',
      background: scrolled ? '#1a1e2e' : 'transparent',
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      transition: 'all 0.3s ease',
      zIndex: 1000
    }}>
      <Link to="/" style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#64ffda',
        letterSpacing: '-0.5px'
      }}>
        SecLab
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              color: location.pathname === item.path ? '#64ffda' : '#a0a0a0',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s ease',
              letterSpacing: '0.5px'
            }}
          >
            {item.label}
          </Link>
        ))}
        
        <Link
          to="/login"
          style={{
            padding: '10px 24px',
            background: '#1a1e2e',
            borderRadius: '10px',
            color: '#64ffda',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: location.pathname === '/login' 
              ? 'inset 3px 3px 6px #10131a, inset -3px -3px 6px #242a3e'
              : '4px 4px 10px #10131a, -4px -4px 10px #242a3e',
            transition: 'all 0.3s ease',
            marginLeft: '8px'
          }}
        >
          로그인
        </Link>
      </div>
    </nav>
  )
}
