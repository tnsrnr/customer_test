import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    console.log('🚀 Spring 서버 로그인 요청:', { username });
    
    // 1단계: CSRF 토큰과 JSESSIONID 가져오기
    console.log('📡 CSRF 토큰 요청 중...');
    const csrfResponse = await fetch(`${process.env.SPRING_SERVER_URL}/login.jsp`, {
      method: 'GET',
      redirect: 'manual'
    });
    
    console.log('📡 CSRF 응답 상태:', csrfResponse.status);
    
    // 쿠키 추출
    const cookies = csrfResponse.headers.get('set-cookie') || '';
    console.log('🍪 headers.raw() 쿠키:', []);
    console.log('🍪 headers.get() 쿠키:', cookies.split(',').map(c => c.trim()));
    
    const cookieArray = cookies.split(',').map(c => c.trim()).filter(c => c);
    console.log('🍪 최종 쿠키:', cookieArray);
    
    // HTML에서 CSRF 토큰 추출
    const html = await csrfResponse.text();
    console.log('📄 HTML 응답 길이:', html.length);
    
    const csrfMatch = html.match(/name="_csrf" value="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';
    console.log('🔑 CSRF 토큰 발견:', csrfToken);
    
    if (!csrfToken) {
      return NextResponse.json({ 
        success: false, 
        message: 'CSRF 토큰을 찾을 수 없습니다.' 
      });
    }
    
    // 2단계: 로그인 요청
    console.log('🔐 로그인 요청 중...');
    const loginData = new URLSearchParams({
      '_spring_security_remember_me': 'true',
      '_csrf': csrfToken,
      'USER_ID': username,
      'PW': password
    });
    
    console.log('📤 전송할 데이터:', loginData.toString());
    
    const loginResponse = await fetch(`${process.env.SPRING_SERVER_URL}/htns_sec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookieArray.join('; ')
      },
      body: loginData.toString(),
      redirect: 'manual'
    });
    
    console.log('📡 로그인 응답 상태:', loginResponse.status);
    console.log('📡 로그인 응답 헤더:', Object.fromEntries(loginResponse.headers.entries()));
    
    const loginText = await loginResponse.text();
    console.log('📄 로그인 응답 텍스트 길이:', loginText.length);
    console.log('📄 로그인 응답 텍스트 (처음 1000자):', loginText.substring(0, 1000));
    
    // 302 리다이렉트가 있으면 로그인 성공
    if (loginResponse.status === 302) {
      console.log('✅ 리다이렉트로 성공!');
      
      // 새로운 JSESSIONID 추출
      const newCookies = loginResponse.headers.get('set-cookie') || '';
      console.log('🍪 새로운 쿠키 헤더:', newCookies);
      
      // JSESSIONID 찾기 (정확한 파싱)
      const jsessionMatch = newCookies.match(/JSESSIONID=([^;]+)/);
      const jsessionId = jsessionMatch ? jsessionMatch[1] : '';
      console.log('🍪 새로운 JSESSIONID:', jsessionId);
      
      // 3단계: 새로운 CSRF 토큰 요청 (새로운 JSESSIONID로)
      console.log('🔄 새로운 CSRF 토큰 요청 중...');
      const newCsrfResponse = await fetch(`${process.env.SPRING_SERVER_URL}/login.jsp`, {
        method: 'GET',
        headers: {
          'Cookie': `JSESSIONID=${jsessionId}`
        },
        redirect: 'manual'
      });
      
      console.log('📡 새로운 CSRF 응답 상태:', newCsrfResponse.status);
      console.log('📡 새로운 CSRF 응답 헤더:', Object.fromEntries(newCsrfResponse.headers.entries()));
      
      const newHtml = await newCsrfResponse.text();
      console.log('📄 새로운 CSRF HTML 길이:', newHtml.length);
      console.log('📄 새로운 CSRF HTML (처음 500자):', newHtml.substring(0, 500));
      
      // 헤더에서 CSRF 토큰 추출 시도
      const setCookieHeader = newCsrfResponse.headers.get('set-cookie');
      let newCsrfToken = '';
      
      if (setCookieHeader) {
        const csrfMatch = setCookieHeader.match(/X-CSRF-TOKEN=([^;]+)/);
        if (csrfMatch) {
          newCsrfToken = csrfMatch[1];
          console.log('🔑 헤더에서 새로운 CSRF 토큰 발견:', newCsrfToken);
        }
      }
      
      // 헤더에서 찾지 못하면 HTML에서 추출 시도
      if (!newCsrfToken) {
        const newCsrfMatch = newHtml.match(/name="_csrf" value="([^"]+)"/);
        newCsrfToken = newCsrfMatch ? newCsrfMatch[1] : '';
        console.log('🔑 HTML에서 새로운 CSRF 토큰:', newCsrfToken);
      }
      
      if (!newCsrfToken) {
        console.log('⚠️ 새로운 CSRF 토큰을 찾을 수 없음, 기존 토큰 사용');
        newCsrfToken = csrfToken;
      }
      
      // 4단계: 사용자 세션 정보 가져오기 (여러 API 시도)
      console.log('👤 사용자 세션 정보 요청 중...');
      
      // 첫 번째 시도: /getInit
      console.log('🔗 API URL (시도 1):', `${process.env.SPRING_SERVER_URL}/api/G1E000000SVC/getInit`);
      console.log('🍪 전송할 쿠키:', `JSESSIONID=${jsessionId}`);
      console.log('🔑 전송할 CSRF:', newCsrfToken);
      
      let         sessionResponse = await fetch(`${process.env.SPRING_SERVER_URL}/api/G1E000000SVC/getInit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `JSESSIONID=${jsessionId}; X-CSRF-TOKEN=${newCsrfToken}`,
            'X-CSRF-TOKEN': newCsrfToken,
            'ajax': 'true',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({})
        });
      
      console.log('📡 세션 응답 상태 (시도 1):', sessionResponse.status);
      
      // 첫 번째 시도가 실패하면 두 번째 시도
      if (!sessionResponse.ok || sessionResponse.headers.get('content-type')?.includes('text/html')) {
        console.log('🔄 첫 번째 API 실패, 두 번째 시도...');
        console.log('🔗 API URL (시도 2):', `${process.env.SPRING_SERVER_URL}/api/G1E000000SVC/getInitNewPortal`);
        
        sessionResponse = await fetch(`${process.env.SPRING_SERVER_URL}/api/G1E000000SVC/getInitNewPortal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `JSESSIONID=${jsessionId}; X-CSRF-TOKEN=${newCsrfToken}`,
            'X-CSRF-TOKEN': newCsrfToken,
            'ajax': 'true',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({})
        });
        
        console.log('📡 세션 응답 상태 (시도 2):', sessionResponse.status);
      }
      
      // 두 번째 시도도 실패하면 세 번째 시도
      if (!sessionResponse.ok || sessionResponse.headers.get('content-type')?.includes('text/html')) {
        console.log('🔄 두 번째 API 실패, 세 번째 시도...');
        console.log('🔗 API URL (시도 3):', `${process.env.SPRING_SERVER_URL}/api/user/session`);
        
        sessionResponse = await fetch(`${process.env.SPRING_SERVER_URL}/api/user/session`, {
          method: 'GET',
          headers: {
            'Cookie': `JSESSIONID=${jsessionId}; X-CSRF-TOKEN=${newCsrfToken}`,
            'X-CSRF-TOKEN': newCsrfToken,
            'ajax': 'true',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        console.log('📡 세션 응답 상태 (시도 3):', sessionResponse.status);
      }
      
      console.log('📡 세션 응답 상태:', sessionResponse.status);
      console.log('📡 세션 응답 헤더:', Object.fromEntries(sessionResponse.headers.entries()));
      
      let sessionInfo: any = {};
      if (sessionResponse.ok) {
        try {
          const sessionText = await sessionResponse.text();
          console.log('📄 세션 응답 텍스트:', sessionText);
          
          if (sessionText && !sessionText.includes('<script>')) {
            sessionInfo = JSON.parse(sessionText);
            console.log('📄 파싱된 세션 정보:', sessionInfo);
          } else {
            console.log('⚠️ HTML 응답 (리다이렉트), 기본 사용자 정보 사용');
          }
        } catch (e) {
          console.log('❌ 세션 정보 파싱 실패:', e);
        }
      } else {
        console.log('❌ 세션 API 호출 실패:', sessionResponse.status);
        try {
          const errorText = await sessionResponse.text();
          console.log('📄 에러 응답:', errorText);
        } catch (e) {
          console.log('📄 에러 응답 읽기 실패:', e);
        }
      }
      
      // 사용자 정보 구성
      const user = {
        id: username,
        name: sessionInfo.USER_NAME_LOC || sessionInfo.USER_NAME || username,
        email: sessionInfo.EMAIL || `${username}@htns.com`,
        jsessionId: jsessionId,
        csrfToken: newCsrfToken,
        empID: sessionInfo.EMP_ID || sessionInfo.USER_ID || '',
        hMenu: sessionInfo.H_MENU || sessionInfo.MENU || '',
        roles: sessionInfo.EL_GRADE || sessionInfo.roles || []
      };
      
      console.log('✅ 최종 사용자 정보:', user);
      
      return NextResponse.json({
        success: true,
        user: user
      });
    } else {
      console.log('❌ 로그인 실패 - 상태 코드:', loginResponse.status);
      return NextResponse.json({ 
        success: false, 
        message: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.' 
      });
    }
    
  } catch (error: any) {
    console.error('❌ 로그인 API 에러:', error);
    return NextResponse.json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
} 