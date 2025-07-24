// 인증 관련 API 호출 함수들

// 로그인 API 호출 함수
export const loginAPI = async (username: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('로그인 API 호출 오류:', error);
    throw error;
  }
};

// 로그아웃 API 호출 함수
export const logoutAPI = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '로그아웃에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('로그아웃 API 호출 오류:', error);
    throw error;
  }
}; 