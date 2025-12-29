import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../services/api'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading, logout, setTokens } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login')
    }
  }, [loading, isAuthenticated, navigate])

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, username: user.username }))
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')

    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      setError('새 비밀번호가 일치하지 않습니다')
      return
    }

    setSaving(true)

    try {
      const updateData = {}
      
      if (formData.username !== user.username) {
        updateData.username = formData.username
      }
      
      if (formData.new_password) {
        updateData.current_password = formData.current_password
        updateData.new_password = formData.new_password
      }

      if (Object.keys(updateData).length === 0) {
        setIsEditing(false)
        return
      }

      await authAPI.updateProfile(updateData)
      
      // 유저 정보 새로고침
      const response = await authAPI.getMe()
      window.location.reload()
      
      setSuccess('프로필이 수정되었습니다')
      setIsEditing(false)
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }))
    } catch (err) {
      setError(err.response?.data?.detail || '오류가 발생했습니다')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: '#1a1e2e',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839'
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

          {/* 에러/성공 메시지 */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#1a1e2e',
              borderRadius: '10px',
              boxShadow: 'inset 3px 3px 6px #10131a, inset -3px -3px 6px #242a3e',
              color: '#f472b6',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              padding: '12px 16px',
              background: '#1a1e2e',
              borderRadius: '10px',
              boxShadow: 'inset 3px 3px 6px #10131a, inset -3px -3px 6px #242a3e',
              color: '#64ffda',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          {/* 정보 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* 사용자명 */}
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
                marginBottom: '8px'
              }}>
                사용자명
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  style={inputStyle}
                />
              ) : (
                <p style={{ fontSize: '15px', color: '#ffffff', margin: 0 }}>
                  {user.username}
                </p>
              )}
            </div>

            {/* 이메일 */}
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
              <p style={{ fontSize: '15px', color: '#ffffff', margin: 0 }}>
                {user.email}
              </p>
            </div>

            {/* 비밀번호 변경 (편집 모드) */}
            {isEditing && (
              <>
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
                    marginBottom: '8px'
                  }}>
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    placeholder="비밀번호 변경 시에만 입력"
                    style={inputStyle}
                  />
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
                    marginBottom: '8px'
                  }}>
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    placeholder="8자 이상"
                    style={inputStyle}
                  />
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
                    marginBottom: '8px'
                  }}>
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="새 비밀번호 다시 입력"
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {/* 가입일 */}
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
              <p style={{ fontSize: '15px', color: '#ffffff', margin: 0 }}>
                {new Date(user.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    username: user.username,
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                  })
                  setError('')
                }}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: '#1a1e2e',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#6a7080',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '6px 6px 12px #10131a, -6px -6px 12px #242a3e'
                }}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: '#1a1e2e',
                  border: 'none',
                  borderRadius: '14px',
                  color: saving ? '#6a7080' : '#64ffda',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  boxShadow: '6px 6px 12px #10131a, -6px -6px 12px #242a3e'
                }}
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
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
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '4px 4px 8px #10131a, -4px -4px 8px #242a3e, 0 0 20px rgba(100, 255, 218, 0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '6px 6px 12px #10131a, -6px -6px 12px #242a3e'
              }}
            >
              프로필 수정
            </button>
          )}

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
          >
            로그아웃
          </button>
        </div>
      </div>

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