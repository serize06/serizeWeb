import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { projectsAPI, challengesAPI } from '../services/api'

export default function Admin() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [challenges, setChallenges] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [saving, setSaving] = useState(false)

  const [projectForm, setProjectForm] = useState({
    title: '', description: '', image_url: '', github_url: '', demo_url: '', tags: '', is_featured: false, order: 0
  })

  const [challengeForm, setChallengeForm] = useState({
    title: '', description: '', difficulty: 'medium', category: '', points: 100, flag: '', hint: '', file_url: '', order: 0
  })

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user?.is_admin)) {
      navigate('/')
    }
  }, [loading, isAuthenticated, user, navigate])

  useEffect(() => {
    if (user?.is_admin) {
      fetchData()
      setTimeout(() => setIsVisible(true), 100)
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [projectsRes, challengesRes] = await Promise.all([
        projectsAPI.getAll(),
        challengesAPI.getAll()
      ])
      setProjects(projectsRes.data)
      setChallenges(challengesRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const openCreateModal = () => {
    setEditingItem(null)
    if (activeTab === 'projects') {
      setProjectForm({ title: '', description: '', image_url: '', github_url: '', demo_url: '', tags: '', is_featured: false, order: 0 })
    } else {
      setChallengeForm({ title: '', description: '', difficulty: 'medium', category: '', points: 100, flag: '', hint: '', file_url: '', order: 0 })
    }
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    if (activeTab === 'projects') {
      setProjectForm({ ...item })
    } else {
      setChallengeForm({ ...item })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (activeTab === 'projects') {
        if (editingItem) {
          await projectsAPI.update(editingItem.id, projectForm)
        } else {
          await projectsAPI.create(projectForm)
        }
      } else {
        if (editingItem) {
          await challengesAPI.update(editingItem.id, challengeForm)
        } else {
          await challengesAPI.create(challengeForm)
        }
      }
      setShowModal(false)
      fetchData()
    } catch (error) {
      console.error('Failed to save:', error)
      alert('저장 실패: ' + (error.response?.data?.detail || '오류가 발생했습니다'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      if (activeTab === 'projects') {
        await projectsAPI.delete(id)
      } else {
        await challengesAPI.delete(id)
      }
      fetchData()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#1a1e2e',
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxShadow: 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839',
    boxSizing: 'border-box'
  }

  if (loading || !user?.is_admin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64ffda' }}>
        로딩 중...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff', marginBottom: '32px' }}>관리자 페이지</h1>

        {/* 탭 */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <button onClick={() => setActiveTab('projects')} style={{ padding: '12px 24px', background: '#1a1e2e', border: 'none', borderRadius: '12px', color: activeTab === 'projects' ? '#64ffda' : '#6a7080', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: activeTab === 'projects' ? 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839' : '4px 4px 8px #10131a, -4px -4px 8px #242a3e' }}>
            프로젝트
          </button>
          <button onClick={() => setActiveTab('challenges')} style={{ padding: '12px 24px', background: '#1a1e2e', border: 'none', borderRadius: '12px', color: activeTab === 'challenges' ? '#64ffda' : '#6a7080', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: activeTab === 'challenges' ? 'inset 4px 4px 8px #12151f, inset -4px -4px 8px #222839' : '4px 4px 8px #10131a, -4px -4px 8px #242a3e' }}>
            챌린지
          </button>
          <button onClick={openCreateModal} style={{ padding: '12px 24px', background: '#1a1e2e', border: 'none', borderRadius: '12px', color: '#64ffda', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e', marginLeft: 'auto' }}>
            + 추가
          </button>
        </div>

        {/* 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(activeTab === 'projects' ? projects : challenges).map((item) => (
            <div key={item.id} style={{ padding: '24px', background: '#1a1e2e', borderRadius: '16px', boxShadow: '8px 8px 20px #10131a, -8px -8px 20px #242a3e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#6a7080', margin: 0 }}>{item.description?.substring(0, 100)}...</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => openEditModal(item)} style={{ padding: '10px 20px', background: '#1a1e2e', border: 'none', borderRadius: '10px', color: '#64ffda', fontSize: '13px', cursor: 'pointer', boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e' }}>수정</button>
                <button onClick={() => handleDelete(item.id)} style={{ padding: '10px 20px', background: '#1a1e2e', border: 'none', borderRadius: '10px', color: '#f472b6', fontSize: '13px', cursor: 'pointer', boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e' }}>삭제</button>
              </div>
            </div>
          ))}

          {(activeTab === 'projects' ? projects : challenges).length === 0 && (
            <div style={{ padding: '60px', background: '#1a1e2e', borderRadius: '16px', textAlign: 'center' }}>
              <p style={{ color: '#6a7080' }}>등록된 {activeTab === 'projects' ? '프로젝트' : '챌린지'}가 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflow: 'auto', padding: '32px', background: '#1a1e2e', borderRadius: '20px', boxShadow: '20px 20px 60px #10131a' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '24px' }}>
              {editingItem ? '수정' : '추가'} - {activeTab === 'projects' ? '프로젝트' : '챌린지'}
            </h2>

            {activeTab === 'projects' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>제목 *</label>
                  <input value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>설명 *</label>
                  <textarea value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} rows={4} style={{...inputStyle, resize: 'vertical'}} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>이미지 URL</label>
                  <input value={projectForm.image_url} onChange={(e) => setProjectForm({...projectForm, image_url: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>GitHub URL</label>
                  <input value={projectForm.github_url} onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>Demo URL</label>
                  <input value={projectForm.demo_url} onChange={(e) => setProjectForm({...projectForm, demo_url: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>태그 (쉼표로 구분)</label>
                  <input value={projectForm.tags} onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})} placeholder="React, Python, Security" style={inputStyle} />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>제목 *</label>
                  <input value={challengeForm.title} onChange={(e) => setChallengeForm({...challengeForm, title: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>설명 *</label>
                  <textarea value={challengeForm.description} onChange={(e) => setChallengeForm({...challengeForm, description: e.target.value})} rows={4} style={{...inputStyle, resize: 'vertical'}} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>난이도</label>
                  <select value={challengeForm.difficulty} onChange={(e) => setChallengeForm({...challengeForm, difficulty: e.target.value})} style={inputStyle}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>카테고리</label>
                  <input value={challengeForm.category} onChange={(e) => setChallengeForm({...challengeForm, category: e.target.value})} placeholder="web, pwn, crypto, reversing" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>포인트</label>
                  <input type="number" value={challengeForm.points} onChange={(e) => setChallengeForm({...challengeForm, points: parseInt(e.target.value) || 0})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>플래그 (정답)</label>
                  <input value={challengeForm.flag} onChange={(e) => setChallengeForm({...challengeForm, flag: e.target.value})} placeholder="FLAG{...}" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>힌트</label>
                  <input value={challengeForm.hint} onChange={(e) => setChallengeForm({...challengeForm, hint: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6a7080', marginBottom: '8px' }}>파일 URL</label>
                  <input value={challengeForm.file_url} onChange={(e) => setChallengeForm({...challengeForm, file_url: e.target.value})} style={inputStyle} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', background: '#1a1e2e', border: 'none', borderRadius: '12px', color: '#6a7080', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e' }}>취소</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '14px', background: '#1a1e2e', border: 'none', borderRadius: '12px', color: saving ? '#6a7080' : '#64ffda', fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '4px 4px 8px #10131a, -4px -4px 8px #242a3e' }}>
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}