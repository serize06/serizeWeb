import { useState } from 'react'
import { Link } from 'react-router-dom'
import FadeInSection from '../common/FadeInSection'

export default function Featured() {
  const [hoveredCard, setHoveredCard] = useState(null)

  const cards = [
    { 
      tag: 'POC',
      title: 'AI Prompt Injection Demo',
      desc: 'LLM 프롬프트 인젝션 취약점 시연',
      color: '#64ffda',
      link: '/exploits/prompt-injection'
    },
    { 
      tag: 'Challenge',
      title: 'XSS Escape Room',
      desc: '단계별 XSS 필터 우회 챌린지',
      color: '#a78bfa',
      link: '/challenges/xss'
    },
    { 
      tag: 'Exploit',
      title: 'JWT None Algorithm',
      desc: 'JWT 알고리즘 혼동 취약점 분석',
      color: '#f472b6',
      link: '/exploits/jwt'
    }
  ]

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '80px 64px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ width: '100%' }}>
        <FadeInSection>
          <h2 style={{
            fontSize: '14px',
            color: '#64ffda',
            fontWeight: '600',
            letterSpacing: '2px',
            marginBottom: '48px'
          }}>
            FEATURED
          </h2>
        </FadeInSection>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {cards.map((card, i) => (
            <FadeInSection key={i} delay={i * 150}>
              <Link 
                to={card.link} 
                style={{
                  display: 'block',
                  padding: '32px',
                  background: '#1a1e2e',
                  borderRadius: '20px',
                  boxShadow: hoveredCard === i 
                    ? `8px 8px 16px #10131a, -8px -8px 16px #242a3e, 0 0 30px ${card.color}15`
                    : '8px 8px 16px #10131a, -8px -8px 16px #242a3e',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === i ? 'translateY(-4px)' : 'translateY(0)',
                  height: '100%'
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '8px 14px',
                  background: '#1a1e2e',
                  borderRadius: '8px',
                  boxShadow: 'inset 2px 2px 4px #10131a, inset -2px -2px 4px #242a3e',
                  color: card.color,
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  marginBottom: '20px'
                }}>
                  {card.tag}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '12px',
                  lineHeight: '1.3'
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6a7080',
                  lineHeight: '1.6'
                }}>
                  {card.desc}
                </p>
                <div style={{
                  marginTop: '24px',
                  color: card.color,
                  fontSize: '13px',
                  fontWeight: '500',
                  opacity: hoveredCard === i ? 1 : 0.7,
                  transition: 'opacity 0.3s ease'
                }}>
                  자세히 보기 →
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}
