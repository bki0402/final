# Triple 여행 애플리케이션

트리플(Triple) 여행 앱을 벤치마킹한 웹/앱 서비스입니다.

## 프로젝트 구조

3티어 아키텍처로 구성되어 있습니다:

- **Presentation Tier**: React + TypeScript (프론트엔드)
- **Application Tier**: Node.js + Express (백엔드 API)
- **Data Tier**: PostgreSQL (데이터베이스)

## 주요 기능

- 여행지 검색 및 추천
- 여행 일정 계획 및 관리
- 여행지 상세 정보 조회
- 사용자 인증 및 프로필 관리
- 여행 일정 저장 및 공유

## 시작하기

### 사전 요구사항

- Docker
- Docker Compose

### 실행 방법

1. 저장소 클론:
```bash
git clone https://github.com/bki0402/final.git
cd final
```

2. Docker Compose로 서비스 실행:
```bash
docker-compose up -d
```

3. 서비스 접속:
   - 프론트엔드: http://localhost:3000
   - 백엔드 API: http://localhost:3001
   - 데이터베이스: localhost:5432

### 서비스 중지

```bash
docker-compose down
```

데이터를 유지하면서 중지하려면:
```bash
docker-compose down -v
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 여행지
- `GET /api/destinations` - 여행지 목록 조회
- `GET /api/destinations/:id` - 여행지 상세 정보
- `GET /api/destinations/search?q=keyword` - 여행지 검색

### 여행 일정
- `GET /api/trips` - 여행 일정 목록
- `POST /api/trips` - 여행 일정 생성
- `GET /api/trips/:id` - 여행 일정 상세
- `PUT /api/trips/:id` - 여행 일정 수정
- `DELETE /api/trips/:id` - 여행 일정 삭제

## 기술 스택

### Frontend
- React 18
- TypeScript
- React Router
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- JWT (인증)

### Infrastructure
- Docker
- Docker Compose

## 개발 환경

이 프로젝트는 강의실 내부 네트워크에서만 사용하도록 설계되었습니다.

## 라이선스

MIT

# final
