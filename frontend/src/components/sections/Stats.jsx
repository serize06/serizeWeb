import FadeInSection from '../common/FadeInSection'

export default function Stats() {
  const stats = [
    { number: '12', label: 'Projects' },
    { number: '8', label: 'Challenges' },
    { number: '5', label: 'Exploits' }
  ]

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
              <div style={{
                flex: 1,
                minWidth: '200px',
                padding: '40px',
                background: 'linear-gradient(145deg, #1e2235, #171a28)',
                borderRadius: '20px',
                boxShadow: 'inset 4px 4px 8px #0f1018, inset -4px -4px 8px #252a3a',
                textAlign: 'center'
              }}>
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
