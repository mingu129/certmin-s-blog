# CLAUDE.md

certmin 개인 블로그. Next.js 16 App Router + Redis 기반 경량 CMS. 레트로 다크 테마.

상세 아키텍처 문서는 [docs/architecture.md](docs/architecture.md) 참고.

## 기술 스택

- **Framework**: Next.js 16.1.1 (App Router, React 19.2, TypeScript 5)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + 전역 CSS (`app/globals.css`) + 인라인 `style` 속성
- **DB**: Redis (`ioredis`) — KV 스토어로 사용
- **Markdown**: `react-markdown` + `rehype-highlight` (atom-one-dark 테마)
- **Editor**: `@uiw/react-md-editor` (관리자용, dynamic import, SSR off)
- **Font**: Manrope (Google Fonts, `next/font`) + DungGeunMo (로컬 픽셀 폰트, 타이틀 전용)
- **기타**: Material Symbols Outlined(아이콘), `highlight.js`, `gray-matter`, `xp.css`

## 디렉토리 구조

```
certmin-s-blog/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (글래스 헤더 + 푸터)
│   ├── page.tsx                  # 홈 (최근 글 10개 + 프로필 사이드바)
│   ├── globals.css               # 전역 CSS + 디자인 토큰(CSS 변수)
│   ├── favicon.ico
│   ├── blog/
│   │   ├── page.tsx              # 전체 글 목록
│   │   └── [slug]/page.tsx       # 글 상세 (Markdown 렌더)
│   ├── admin/
│   │   ├── page.tsx              # 비밀번호 로그인
│   │   ├── write/page.tsx        # 글 목록/관리 대시보드
│   │   ├── write/new/page.tsx    # 신규 글 작성
│   │   ├── edit/[slug]/page.tsx  # 글 수정
│   │   └── settings/page.tsx     # 사이트/프로필 설정
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.ts    # POST 로그인 / DELETE 로그아웃
│   │   │   ├── posts/route.ts    # GET 목록 / POST 작성
│   │   │   ├── posts/[slug]/route.ts  # GET/PUT/DELETE
│   │   │   ├── settings/route.ts # GET/PUT 설정
│   │   │   └── upload/route.ts   # POST 이미지 업로드 (base64 저장)
│   │   └── images/[id]/route.ts  # GET 업로드된 이미지 서빙
│   └── components/               # app 전용 클라이언트 컴포넌트
│       ├── ProfileSidebar.tsx    # 프로필(5연타 시 /admin 이동)
│       ├── PostsWithFilter.tsx   # 태그 필터 가능한 글 목록
│       ├── HiddenAdminTrigger.tsx# 우측 하단 숨은 더블클릭 트리거
│       ├── CursorTrail.tsx
│       ├── DancingBaby.tsx
│       └── MarqueeBar.tsx
├── components/
│   └── MarkdownEditor.tsx        # @uiw/react-md-editor 래퍼 (이미지 붙여넣기 지원)
├── lib/
│   ├── redis.ts                  # ioredis 싱글톤
│   ├── posts.ts                  # getAllPosts / getPostBySlug
│   └── settings.ts               # getSettings / saveSettings
├── proxy.ts                      # /admin/* 경로 토큰 검증 (미들웨어성)
├── public/
│   ├── fonts/DungGeunMo.{woff,woff2}
│   ├── dancing-baby.gif
│   └── pilsung.png
├── docs/architecture.md
├── next.config.ts
├── tsconfig.json                 # paths: @/* → ./*
├── postcss.config.mjs
└── eslint.config.mjs
```

## 명령어

```bash
npm install
npm run dev      # next dev (기본 :3000)
npm run build
npm start
npm run lint
```

## 환경 변수 (값 제외, 키만)

`.env.local`에 설정:

- `REDIS_URL` — Redis 연결 문자열. 미지정 시 `redis://localhost:6379`
- `ADMIN_PASSWORD` — 관리자 로그인 비밀번호 (HMAC 시드로도 사용)
- `NODE_ENV` — 프로덕션일 때 쿠키 `secure` 플래그 on (런타임 자동)

## 데이터 흐름

### Redis 키 구조
- `kv:posts` — sorted set, score=timestamp(ms), member=slug
- `kv:post:{slug}` — JSON (`PostData`)
- `kv:settings` — JSON (`SiteSettings`)
- `kv:image:{id}` — JSON `{ data: base64, mimeType }`

### 읽기 경로
서버 컴포넌트(`app/page.tsx`, `app/blog/...`) → `lib/posts.ts`, `lib/settings.ts` → `lib/redis.ts`. 루트 페이지는 `export const dynamic = 'force-dynamic'`.

### 쓰기 경로 (관리자)
클라이언트(`app/admin/**`) → `fetch('/api/admin/...')` → 라우트 핸들러가 `admin_token` 쿠키 HMAC 검증 → Redis 쓰기.

