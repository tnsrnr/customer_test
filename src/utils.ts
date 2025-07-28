// 공통 유틸리티 함수들

/**
 * CSS 클래스명을 결합하는 함수
 */
export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * 세션 정보를 가져오는 함수
 */
export function getSessionData() {
  if (typeof window === 'undefined') return null;
  
  const sessionData = localStorage.getItem('htns-session');
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData);
  } catch (e) {
    localStorage.removeItem('htns-session');
    return null;
  }
}

/**
 * 세션 정보를 저장하는 함수
 */
export function setSessionData(data: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('htns-session', JSON.stringify(data));
}

/**
 * 세션 정보를 삭제하는 함수
 */
export function clearSessionData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('htns-session');
}

/**
 * 인증 상태를 확인하는 함수
 */
export function isAuthenticated(): boolean {
  const session = getSessionData();
  return !!(session?.jsessionId && session?.csrfToken);
} 