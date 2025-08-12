export interface SessionData {
  jsessionId: string;
  csrfToken: string;
  // optional fields used in some areas of the app
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

export function setSessionData(data: SessionData): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('htns-session', JSON.stringify(data));
}

export function clearSessionData(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('htns-session');
}

export function isAuthenticated(): boolean {
  const session = getSessionData();
  return Boolean(session?.jsessionId && session?.csrfToken);
}

// Compatibility layer for legacy API in src/app/auth/session.ts
const isBrowser = typeof window !== 'undefined';

export function getSession(): SessionData | null {
  return getSessionData();
}

export function setSession(session: SessionData): void {
  setSessionData(session);
}

export function clearSession(): void {
  clearSessionData();
}

export function isSessionValid(): boolean {
  return isAuthenticated();
}

// Accepts either a raw token string or a Set-Cookie header string
export function updateCsrfToken(value: string): void {
  if (!isBrowser) return;
  const session = getSessionData();
  if (!session) return;

  let token = value;
  // try to extract from Set-Cookie style header
  if (value.includes('X-CSRF-TOKEN=')) {
    const match = value.match(/X-CSRF-TOKEN=([^;]+)/);
    if (match && match[1]) {
      token = match[1];
    }
  }

  setSessionData({ ...session, csrfToken: token });
}