### 이미지
업로드는 `/api/admin/upload` → base64로 Redis 저장 → `/api/images/{id}` 경로 반환. `react-md-editor`에 붙여넣기(Ctrl+V)하면 자동 업로드 → 마크다운 삽입.

### 인증
- 로그인: `POST /api/admin/login` → HMAC-SHA256(`ADMIN_PASSWORD`, `"admin-session"`) 토큰을 `admin_token` 쿠키(httpOnly, strict, 7일)로 발급.
- 보호: `proxy.ts`의 `matcher: ['/admin/:path+']`가 `/admin/` 하위(로그인 페이지 `/admin` 자체는 제외)를 게이트. `web crypto`(Edge 호환) 사용.
- 관리자 진입점: (1) 프로필 사진 5연타 (`ProfileSidebar`), (2) 우측 하단 투명 영역 더블클릭 (`HiddenAdminTrigger`).

## 스타일 시스템

**디자인 토큰은 `app/globals.css`의 `:root`에 CSS 변수로 정의됨** (Stitch 디자인 시스템 기반, 다크 전용):

```
--bg, --surface, --surface-container, --surface-high, --surface-highest, --surface-bright
--border, --border-subtle
--text, --text-muted
--primary (#b8c4ff), --primary-fixed (#5a7af8), --primary-container, --secondary-container
--error (#f97386), --link, --link-hover, --accent
```

- Tailwind v4 설정 파일은 없음 — PostCSS 플러그인 방식이라 `tailwind.config`가 필요 없고 CSS 변수로 토큰 관리.
- 전역 유틸 클래스: `.blog-container`, `.page-layout`/`.main-col`/`.side-col`, `.sidebar-block`, `.post-list`, `.post-list-item`, `.post-content`, `.btn`, `.btn-primary`, `.tag-pill`, `.hashtag-inline`, `.category-tag`, `.empty-state`, `.site-footer`, `.section-heading`, `.post-main-title`, `.post-meta`, `.nav-link`, `.stat-card`, `.admin-table-row` 등.
- 폰트: 본문 Manrope, 픽셀 타이틀은 `font-family: 'DungGeunMo'`.
- 아이콘: `<span className="material-symbols-outlined">아이콘명</span>`.

## 작업 시 주의 사항

1. **다크 테마 단일** — 현재 다크 팔레트 하나만 지원. 다크/라이트 토글 작업 시 CSS 변수를 `[data-theme="light"]`에 재정의하는 방식이 기존 토큰 구조와 잘 맞음. 레이아웃에 하드코딩된 `#0d0e11`, `#121317`, `#e4e5ed`, `#a9abb2`, `rgba(13,14,17,0.6)` 등의 리터럴 색(특히 `layout.tsx` 인라인 헤더/푸터, `blog/[slug]/page.tsx`, `admin/page.tsx`)도 CSS 변수로 치환해야 함.
2. **Tailwind v4 방식** — `tailwind.config.ts`가 없음. 설정은 PostCSS 플러그인 + CSS에서 처리. `dark:` variant를 쓰려면 `@variant` 설정이 필요.
3. **인라인 스타일이 많음** — 대부분의 페이지가 `style={{ ... }}`로 색/크기를 박아둠. 테마 변경 시 전수 점검 필요.
4. **인증 이중 구현** — `proxy.ts`는 Edge(web crypto), API 라우트는 Node(`crypto` 모듈). HMAC 결과는 동일하지만 수정 시 양쪽 모두 맞춰야 함.
5. **`proxy.ts`는 Next.js 표준 `middleware.ts`가 아님** — 실제 미들웨어로 동작하려면 `middleware.ts`로 파일명이 맞아야 함. 현재 파일명이 `proxy.ts`라 라우팅에 자동 적용되지 않을 가능성이 있음. 인증 강화 시 확인 필요.
6. **이미지를 Redis에 base64로 저장** — 용량이 큰 이미지는 메모리 부담. 장기적으로 오브젝트 스토리지 분리 고려. `next/image`는 `unoptimized`로 사용 중.
7. **서버 컴포넌트 동적 렌더** — 목록/상세가 `force-dynamic`이라 매 요청 Redis 호출. 캐싱 전략 필요 시 `revalidate` 또는 `unstable_cache` 검토.
8. **`app/components/`와 루트 `components/` 공존** — 컴포넌트를 새로 만들 땐 `app/` 내부에서 쓸 거면 `app/components/`, 그 외 공유는 `components/`. 혼선 주의.
9. **스크롤바/커서 등 레트로 연출** — `CursorTrail`, `DancingBaby`, `MarqueeBar` 등 장식 컴포넌트가 있음. 비활성화가 필요하면 레이아웃/페이지에서 제거.
10. **환경 변수 누락 시 조용히 실패** — `lib/posts.ts`가 전부 try/catch로 빈 배열 반환. Redis가 다운되어도 에러 UI가 안 뜨므로 개발 중에는 로그 확인 필요.
