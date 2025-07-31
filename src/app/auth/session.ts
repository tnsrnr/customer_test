// 세션 관리 유틸리티

export interface SessionData {
  jsessionId: string;
  csrfToken: string;
  username?: string;
  loginTime?: number;
}

// 브라우저 환경 체크
const isBrowser = typeof window !== 'undefined';

// 세션 가져오기
export const getSession = (): SessionData | null => {
  if (!isBrowser) return null;
  
  try {
    const sessionData = localStorage.getItem('htns-session');
    if (!sessionData) {
      return null;
    }
    return JSON.parse(sessionData);
  } catch (error) {
    console.error('❌ 세션 파싱 오류:', error);
    return null;
  }
};

// 세션 설정
export const setSession = (session: SessionData): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem('htns-session', JSON.stringify(session));
    console.log('✅ 세션 저장 완료');
  } catch (error) {
    console.error('❌ 세션 저장 오류:', error);
  }
};

// CSRF 토큰 업데이트
export const updateCsrfToken = (newCsrfToken: string): void => {
  if (!isBrowser) return;
  
  try {
    const session = getSession();
    if (session) {
      const updatedSession = {
        ...session,
        csrfToken: newCsrfToken
      };
      setSession(updatedSession);
      console.log('🔄 CSRF 토큰 업데이트 완료:', newCsrfToken);
    }
  } catch (error) {
    console.error('❌ CSRF 토큰 업데이트 오류:', error);
  }
};

// 세션 삭제
export const clearSession = (): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.removeItem('htns-session');
    console.log('🗑️ 세션 삭제 완료');
  } catch (error) {
    console.error('❌ 세션 삭제 오류:', error);
  }
};

// 세션 유효성 검사
export const isSessionValid = (): boolean => {
  if (!isBrowser) return false;
  
  const session = getSession();
  return !!(session?.jsessionId && session?.csrfToken);
}; 