# 🔐 Auth 디렉토리 구조

이 디렉토리는 HTNS 대시보드의 모든 인증 관련 기능을 통합 관리합니다.

## 📁 파일 구조

```
src/app/auth/
├── page.tsx              # 로그인 UI 페이지
├── login.api.ts          # 로그인 API 로직
├── logout.api.ts         # 로그아웃 API 로직
├── proxy.api.ts          # Spring 서버 프록시 API
├── auth.types.ts         # 인증 관련 타입 정의
└── README.md            # 이 파일
```

## 🚀 주요 기능

### 1. **로그인 시스템** (`login.api.ts`)
- Spring 서버와의 CSRF 토큰 교환
- 폼 기반 인증 처리
- 세션 쿠키 관리
- 다양한 응답 패턴 처리

### 2. **로그아웃 시스템** (`logout.api.ts`)
- Spring 서버 세션 무효화
- 클라이언트 쿠키 정리
- 안전한 로그아웃 처리

### 3. **프록시 시스템** (`proxy.api.ts`)
- Spring 서버와의 모든 API 통신
- 쿠키 및 헤더 전달
- 다양한 HTTP 메서드 지원

### 4. **UI 컴포넌트** (`page.tsx`)
- 사용자 친화적인 로그인 인터페이스
- 실시간 상태 표시
- 에러 처리 및 피드백

## 🔧 사용법

### 로그인
```typescript
import { loginAPI } from '@/lib/api/client';

const result = await loginAPI(username, password);
if (result.success) {
  // 로그인 성공
  localStorage.setItem('user', JSON.stringify(result.user));
}
```

### 로그아웃
```typescript
import { logoutAPI } from '@/lib/api/client';

const result = await logoutAPI();
if (result.success) {
  // 로그아웃 성공
  localStorage.removeItem('user');
}
```

### Spring 서버 API 호출
```typescript
import { callSpringAPI } from '@/lib/api/client';

const data = await callSpringAPI('/api/some-endpoint', 'GET');
```

## 🔗 API Routes

Next.js API Routes는 다음과 같이 구성됩니다:

```
src/app/api/auth/
├── login/route.ts        # /api/auth/login
├── logout/route.ts       # /api/auth/logout
└── proxy/route.ts        # /api/auth/proxy
```

## 🛡️ 보안 고려사항

1. **CSRF 보호**: Spring 서버의 CSRF 토큰을 자동으로 처리
2. **세션 관리**: JSESSIONID 쿠키를 안전하게 관리
3. **에러 처리**: 민감한 정보가 노출되지 않도록 처리
4. **쿠키 보안**: HttpOnly, Secure 플래그 적용

## 🔄 워크플로우

1. **로그인 시도** → CSRF 토큰 요청 → 로그인 요청 → 세션 생성
2. **API 호출** → 프록시를 통한 Spring 서버 통신
3. **로그아웃** → 세션 무효화 → 쿠키 정리

## 📝 참고사항

- 모든 Spring 서버 통신은 `https://lv1.htns.com`을 대상으로 합니다
- 쿠키는 자동으로 관리되며, 사용자가 직접 조작할 필요가 없습니다
- 에러 발생 시 자동으로 로그인 페이지로 리다이렉트됩니다 