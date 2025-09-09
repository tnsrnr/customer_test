// 세션 관리 로직
export interface SessionData {
  jsessionId: string;
  csrfToken: string;
  username?: string;
  loginTime?: number;
  user?: {
    id: string;
    name: string;
    email: string;
    empID?: string;
    hMenu?: string;
    roles?: Array<string>;
  };
}

// 세션 데이터 가져오기
export function getSessionData(): SessionData | null {
  if (typeof window === 'undefined') return null;
  
  const sessionData = window.localStorage.getItem('htns-session');
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData) as SessionData;
  } catch {
    window.localStorage.removeItem('htns-session');
    return null;
  }
}

// 세션 데이터 설정
export function setSessionData(data: SessionData): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('htns-session', JSON.stringify(data));
}

// 세션 데이터 삭제
export function clearSessionData(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('htns-session');
}

// 인증 상태 확인
export function isAuthenticated(): boolean {
  const session = getSessionData();
  return Boolean(session?.jsessionId && session?.csrfToken);
}

// CSRF 토큰 업데이트
export function updateCsrfToken(value: string): void {
  if (typeof window === 'undefined') return;
  
  const session = getSessionData();
  if (!session) return;

  let token = value;
  // Set-Cookie 스타일 헤더에서 추출
  if (value.includes('X-CSRF-TOKEN=')) {
    const match = value.match(/X-CSRF-TOKEN=([^;]+)/);
    if (match && match[1]) {
      token = match[1];
    }
  }

  setSessionData({ ...session, csrfToken: token });
}

// 세션 유효성 검사
export function isSessionValid(): boolean {
  return isAuthenticated();
}

// 호환성을 위한 별칭 함수들
export const getSession = getSessionData;
export const setSession = setSessionData;
export const clearSession = clearSessionData;
