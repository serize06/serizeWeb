import { useState, useEffect } from 'react'

export default function Projects() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const projects = [
    {
      title: 'AI Security Scanner',
      desc: 'AI 기반 웹 취약점 자동 스캐너',
      tags: ['Python', 'AI', 'Security'],
      status: 'In Progress'
    },
    {
      title: 'JWT Toolkit',
      desc: 'JWT 토큰 분석 및 테스트 도구',
      tags: ['Node.js', 'JWT'],
      status: 'Completed'
    },
    {
      title: 'XSS Hunter',
      desc: 'XSS 취약점 탐지 및 페이로드 생성기',
      tags: ['JavaScript', 'XSS'],
      status: 'Completed'
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
          Projects
        </h1>
        <p style={{ 
          color: '#8892a0', 
          marginBottom: '48px',
          fontSize: '18px'
        }}>
          POC 및 보안 도구 프로젝트 모음
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        {projects.map((project, i) => (
          <div
            key={i}
            style={{
              padding: '32px',
              background: '#1a1e2e',
              borderRadius: '20px',
              boxShadow: hoveredCard === i 
                ? '10px 10px 20px #10131a, -10px -10px 20px #242a3e, 0 0 30px rgba(100, 255, 218, 0.1)'
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
                {project.title}
              </h3>
              <span style={{
                padding: '6px 12px',
                background: '#1a1e2e',
                borderRadius: '8px',
                boxShadow: 'inset 2px 2px 4px #10131a, inset -2px -2px 4px #242a3e',
                color: project.status === 'Completed' ? '#64ffda' : '#f472b6',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {project.status}
              </span>
            </div>
            <p style={{
              color: '#6a7080',
              fontSize: '14px',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              {project.desc}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {project.tags.map((tag, j) => (
                <span
                  key={j}
                  style={{
                    padding: '6px 12px',
                    background: '#1a1e2e',
                    borderRadius: '6px',
                    boxShadow: '3px 3px 6px #10131a, -3px -3px 6px #242a3e',
                    color: '#8892a0',
                    fontSize: '12px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
