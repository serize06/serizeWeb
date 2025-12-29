import { useState, useEffect } from 'react'
import FadeInSection from '../common/FadeInSection'
import { projectsAPI, challengesAPI } from '../../services/api'

export default function Stats() {
  const [stats, setStats] = useState([
    { number: '0', label: 'Projects' },
    { number: '0', label: 'Challenges' },
    { number: '0', label: 'Exploits' }
  ])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [projectsRes, challengesRes] = await Promise.all([
        projectsAPI.getAll(),
        challengesAPI.getAll()
      ])
      
      setStats([
        { number: String(projectsRes.data.length), label: 'Projects' },
        { number: String(challengesRes.data.length), label: 'Challenges' },
        { number: '0', label: 'Exploits' }
      ])
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  return (
    <section style={{
      minHeight: '60vh',
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
            OVERVIEW
          </h2>
        </FadeInSection>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          {stats.map((stat, i) => (
            <FadeInSection key={i} delay={i * 150}>
              <div 
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '40px',
                  background: '#1a1e2e',
                  borderRadius: '20px',
                  boxShadow: 'inset 4px 4px 8px #10131a, inset -4px -4px 8px #242a3e',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: '#64ffda',
                  marginBottom: '8px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6a7080',
                  fontWeight: '500',
                  letterSpacing: '1px'
                }}>
                  {stat.label}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}