# 🔌 API 클라이언트 구조

이 디렉토리는 HTNS 대시보드의 모든 API 통신을 관리합니다.

## 📁 파일 구조

```
src/lib/api/
├── README.md           # 이 파일
├── index.ts           # 통합 export
├── client.ts          # 일반 API 클라이언트
├── spring-client.ts   # Spring 서버 전용 클라이언트
├── endpoints.ts       # API 엔드포인트 상수
└── interceptors.ts    # HTTP 요청/응답 인터셉터
```

## 🎯 각 파일의 역할

### **1. `client.ts` - 일반 API 클라이언트**
```typescript
import { apiClient } from '@/lib/api/client';

// Next.js API Routes 호출용
const response = await apiClient.get('/some-endpoint');
```

**특징:**
- Next.js API Routes와 통신
- 기본 타임아웃: 10초
- JSON Content-Type 자동 설정

### **2. `spring-client.ts` - Spring 서버 전용 클라이언트**
```typescript
import { callSpringAPI } from '@/lib/api/spring-client';

// Spring 서버 API 호출
const data = await callSpringAPI('/api/some-endpoint', 'POST', { data });
```

**특징:**
- Spring 서버와 통신
- 프록시를 통한 우회
- 쿠키 자동 포함
- 기본 타임아웃: 15초

### **3. `endpoints.ts` - API 엔드포인트 상수**
```typescript
import { API_ENDPOINTS, getFinanceEndpoint } from '@/lib/api/endpoints';

// 엔드포인트 사용
const statusEndpoint = getFinanceEndpoint('status');
const summaryEndpoint = API_ENDPOINTS.FINANCE.SUMMARY;
```

**현재 정의된 엔드포인트:**
- `FINANCE.STATUS`: 재무 현황 조회
- `FINANCE.SUMMARY`: 재무 요약 조회

### **4. `interceptors.ts` - HTTP 인터셉터**
```typescript
// 자동으로 모든 요청에 적용됨
// - 요청 인터셉터: 토큰 자동 추가
// - 응답 인터셉터: 에러 처리
```

## 🔧 사용법

### **일반 API 호출**
```typescript
import { apiClient } from '@/lib/api/client';

// GET 요청
const response = await apiClient.get('/api/data');

// POST 요청
const response = await apiClient.post('/api/data', { key: 'value' });
```

### **Spring 서버 API 호출**
```typescript
import { callSpringAPI } from '@/lib/api/spring-client';

// GET 요청
const data = await callSpringAPI('/api/PORM060101SVC/getFinanceStatus');

// POST 요청
const data = await callSpringAPI('/api/some-endpoint', 'POST', { data });
```

### **엔드포인트 상수 사용**
```typescript
import { getFinanceEndpoint } from '@/lib/api/endpoints';

const statusEndpoint = getFinanceEndpoint('status');
const data = await callSpringAPI(statusEndpoint, 'POST');
```

## 🏗️ 아키텍처 설계

### **클라이언트 분리 이유**
1. **일반 API 클라이언트**: Next.js API Routes와 통신
2. **Spring 클라이언트**: 외부 Spring 서버와 통신
3. **인증 클라이언트**: 인증 관련 API만 처리

### **인터셉터 활용**
- **요청 인터셉터**: 토큰 자동 추가, 로깅
- **응답 인터셉터**: 에러 처리, 응답 변환

### **엔드포인트 관리**
- 중앙화된 엔드포인트 정의
- 타입 안전성 보장
- 유지보수성 향상

## 📊 실제 사용 예시

### **재무 데이터 조회**
```typescript
// src/app/menu/finance/api.ts
import { callSpringAPI } from '@/lib/api/spring-client';
import { getFinanceEndpoint } from '@/lib/api/endpoints';

export const getFinanceStatus = async () => {
  const endpoint = getFinanceEndpoint('status');
  return await callSpringAPI(endpoint, 'POST', {});
};
```

### **인증 처리**
```typescript
// src/app/auth/auth-client.ts
export const loginAPI = async (username: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};
```

## 🔄 마이그레이션 히스토리

### **이전 구조 → 새 구조**
```
client.ts (모든 기능) → client.ts (일반 API) + spring-client.ts (Spring API)
loginAPI/logoutAPI → auth-client.ts로 이동
endpoints.ts → 실제 사용되는 엔드포인트만 남김
```

## 📈 장점

1. **명확한 책임 분리**: 각 클라이언트가 명확한 역할
2. **타입 안전성**: TypeScript로 엔드포인트 관리
3. **재사용성**: 공통 로직을 인터셉터로 분리
4. **유지보수성**: 중앙화된 API 관리
5. **확장성**: 새로운 API 타입 추가 용이

이 구조를 통해 API 통신이 체계적이고 안정적으로 관리됩니다. 