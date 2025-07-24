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

---

## 🤔 **왜 프록시 서버를 사용하는가?**

### **1. CORS (Cross-Origin Resource Sharing) 문제**
- **문제**: 브라우저의 Same-Origin Policy로 인해 `localhost:3000`에서 `https://lv1.htns.com`으로 직접 요청 불가
- **해결**: Next.js API Routes가 프록시 역할을 하여 CORS 제한 우회

### **2. 쿠키 및 세션 관리 복잡성**
- **문제**: Spring 서버의 JSESSIONID, CSRF 토큰 등 복잡한 쿠키 관리
- **해결**: 서버 사이드에서 쿠키를 안전하게 처리하고 클라이언트에 전달

### **3. 보안 강화**
- **문제**: 클라이언트에서 직접 Spring 서버 접근 시 보안 위험
- **해결**: 프록시를 통한 중간 검증 및 로깅

### **4. 헤더 및 인증 처리**
- **문제**: Spring Security의 복잡한 인증 헤더 요구사항
- **해결**: 서버 사이드에서 정확한 헤더 구성 및 전달

---

## ❌ **왜 NextAuth.js를 사용하지 않는가?**

### **1. Spring 서버와의 호환성 문제**
- **문제**: NextAuth는 OAuth, JWT 등 표준 인증 방식을 주로 지원
- **현실**: 기존 Spring 서버는 폼 기반 인증 + CSRF 토큰 방식 사용
- **결과**: NextAuth의 Credentials Provider로도 복잡한 Spring Security와 완벽 호환 어려움

### **2. CSRF 토큰 처리의 복잡성**
- **문제**: Spring 서버는 매번 새로운 CSRF 토큰을 요구
- **NextAuth 한계**: 정적 설정으로는 동적 CSRF 토큰 교환 처리 어려움
- **결과**: 로그인 시도마다 401 Unauthorized 에러 발생

### **3. 세션 관리 방식 차이**
- **NextAuth**: JWT 토큰 기반 세션 관리
- **Spring 서버**: 서버 사이드 세션 (JSESSIONID) 기반
- **문제**: 두 시스템 간 세션 동기화 복잡성

### **4. 개발 및 디버깅 복잡성**
- **NextAuth**: 추상화된 레이어로 인한 디버깅 어려움
- **직접 구현**: 명확한 로직 흐름과 에러 처리 가능

### **5. 유지보수성**
- **NextAuth**: 라이브러리 의존성 및 버전 관리 필요
- **직접 구현**: 프로젝트에 특화된 맞춤형 솔루션

---

## 🎯 **결론**

프록시 서버 패턴을 사용한 직접 구현이 현재 상황에서 가장 적합한 선택이었습니다:

1. **기존 Spring 서버와의 완벽 호환성**
2. **명확한 에러 처리 및 디버깅**
3. **프로젝트 특화 맞춤형 솔루션**
4. **안정적인 인증 플로우**

이 방식으로 Spring 서버의 복잡한 인증 시스템을 안정적으로 처리할 수 있게 되었습니다.

---

## 🌐 **Spring 서버 기반 SSO 구축 전략**

현재 구조를 기반으로 Spring 서버를 메인으로 한 SSO(Single Sign-On) 시스템을 구축할 때의 전략을 정리합니다.

