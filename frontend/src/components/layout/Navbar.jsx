import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setShowDropdown(false)
    navigate('/')
  }

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
        
        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                background: '#1a1e2e',
                borderRadius: '10px',
                color: '#64ffda',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: showDropdown 
                  ? 'inset 3px 3px 6px #10131a, inset -3px -3px 6px #242a3e'
                  : '4px 4px 10px #10131a, -4px -4px 10px #242a3e',
                transition: 'all 0.3s ease',
                marginLeft: '8px',
                cursor: 'pointer'
              }}
            >
              <span style={{
                width: '28px',
                height: '28px',
                background: '#1a1e2e',
                borderRadius: '50%',
                boxShadow: 'inset 2px 2px 4px #10131a, inset -2px -2px 4px #242a3e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                {user?.username?.charAt(0).toUpperCase()}
              </span>
              {user?.username}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{
                  transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '12px',
                background: '#1a1e2e',
                borderRadius: '14px',
                boxShadow: '10px 10px 30px #10131a, -10px -10px 30px #242a3e',
                padding: '8px',
                minWidth: '180px',
                animation: 'fadeIn 0.2s ease'
              }}>
                <Link
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: '#a0a0a0',
                    fontSize: '14px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(100, 255, 218, 0.1)'
                    e.currentTarget.style.color = '#64ffda'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#a0a0a0'
                  }}
                >
                  프로필
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: '#a0a0a0',
                    fontSize: '14px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(100, 255, 218, 0.1)'
                    e.currentTarget.style.color = '#64ffda'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#a0a0a0'
                  }}
                >
                  설정
                </Link>
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, #2a2e3e, transparent)',
                  margin: '8px 0'
                }} />
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 16px',
                    color: '#f472b6',
                    fontSize: '14px',
                    borderRadius: '8px',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 114, 182, 0.1)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
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
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}
