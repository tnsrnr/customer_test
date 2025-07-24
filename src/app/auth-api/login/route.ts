import { NextRequest } from 'next/server';
import qs from 'qs';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    console.log('🚀 Spring 서버 로그인 요청:', { username });

    // 1. CSRF 토큰 가져오기 (성공한 소스와 동일한 방식)
    console.log('📡 CSRF 토큰 요청 중...');
    const csrfRes = await fetch("https://lv1.htns.com/login.jsp", {
      method: "GET",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    console.log('📡 CSRF 응답 상태:', csrfRes.status);

    // set-cookie 헤더 추출 (다양한 방식 시도)
    let cookies: string[] = [];
    
    // 방식 1: headers.raw() 사용
    try {
      // @ts-ignore
      const setCookieHeaders = csrfRes.headers.raw ? csrfRes.headers.raw()['set-cookie'] || [] : [];
      cookies = setCookieHeaders.map(cookie => cookie.split(';')[0]);
      console.log('🍪 방식 1 - headers.raw() 쿠키:', cookies);
    } catch (e) {
      console.log('❌ 방식 1 실패:', e);
    }
    
    // 방식 2: headers.get() 사용
    if (cookies.length === 0) {
      try {
        const setCookieHeader = csrfRes.headers.get('set-cookie');
        if (setCookieHeader) {
          cookies = setCookieHeader.split(',').map(cookie => cookie.split(';')[0].trim());
          console.log('🍪 방식 2 - headers.get() 쿠키:', cookies);
        }
      } catch (e) {
        console.log('❌ 방식 2 실패:', e);
      }
    }
    
    // 쿠키가 비어있으면 빈 배열로 진행
    if (cookies.length === 0) {
      console.log('⚠️ 쿠키 추출 실패, 쿠키 없이 진행');
    }
    
    console.log('🍪 최종 쿠키:', cookies);
    
    const html = await csrfRes.text();
    console.log('📄 HTML 응답 길이:', html.length);
    
    const csrfMatch = html.match(/name="_csrf" value="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';

    console.log('🔑 CSRF 토큰:', csrfToken ? '발견됨' : '없음');

    if (!csrfToken) {
      console.log('❌ CSRF 토큰을 찾을 수 없음');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'CSRF 토큰을 가져올 수 없습니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Spring 서버에 로그인 요청 (성공한 소스와 동일한 방식)
    console.log('🔐 로그인 요청 중... (성공한 소스 방식)');
    
    // 성공한 소스와 동일한 파라미터 구성
    const loginData = {
      _spring_security_remember_me: true,
      _csrf: csrfToken,
      USER_ID: username,
      PW: password
    };

    console.log('📤 전송할 데이터:', qs.stringify(loginData));

    const loginRes = await fetch("https://lv1.htns.com/htns_sec", {
      method: "POST",
      redirect: 'manual', // 성공한 소스와 동일
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies.join('; '), // 성공한 소스와 동일한 쿠키 처리
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      body: qs.stringify(loginData) // 성공한 소스와 동일한 방식
    });

    console.log('📡 로그인 응답 상태:', loginRes.status);
    console.log('📡 로그인 응답 헤더:', Object.fromEntries(loginRes.headers.entries()));

    // 응답 처리
    const responseText = await loginRes.text();
    console.log('📄 로그인 응답 텍스트 길이:', responseText.length);
    console.log('📄 로그인 응답 텍스트 (처음 1000자):', responseText.substring(0, 1000));

    // 성공 판단 (성공한 소스의 응답 패턴 참고)
    if (loginRes.status === 302) {
      // 리다이렉트 - 로그인 성공
      console.log('✅ 리다이렉트로 성공!');
      const location = loginRes.headers.get('location');
      
      // @ts-ignore
      const loginSetCookieHeaders = loginRes.headers.raw ? loginRes.headers.raw()['set-cookie'] || [] : [];
      const jsessionId = loginSetCookieHeaders
        .find(cookie => cookie.startsWith('JSESSIONID='))
        ?.split(';')[0]?.split('=')[1] || '';

      return new Response(JSON.stringify({
        success: true,
        message: '로그인 성공 (리다이렉트)',
        user: {
          id: username,
          name: '사용자',
          jsessionId: jsessionId
        },
        redirectUrl: location
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': loginSetCookieHeaders
        }
      });
    } else if (responseText.includes('로그아웃') || responseText.includes('logout') || responseText.includes('main') || responseText.includes('dashboard')) {
      // HTML에서 성공 징후 발견
      console.log('✅ HTML에서 성공 징후 발견!');
      // @ts-ignore
      const loginSetCookieHeaders = loginRes.headers.raw ? loginRes.headers.raw()['set-cookie'] || [] : [];
      const jsessionId = loginSetCookieHeaders
        .find(cookie => cookie.startsWith('JSESSIONID='))
        ?.split(';')[0]?.split('=')[1] || '';

      return new Response(JSON.stringify({
        success: true,
        message: '로그인 성공 (HTML 확인)',
        user: {
          id: username,
          name: '사용자',
          jsessionId: jsessionId
        }
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': loginSetCookieHeaders
        }
      });
    } else if (responseText.includes('login.jsp') || responseText.includes('로그인')) {
      // 로그인 페이지가 다시 반환됨 - 실패
      console.log('❌ 로그인 페이지 반환 (실패)');
      
      // 에러 메시지 추출 시도
      const errorMatch = responseText.match(/<div[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+)</i) ||
                        responseText.match(/<span[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+)</i) ||
                        responseText.match(/alert\("([^"]+)"\)/i);
      
      const errorMessage = errorMatch ? errorMatch[1] : '로그인에 실패했습니다.';
      
      return new Response(JSON.stringify({
        success: false,
        message: errorMessage
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // 기타 응답 - 성공 가능성 있음
      console.log('⚠️ 기타 응답, 성공 가능성 있음');
      // @ts-ignore
      const loginSetCookieHeaders = loginRes.headers.raw ? loginRes.headers.raw()['set-cookie'] || [] : [];
      const jsessionId = loginSetCookieHeaders
        .find(cookie => cookie.startsWith('JSESSIONID='))
        ?.split(';')[0]?.split('=')[1] || '';

      if (jsessionId && jsessionId !== cookies.find(c => c.startsWith('JSESSIONID='))?.split('=')[1]) {
        // 새로운 세션이 생성됨 - 성공 가능성
        console.log('✅ 새로운 세션 생성, 성공으로 간주!');
        return new Response(JSON.stringify({
          success: true,
          message: '로그인 성공 (새 세션)',
          user: {
            id: username,
            name: '사용자',
            jsessionId: jsessionId
          }
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Set-Cookie': loginSetCookieHeaders
          }
        });
      } else {
        console.log('❌ 로그인 실패');
        return new Response(JSON.stringify({
          success: false,
          message: '로그인에 실패했습니다.'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

  } catch (error) {
    console.error('❌ Spring 서버 로그인 오류:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: '서버 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 