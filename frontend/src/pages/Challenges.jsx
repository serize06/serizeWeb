import { useState, useEffect } from 'react'
import { challengesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Challenges() {
  const { isAuthenticated } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [flag, setFlag] = useState('')
  const [submitResult, setSubmitResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchChallenges()
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const fetchChallenges = async () => {
    try {
      const response = await challengesAPI.getAll()
      setChallenges(response.data)
    } catch (error) {
      console.error('Failed to fetch challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFlag = async () => {
    if (!flag.trim() || !selectedChallenge) return
    
    setSubmitting(true)
    setSubmitResult(null)

    try {
      const response = await challengesAPI.submitFlag(selectedChallenge.id, flag)
      setSubmitResult(response.data)
      if (response.data.correct) {
        setFlag('')
      }
    } catch (error) {
      setSubmitResult({ correct: false, message: '오류가 발생했습니다' })
    } finally {
      setSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#64ffda'
      case 'medium': return '#fbbf24'
      case 'hard': return '#f472b6'
      default: return '#6a7080'
    }
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

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 24px 80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 배경 */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* 헤더 */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px'
          }}>
            Challenges
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6a7080',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            보안 챌린지를 풀고 실력을 키워보세요
          </p>
        </div>

        {/* 챌린지 목록 */}
        {challenges.length === 0 ? (
          <div style={{
            padding: '60px',
            background: '#1a1e2e',
            borderRadius: '24px',
            boxShadow: '20px 20px 60px #10131a, -20px -20px 60px #242a3e',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6a7080', fontSize: '16px' }}>
              아직 등록된 챌린지가 없습니다.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {challenges.map((challenge, index) => (
              <div
                key={challenge.id}
                style={{
                  padding: '32px',
                  background: '#1a1e2e',
                  borderRadius: '20px',
                  boxShadow: '10px 10px 30px #10131a, -10px -10px 30px #242a3e',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${index * 0.1}s`
                }}
                onClick={() => {
                  setSelectedChallenge(challenge)
                  setFlag('')
                  setSubmitResult(null)
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '15px 15px 40px #10131a, -15px -15px 40px #242a3e'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '10px 10px 30px #10131a, -10px -10px 30px #242a3e'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    {challenge.title}
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    background: '#12151f',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: getDifficultyColor(challenge.difficulty),
                    fontWeight: '600'
                  }}>
                    {challenge.difficulty}
                  </span>
                </div>

                <p style={{
                  fontSize: '14px',
                  color: '#8892a0',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  {challenge.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  {challenge.category && (
                    <span style={{
                      padding: '4px 12px',
                      background: '#12151f',
                      borderRadius: '20px',
                      fontSize: '12px',
                      color: '#a78bfa'
                    }}>
                      {challenge.category}
                    </span>
                  )}
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#64ffda'
                  }}>
                    {challenge.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 챌린지 모달 */}
      {selectedChallenge && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
          onClick={() => setSelectedChallenge(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '40px',
              background: '#1a1e2e',
              borderRadius: '24px',
              boxShadow: '20px 20px 60px #10131a, -20px -20px 60px #242a3e'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff'
              }}>
                {selectedChallenge.title}
              </h2>
              <button
                onClick={() => setSelectedChallenge(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6a7080',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <span style={{
                padding: '4px 12px',
                background: '#12151f',
                borderRadius: '20px',
                fontSize: '12px',
                color: getDifficultyColor(selectedChallenge.difficulty)
              }}>
                {selectedChallenge.difficulty}
              </span>
              {selectedChallenge.category && (
                <span style={{
                  padding: '4px 12px',
                  background: '#12151f',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color: '#a78bfa'
                }}>
                  {selectedChallenge.category}
                </span>
              )}
              <span style={{
                padding: '4px 12px',
                background: '#12151f',
                borderRadius: '20px',
                fontSize: '12px',
                color: '#64ffda'
              }}>
                {selectedChallenge.points} pts
              </span>
            </div>

            <p style={{
              fontSize: '14px',
              color: '#8892a0',
              lineHeight: '1.8',
              marginBottom: '24px'
            }}>
              {selectedChallenge.description}
            </p>

            {selectedChallenge.hint && (
              <div style={{
                padding: '16px',
                background: '#12151f',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#6a7080',
                  marginBottom: '4px'
                }}>
                  힌트
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#fbbf24',
                  margin: 0
                }}>
                  {selectedChallenge.hint}
                </p>
              </div>
            )}

            {selectedChallenge.file_url && (
              
                href={selectedChallenge.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: '#1a1e2e',
                  borderRadius: '10px',
                  boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e',
                  color: '#64ffda',
                  fontSize: '13px',
                  textDecoration: 'none',
                  marginBottom: '24px'
                }}
              >
                📁 파일 다운로드
              </a>
            )}

            {isAuthenticated ? (
              <>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="FLAG{...}"
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      background: '#1a1e2e',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      boxShadow: 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSubmitFlag()
                    }}
                  />
                  <button
                    onClick={handleSubmitFlag}
                    disabled={submitting || !flag.trim()}
                    style={{
                      padding: '14px 24px',
                      background: '#1a1e2e',
                      border: 'none',
                      borderRadius: '12px',
                      color: submitting ? '#6a7080' : '#64ffda',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e'
                    }}
                  >
                    {submitting ? '확인 중...' : '제출'}
                  </button>
                </div>

                {submitResult && (
                  <div style={{
                    padding: '12px 16px',
                    background: '#12151f',
                    borderRadius: '10px',
                    color: submitResult.correct ? '#64ffda' : '#f472b6',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {submitResult.message}
                  </div>
                )}
              </>
            ) : (
              <p style={{
                padding: '16px',
                background: '#12151f',
                borderRadius: '12px',
                color: '#6a7080',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                플래그를 제출하려면 로그인하세요
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        input::placeholder {
          color: #4a5060;
        }
      `}</style>
    </div>
  )
}