# SerizeWeb

보안 연구 & POC 플랫폼

## 구조

```
serizeWeb/
├── frontend/          # React + Vite
├── backend/           # Python FastAPI
├── sandbox/           # 취약점 데모 격리 환경 (Docker)
└── shared/            # 공용 타입/상수
```

## 실행

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn src.main:app --reload
```

### Sandbox
```bash
cd sandbox
docker-compose up -d
```

## 기능

- **Projects**: POC 및 프로젝트 전시
- **Challenges**: 보안 챌린지 (CTF 스타일)
- **Exploits**: 취약점 분석 및 데모
- **Sandbox**: 격리된 환경에서 실제 취약점 시연
