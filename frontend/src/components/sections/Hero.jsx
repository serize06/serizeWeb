import { Link } from 'react-router-dom'
import FadeInSection from '../common/FadeInSection'

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 64px',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative'
    }}>
      <FadeInSection>
        <div style={{
          marginBottom: '16px',
          color: '#64ffda',
          fontSize: '14px',
          fontWeight: '500',
          letterSpacing: '2px'
        }}>
          SECURITY RESEARCH & DEVELOPMENT
        </div>
      </FadeInSection>
      
      <FadeInSection delay={100}>
        <h1 style={{
          fontSize: '64px',
          fontWeight: '700',
          lineHeight: '1.1',
          marginBottom: '24px',
          color: '#ffffff',
          maxWidth: '700px'
        }}>
          Building Security
          <br />
          <span style={{ color: '#64ffda' }}>Breaking Boundaries</span>
        </h1>
      </FadeInSection>
      
      <FadeInSection delay={200}>
        <p style={{
          fontSize: '18px',
          color: '#8892a0',
          maxWidth: '500px',
          lineHeight: '1.7',
          marginBottom: '48px'
        }}>
          POC 개발, 보안 챌린지, 취약점 연구를 한 곳에서.
          실험하고, 배우고, 공유하는 공간.
        </p>
      </FadeInSection>
      
      <FadeInSection delay={300}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link 
            to="/projects" 
            style={{
              padding: '16px 32px',
              background: '#1a1e2e',
              borderRadius: '14px',
              color: '#64ffda',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '6px 6px 12px #10131a, -6px -6px 12px #242a3e',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '8px 8px 16px #10131a, -8px -8px 16px #242a3e, 0 0 20px rgba(100, 255, 218, 0.15)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '6px 6px 12px #10131a, -6px -6px 12px #242a3e'
            }}
          >
            프로젝트 보기
          </Link>
          <Link 
            to="/challenges" 
            style={{
              padding: '16px 32px',
              background: '#1a1e2e',
              borderRadius: '14px',
              color: '#a0a0a0',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: 'inset 3px 3px 6px #10131a, inset -3px -3px 6px #242a3e',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
          >
            챌린지 도전
          </Link>
        </div>
      </FadeInSection>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        color: '#4a4a6a',
        fontSize: '12px',
        animation: 'bounce 2s infinite'
      }}>
        <span>Scroll</span>
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, #64ffda, transparent)'
        }} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }
      `}</style>
    </section>
  )
}
