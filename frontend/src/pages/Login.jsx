import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  })
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(isLogin ? 'Login:' : 'Register:', formData)
  }

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '14px 16px',
    background: '#1a1e2e',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    boxShadow: focusedField === fieldName 
      ? 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839, 0 0 20px rgba(100, 255, 218, 0.1)' 
      : 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839',
    transform: focusedField === fieldName ? 'scale(1.01)' : 'scale(1)'
  })

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 배경 애니메이션 */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(100, 255, 218, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '48px',
        background: '#1a1e2e',
        borderRadius: '24px',
        boxShadow: '20px 20px 60px #10131a, -20px -20px 60px #242a3e',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* 탭 전환 */}
        <div style={{
          display: 'flex',
          marginBottom: '32px',
          background: '#1a1e2e',
          borderRadius: '14px',
          padding: '6px',
          boxShadow: 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839',
          position: 'relative'
        }}>
          {/* 슬라이딩 배경 */}
          <div style={{
            position: 'absolute',
            top: '6px',
            left: isLogin ? '6px' : 'calc(50% + 3px)',
            width: 'calc(50% - 9px)',
            height: 'calc(100% - 12px)',
            background: '#1a1e2e',
            borderRadius: '10px',
            transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '4px 4px 10px #10131a, -4px -4px 10px #242a3e'
          }} />
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: isLogin ? '#64ffda' : '#6a7080',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              position: 'relative',
              zIndex: 1
            }}
          >
            로그인
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: !isLogin ? '#64ffda' : '#6a7080',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              position: 'relative',
              zIndex: 1
            }}
          >
            회원가입
          </button>
        </div>

        {/* 헤더 */}
        <div style={{ 
          marginBottom: '32px', 
          textAlign: 'center',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6a7080'
          }}>
            {isLogin ? '계정에 로그인하세요' : '새 계정을 만드세요'}
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 회원가입 시 사용자명 필드 */}
          <div style={{
            overflow: 'hidden',
            maxHeight: !isLogin ? '100px' : '0',
            opacity: !isLogin ? 1 : 0,
            marginBottom: !isLogin ? '20px' : '0',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#8892a0',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              사용자명
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              placeholder="username"
              style={inputStyle('username')}
            />
          </div>

          <div style={{ 
            marginBottom: '20px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
          }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#8892a0',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="example@email.com"
              style={inputStyle('email')}
            />
          </div>

          <div style={{ 
            marginBottom: '24px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
          }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#8892a0',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              style={inputStyle('password')}
            />
          </div>

          {isLogin && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '24px',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.4s'
            }}>
              <Link to="/forgot-password" style={{
                fontSize: '13px',
                color: '#64ffda',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease'
              }}>
                비밀번호 찾기
              </Link>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: '#1a1e2e',
              border: 'none',
              borderRadius: '14px',
              color: '#64ffda',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '6px 6px 12px #10131a, -6px -6px 12px #242a3e',
              transition: 'all 0.3s ease',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '0.4s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '4px 4px 8px #10131a, -4px -4px 8px #242a3e, 0 0 20px rgba(100, 255, 218, 0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '6px 6px 12px #10131a, -6px -6px 12px #242a3e'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #10131a, inset -4px -4px 8px #242a3e'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow = '6px 6px 12px #10131a, -6px -6px 12px #242a3e'
            }}
          >
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        {/* 소셜 로그인 */}
        <div style={{ 
          marginTop: '32px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #2a2e3e, transparent)' }} />
            <span style={{ fontSize: '12px', color: '#6a7080' }}>또는</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #2a2e3e, transparent)' }} />
          </div>

          <button
            style={{
              width: '100%',
              padding: '14px',
              background: '#1a1e2e',
              border: 'none',
              borderRadius: '12px',
              color: '#a0a0a0',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '6px 6px 12px #10131a, -6px -6px 12px #242a3e',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#64ffda'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '4px 4px 8px #10131a, -4px -4px 8px #242a3e, 0 0 15px rgba(100, 255, 218, 0.1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#a0a0a0'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '6px 6px 12px #10131a, -6px -6px 12px #242a3e'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #10131a, inset -4px -4px 8px #242a3e'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow = '6px 6px 12px #10131a, -6px -6px 12px #242a3e'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub로 계속하기
          </button>
        </div>
      </div>

      {/* 애니메이션 keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        input::placeholder {
          color: #4a5060;
        }
      `}</style>
    </div>
  )
}