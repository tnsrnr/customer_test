// 인증 관련 API 호출 함수들

// 로그인 API 호출 함수
export const loginAPI = async (username: string, password: string) => {
  try {
    const response = await fetch('/auth/api/login', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    // 서버에서 성공 응답을 보냈으면 성공으로 처리
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error('로그인 API 호출 오류:', error);
    throw error;
  }
};

// 로그아웃 API 호출 함수
export const logoutAPI = async () => {
  try {
    const response = await fetch('/auth/api/logout', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // 서버에서 성공 응답을 보냈으면 성공으로 처리
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || '로그아웃에 실패했습니다.');
    }
  } catch (error) {
    console.error('로그아웃 API 호출 오류:', error);
    throw error;
  }
}; 