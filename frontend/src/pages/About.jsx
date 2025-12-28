import { useState, useEffect } from 'react'

export default function About() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const skills = ['Python', 'JavaScript', 'Security Research', 'Penetration Testing', 'AI/ML', 'Web Development']

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      padding: '120px 64px 80px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* 왼쪽: 프로필 카드 */}
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'all 0.6s ease'
        }}>
          <div style={{
            padding: '48px',
            background: '#1a1e2e',
            borderRadius: '24px',
            boxShadow: '20px 20px 60px #10131a, -20px -20px 60px #242a3e',
            textAlign: 'center'
          }}>
            {/* 프로필 이미지 플레이스홀더 */}
            <div style={{
              width: '120px',
              height: '120px',
              background: '#1a1e2e',
              borderRadius: '50%',
              boxShadow: 'inset 6px 6px 12px #10131a, inset -6px -6px 12px #242a3e',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: '#64ffda'
            }}>
              👤
            </div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '8px'
            }}>
              Serize
            </h2>
            <p style={{
              color: '#64ffda',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              Security Researcher
            </p>
            <p style={{
              color: '#6a7080',
              fontSize: '14px',
              lineHeight: '1.7'
            }}>
              보안 연구와 개발을 좋아하는 사람입니다.
              취약점을 찾고, 분석하고, 공유합니다.
            </p>
          </div>
        </div>

        {/* 오른쪽: 스킬 & 정보 */}
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
          transition: 'all 0.6s ease 0.2s'
        }}>
          <h1 style={{ 
            color: '#ffffff', 
            fontSize: '48px', 
            marginBottom: '16px',
            fontWeight: '700'
          }}>
            About
          </h1>
          <p style={{ 
            color: '#8892a0', 
            marginBottom: '32px',
            fontSize: '18px',
            lineHeight: '1.7'
          }}>
            이 사이트는 보안 연구 결과와 POC를 공유하고,
            다양한 보안 챌린지를 통해 함께 배우기 위한 공간입니다.
          </p>

          <h3 style={{
            color: '#64ffda',
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '2px',
            marginBottom: '20px'
          }}>
            SKILLS
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '40px'
          }}>
            {skills.map((skill, i) => (
              <span
                key={i}
                style={{
                  padding: '10px 18px',
                  background: '#1a1e2e',
                  borderRadius: '10px',
                  boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e',
                  color: '#a0a0a0',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          <h3 style={{
            color: '#64ffda',
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '2px',
            marginBottom: '20px'
          }}>
            CONTACT
          </h3>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            {['GitHub', 'Twitter', 'Email'].map((contact, i) => (
              <button
                key={i}
                style={{
                  padding: '12px 24px',
                  background: '#1a1e2e',
                  borderRadius: '12px',
                  color: '#8892a0',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#64ffda'
                  e.currentTarget.style.boxShadow = 'inset 3px 3px 6px #10131a, inset -3px -3px 6px #242a3e'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#8892a0'
                  e.currentTarget.style.boxShadow = '4px 4px 8px #10131a, -4px -4px 8px #242a3e'
                }}
              >
                {contact}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
