import { useState, useEffect } from 'react'

export default function Challenges() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const challenges = [
    {
      title: 'XSS Escape Room',
      desc: '단계별 XSS 필터 우회 챌린지',
      difficulty: 'Medium',
      color: '#f59e0b',
      points: 100
    },
    {
      title: 'SQL Injection Lab',
      desc: 'SQL 인젝션 기초부터 고급까지',
      difficulty: 'Hard',
      color: '#ef4444',
      points: 200
    },
    {
      title: 'JWT Cracker',
      desc: 'JWT 토큰 취약점 찾기',
      difficulty: 'Easy',
      color: '#22c55e',
      points: 50
    },
    {
      title: 'CSRF Attack',
      desc: 'CSRF 공격 시나리오 실습',
      difficulty: 'Medium',
      color: '#f59e0b',
      points: 100
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      padding: '120px 64px 80px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease'
      }}>
        <h1 style={{ 
          color: '#ffffff', 
          fontSize: '48px', 
          marginBottom: '16px',
          fontWeight: '700'
        }}>
          Challenges
        </h1>
        <p style={{ 
          color: '#8892a0', 
          marginBottom: '48px',
          fontSize: '18px'
        }}>
          보안 챌린지를 풀고 실력을 테스트하세요
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        {challenges.map((challenge, i) => (
          <div
            key={i}
            style={{
              padding: '32px',
              background: '#1a1e2e',
              borderRadius: '20px',
              boxShadow: hoveredCard === i 
                ? `10px 10px 20px #10131a, -10px -10px 20px #242a3e, 0 0 30px ${challenge.color}20`
                : '8px 8px 16px #10131a, -8px -8px 16px #242a3e',
              transition: 'all 0.3s ease',
              transform: hoveredCard === i ? 'translateY(-4px)' : 'translateY(0)',
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${i * 100}ms`,
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
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
                padding: '6px 12px',
                background: '#1a1e2e',
                borderRadius: '8px',
                boxShadow: 'inset 2px 2px 4px #10131a, inset -2px -2px 4px #242a3e',
                color: challenge.color,
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {challenge.difficulty}
              </span>
            </div>
            <p style={{
              color: '#6a7080',
              fontSize: '14px',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              {challenge.desc}
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                color: '#64ffda',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {challenge.points} pts
              </span>
              <button
                style={{
                  padding: '10px 20px',
                  background: '#1a1e2e',
                  borderRadius: '10px',
                  color: '#64ffda',
                  fontSize: '13px',
                  fontWeight: '600',
                  boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 3px 3px 6px #10131a, inset -3px -3px 6px #242a3e'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 8px #10131a, -4px -4px 8px #242a3e'
                }}
              >
                도전하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
