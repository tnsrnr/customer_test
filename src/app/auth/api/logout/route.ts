import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('🚪 Spring 서버 로그아웃 요청');

    // 클라이언트에서 전송된 쿠키 가져오기
    const cookie = req.headers.get('cookie');
    console.log('🍪 클라이언트 쿠키:', cookie);

    if (!cookie) {
      console.log('❌ 쿠키가 없음');
      return new Response(JSON.stringify({
        success: false,
        message: '세션이 없습니다.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Spring 서버 로그아웃 요청
    console.log('🔐 로그아웃 요청 중...');
    
    const logoutRes = await fetch("https://qa-lv1.htns.com/logout", {
      method: "POST",
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://qa-lv1.htns.com/'
      }
    });

    console.log('📡 로그아웃 응답 상태:', logoutRes.status);
    console.log('📡 로그아웃 응답 헤더:', Object.fromEntries(logoutRes.headers.entries()));

    // 응답 처리
    const responseText = await logoutRes.text();
    console.log('📄 로그아웃 응답 텍스트 길이:', responseText.length);

    // 성공 판단
    if (logoutRes.status === 302) {
      // 리다이렉트 - 로그아웃 성공
      console.log('✅ 리다이렉트로 로그아웃 성공!');
      const location = logoutRes.headers.get('location');
      
      // 세션 쿠키 무효화
      const clearCookies = [
        'JSESSIONID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
        'WMONID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'X-CSRF-TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      ];

      return new Response(JSON.stringify({
        success: true,
        message: '로그아웃 성공',
        redirectUrl: location
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': clearCookies.join(', ')
        }
      });
    } else if (responseText.includes('로그인') || responseText.includes('login')) {
      // 로그인 페이지로 리다이렉트됨 - 로그아웃 성공
      console.log('✅ 로그인 페이지로 리다이렉트 - 로그아웃 성공!');
      
      // 세션 쿠키 무효화
      const clearCookies = [
        'JSESSIONID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
        'WMONID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'X-CSRF-TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      ];

      return new Response(JSON.stringify({
        success: true,
        message: '로그아웃 성공'
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': clearCookies.join(', ')
        }
      });
    } else {
      // 기타 응답 - 성공으로 간주
      console.log('⚠️ 기타 응답, 로그아웃 성공으로 간주');
      
      // 세션 쿠키 무효화
      const clearCookies = [
        'JSESSIONID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
        'WMONID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'X-CSRF-TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      ];

      return new Response(JSON.stringify({
        success: true,
        message: '로그아웃 성공'
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': clearCookies.join(', ')
        }
      });
    }

  } catch (error) {
    console.error('❌ Spring 서버 로그아웃 오류:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: '서버 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 