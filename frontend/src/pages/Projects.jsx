import { useState, useEffect } from 'react'
import { projectsAPI } from '../services/api'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    fetchProjects()
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll()
      setProjects(response.data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
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
        top: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(100, 255, 218, 0.08) 0%, transparent 70%)',
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
            Projects
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6a7080',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            보안 연구 및 개발 프로젝트들
          </p>
        </div>

        {/* 프로젝트 목록 */}
        {projects.length === 0 ? (
          <div style={{
            padding: '60px',
            background: '#1a1e2e',
            borderRadius: '24px',
            boxShadow: '20px 20px 60px #10131a, -20px -20px 60px #242a3e',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6a7080', fontSize: '16px' }}>
              아직 등록된 프로젝트가 없습니다.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {projects.map((project, index) => (
              <div
                key={project.id}
                style={{
                  padding: '32px',
                  background: '#1a1e2e',
                  borderRadius: '20px',
                  boxShadow: '10px 10px 30px #10131a, -10px -10px 30px #242a3e',
                  transition: 'all 0.3s ease',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${index * 0.1}s`
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
                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '20px'
                    }}
                  />
                )}
                
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '12px'
                }}>
                  {project.title}
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#8892a0',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  {project.description}
                </p>

                {project.tags && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    {project.tags.split(',').map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '4px 12px',
                          background: '#12151f',
                          borderRadius: '20px',
                          fontSize: '12px',
                          color: '#64ffda'
                        }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  {project.github_url && (
                    
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 20px',
                        background: '#1a1e2e',
                        borderRadius: '10px',
                        boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e',
                        color: '#64ffda',
                        fontSize: '13px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      GitHub
                    </a>
                  )}
                  {project.demo_url && (
                    
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 20px',
                        background: '#1a1e2e',
                        borderRadius: '10px',
                        boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e',
                        color: '#a78bfa',
                        fontSize: '13px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}