# certmin

개인 블로그 웹사이트입니다. 레트로 감성의 다크 테마와 Redis 기반 CMS를 갖추고 있습니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19, Tailwind CSS v4
- **Database**: Redis (ioredis)
- **Font**: DungGeunMo (한국어 픽셀 폰트)

## 주요 기능

- 블로그 글 작성 / 수정 / 삭제
- 마크다운 렌더링
- 관리자 인증 (HMAC-SHA256 쿠키 기반)
- 레트로 UI (픽셀 폰트, 다크 테마)

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```bash
REDIS_URL=redis://localhost:6379
ADMIN_PASSWORD=your-secret-password
```

### 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 됩니다.

## 관리자 페이지

사이드바의 춤추는 아기 GIF를 **더블클릭**하면 `/admin` 로그인 페이지로 이동합니다.

## 문서

프로젝트 전체 아키텍처는 [docs/architecture.md](docs/architecture.md)를 참고하세요.