### **🏗️ 아키텍처 설계**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Spring Server  │    │  Other Apps     │
│   (Client)      │◄──►│   (SSO Hub)     │◄──►│   (Clients)     │
│                 │    │                 │    │                 │
│ - /auth         │    │ - /sso/login    │    │ - /sso/callback │
│ - /api/auth/*   │    │ - /sso/logout   │    │ - /api/*        │
└─────────────────┘    │ - /sso/validate │    └─────────────────┘
                       └─────────────────┘
```

### **📋 SSO 구현 단계**

#### **1단계: Spring 서버 SSO 엔드포인트 구축**

```java
// Spring Security SSO Configuration
@Configuration
@EnableWebSecurity
public class SSOConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/sso/**").permitAll()
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/sso/**")
            );
        return http.build();
    }
}

// SSO Controller
@RestController
@RequestMapping("/sso")
public class SSOController {
    
    @PostMapping("/login")
    public ResponseEntity<SSOResponse> login(@RequestBody LoginRequest request) {
        // 기존 로그인 로직 + SSO 토큰 생성
        String ssoToken = generateSSOToken(user);
        return ResponseEntity.ok(new SSOResponse(ssoToken, user));
    }
    
    @PostMapping("/validate")
    public ResponseEntity<ValidationResponse> validateToken(@RequestParam String token) {
        // SSO 토큰 검증
        return ResponseEntity.ok(validateSSOToken(token));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestParam String token) {
        // SSO 토큰 무효화
        invalidateSSOToken(token);
        return ResponseEntity.ok().build();
    }
}
```

#### **2단계: Next.js SSO 클라이언트 확장**

```typescript
// src/app/auth/sso.api.ts
export async function validateSSOToken(token: string) {
  const response = await fetch('/api/auth/sso/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  return response.json();
}

export async function logoutSSO(token: string) {
  const response = await fetch('/api/auth/sso/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  return response.json();
}
```

#### **3단계: SSO 토큰 관리 시스템**

```typescript
// src/lib/sso/token-manager.ts
export class SSOTokenManager {
  private static readonly SSO_TOKEN_KEY = 'htns_sso_token';
  
  static setToken(token: string): void {
    localStorage.setItem(this.SSO_TOKEN_KEY, token);
  }
  
  static getToken(): string | null {
    return localStorage.getItem(this.SSO_TOKEN_KEY);
  }
  
  static removeToken(): void {
    localStorage.removeItem(this.SSO_TOKEN_KEY);
  }
  
  static async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const result = await validateSSOToken(token);
      return result.valid;
    } catch {
      this.removeToken();
      return false;
    }
  }
}
```

### **🔐 SSO 보안 전략**

#### **1. 토큰 기반 인증**
```typescript
// JWT 또는 커스텀 토큰 사용
interface SSOToken {
  userId: string;
  username: string;
  permissions: string[];
  issuedAt: number;
  expiresAt: number;
  signature: string;
}
```

#### **2. 토큰 검증 및 갱신**
```typescript
// src/lib/sso/token-validator.ts
export class TokenValidator {
  static async validateAndRefresh(token: string): Promise<ValidationResult> {
    const result = await validateSSOToken(token);
    
    if (result.valid && result.needsRefresh) {
      const newToken = await refreshSSOToken(token);
      SSOTokenManager.setToken(newToken);
      return { valid: true, refreshed: true };
    }
    
    return { valid: result.valid, refreshed: false };
  }
}
```

#### **3. 자동 로그아웃 처리**
```typescript
// src/lib/sso/auto-logout.ts
export class AutoLogoutManager {
  static setupAutoLogout() {
    // 토큰 만료 시간 체크
    setInterval(async () => {
      const token = SSOTokenManager.getToken();
      if (token && !(await TokenValidator.validateAndRefresh(token)).valid) {
        this.performLogout();
      }
    }, 60000); // 1분마다 체크
  }
  
  private static performLogout() {
    SSOTokenManager.removeToken();
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }
}
```

### **🌍 다중 애플리케이션 지원**

#### **1. SSO 허브 역할**
```typescript
// Spring 서버가 SSO 허브 역할
interface SSOApplication {
  appId: string;
  appName: string;
  callbackUrl: string;
  permissions: string[];
}

// 애플리케이션별 권한 관리
interface SSOPermission {
  userId: string;
  appId: string;
  permissions: string[];
  grantedAt: Date;
}
```

#### **2. 애플리케이션 간 통신**
```typescript
// src/lib/sso/app-communication.ts
export class AppCommunication {
  static async notifyLogin(appId: string, userData: User): Promise<void> {
    // 다른 애플리케이션에 로그인 알림
    await fetch(`/api/sso/notify/${appId}`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
  
  static async notifyLogout(appId: string): Promise<void> {
    // 다른 애플리케이션에 로그아웃 알림
    await fetch(`/api/sso/notify/${appId}/logout`, {
      method: 'POST'
    });
  }
}
```

### **📊 모니터링 및 로깅**

#### **1. SSO 이벤트 추적**
```typescript
// src/lib/sso/event-tracker.ts
export class SSOEventTracker {
  static trackLogin(userId: string, appId: string): void {
    console.log(`SSO Login: User ${userId} logged into ${appId}`);
    // 분석 서비스로 이벤트 전송
  }
  
  static trackLogout(userId: string, appId: string): void {
    console.log(`SSO Logout: User ${userId} logged out from ${appId}`);
    // 분석 서비스로 이벤트 전송
  }
}
```

### **🚀 배포 전략**

#### **1. 단계적 마이그레이션**
1. **Phase 1**: 현재 시스템 유지하면서 SSO 인프라 구축
2. **Phase 2**: 새로운 애플리케이션에 SSO 적용
3. **Phase 3**: 기존 애플리케이션 점진적 마이그레이션

#### **2. 롤백 계획**
```typescript
// SSO 실패 시 기존 인증 방식으로 폴백
export class SSOFallback {
  static async authenticateWithFallback(): Promise<AuthResult> {
    try {
      return await SSOAuthentication.authenticate();
    } catch (error) {
      console.warn('SSO failed, falling back to legacy auth');
      return await LegacyAuthentication.authenticate();
    }
  }
}
```

### **📈 성능 최적화**

#### **1. 토큰 캐싱**
```typescript
// Redis 또는 메모리 캐시 사용
export class TokenCache {
  private static cache = new Map<string, CachedToken>();
  
  static set(key: string, token: CachedToken, ttl: number): void {
    this.cache.set(key, token);
    setTimeout(() => this.cache.delete(key), ttl);
  }
  
  static get(key: string): CachedToken | undefined {
    return this.cache.get(key);
  }
}
```

#### **2. 배치 처리**
```typescript
// 여러 애플리케이션에 동시 알림
export class BatchNotifier {
  static async notifyAll(apps: string[], event: SSOEvent): Promise<void> {
    const promises = apps.map(appId => 
      AppCommunication.notifyLogin(appId, event.userData)
    );
    await Promise.allSettled(promises);
  }
}
```

### **🎯 구현 우선순위**

1. **High Priority**: Spring 서버 SSO 엔드포인트
2. **Medium Priority**: Next.js SSO 클라이언트 확장
3. **Low Priority**: 다중 애플리케이션 지원
4. **Future**: 고급 모니터링 및 분석

이 전략을 통해 현재 구조를 기반으로 확장 가능하고 안전한 SSO 시스템을 구축할 수 있습니다.

---

## 📁 **현재 구조: `/auth` 디렉토리 통합**

### **🏗️ 구조**
```
src/app/auth/
├── page.tsx              # 로그인 UI 페이지
├── auth-client.ts        # 클라이언트 API 호출 함수
├── auth.types.ts         # 인증 관련 타입 정의
├── README.md             # 문서
└── api/                  # 서버 사이드 API Routes
    ├── login/route.ts    # 로그인 처리
    ├── logout/route.ts   # 로그아웃 처리
    ├── proxy/route.ts    # Spring 서버 프록시
    └── redirect/[...path]/route.ts  # 경로 리다이렉트
```

### **🎯 목적**
- **인증 관련 모든 기능을 한 곳에 통합**
- **클라이언트와 서버 코드의 논리적 그룹화**
- **개발 및 유지보수 효율성 향상**

### **✅ 장점**
1. **단순성**: 인증 관련 모든 것이 한 디렉토리에
2. **명확성**: 기능별 역할이 명확하게 구분됨
3. **관리 용이**: 관련 파일들을 쉽게 찾고 수정 가능
4. **확장성**: 새로운 인증 기능 추가 시 자연스러운 위치
5. **일관성**: Next.js의 기능별 디렉토리 구조 패턴

### **❌ 단점**
1. **디렉토리 깊이**: `api/` 하위 디렉토리로 인한 경로 복잡성
2. **Next.js 규칙**: API Routes가 `app/api/`에 있어야 한다는 규칙 위반
3. **라우팅 혼재**: 페이지(`page.tsx`)와 API Routes가 같은 디렉토리에
4. **명명 혼동**: `/auth/api/` 경로가 직관적이지 않을 수 있음
5. **표준 패턴**: Next.js 생태계의 일반적인 패턴과 다름 