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
      padding: '24px 64px',
      background: scrolled ? 'rgba(26, 26, 46, 0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
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
        
        {/* 로그인 버튼 */}
        <Link
          to="/login"
          style={{
            padding: '10px 24px',
            background: location.pathname === '/login' 
              ? 'linear-gradient(145deg, #1e2a4a, #182035)' 
              : 'transparent',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            borderRadius: '8px',
            color: '#64ffda',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            marginLeft: '16px'
          }}
        >
          로그인
        </Link>
      </div>
    </nav>
  )
}
