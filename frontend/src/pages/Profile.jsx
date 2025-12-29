import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading, logout } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login')
    }
  }, [loading, isAuthenticated, navigate])

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64ffda'
      }}>
        로딩 중...
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{
      minHeight: '100vh',
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
        maxWidth: '600px',
        margin: '0 auto',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* 프로필 카드 */}
        <div style={{
          padding: '48px',
          background: '#1a1e2e',
          borderRadius: '24px',
          boxShadow: '20px 20px 60px #10131a, -20px -20px 60px #242a3e',
          marginBottom: '24px'
        }}>
          {/* 아바타 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #64ffda 0%, #a78bfa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: '700',
              color: '#1a1e2e',
              marginBottom: '16px',
              boxShadow: '8px 8px 20px #10131a, -8px -8px 20px #242a3e'
            }}>
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '4px'
            }}>
              {user.username}
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#64ffda'
            }}>
              {user.is_admin ? '관리자' : '멤버'}
            </p>
          </div>

          {/* 정보 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px 20px',
              background: '#1a1e2e',
              borderRadius: '12px',
              boxShadow: 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#6a7080',
                marginBottom: '4px'
              }}>
                이메일
              </label>
              <p style={{
                fontSize: '15px',
                color: '#ffffff',
                margin: 0
              }}>
                {user.email}
              </p>
            </div>

            <div style={{
              padding: '16px 20px',
              background: '#1a1e2e',
              borderRadius: '12px',
              boxShadow: 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#6a7080',
                marginBottom: '4px'
              }}>
                가입일
              </label>
              <p style={{
                fontSize: '15px',
                color: '#ffffff',
                margin: 0
              }}>
                {new Date(user.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div style={{
              padding: '16px 20px',
              background: '#1a1e2e',
              borderRadius: '12px',
              boxShadow: 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#6a7080',
                marginBottom: '4px'
              }}>
                계정 상태
              </label>
              <p style={{
                fontSize: '15px',
                color: user.is_active ? '#64ffda' : '#f472b6',
                margin: 0
              }}>
                {user.is_active ? '활성' : '비활성'}
              </p>
            </div>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '16px',
            background: '#1a1e2e',
            border: 'none',
            borderRadius: '14px',
            color: '#f472b6',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '6px 6px 12px #10131a, -6px -6px 12px #242a3e',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '4px 4px 8px #10131a, -4px -4px 8px #242a3e, 0 0 20px rgba(244, 114, 182, 0.15)'
          }}
          onMouseOut={(e) => {
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
          로그아웃
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}