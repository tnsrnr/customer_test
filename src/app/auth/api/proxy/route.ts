import { NextRequest, NextResponse } from 'next/server';
import { updateCsrfToken } from '../../session';

export async function GET(req: NextRequest) {
  return handleProxyRequest(req, 'GET');
}

export async function POST(req: NextRequest) {
  return handleProxyRequest(req, 'POST');
}

export async function PUT(req: NextRequest) {
  return handleProxyRequest(req, 'PUT');
}

export async function DELETE(req: NextRequest) {
  return handleProxyRequest(req, 'DELETE');
}

async function handleProxyRequest(req: NextRequest, method: string) {
  try {
    const url = new URL(req.url);
    const targetPath = url.searchParams.get('path');
    
    if (!targetPath) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'target path is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Spring 서버 URL 구성
    const springUrl = `https://qa-lv1.htns.com${targetPath}`;
    
    console.log(`🚀 Spring 서버 프록시 요청: ${method} ${springUrl}`);

    // 요청 헤더 구성
    const headers = new Headers();
    
    // 원본 요청의 쿠키를 그대로 전달
    const cookie = req.headers.get('cookie');
    console.log('🍪 원본 쿠키:', cookie);
    console.log('🔍 요청 URL:', springUrl);
    
    // 클라이언트에서 전송한 세션 정보 확인 (우선)
    const clientJsessionId = req.headers.get('X-Session-JSESSIONID');
    const clientCsrfToken = req.headers.get('X-Session-CSRF-TOKEN');
    
    console.log('🔑 클라이언트 세션 헤더:', { 
      jsessionId: clientJsessionId, 
      csrfToken: clientCsrfToken 
    });
    
    // 클라이언트 세션 정보 사용 (우선)
    let jsessionId: string | null = null;
    let csrfToken: string | null = null;
    
    if (clientJsessionId && clientCsrfToken) {
      jsessionId = clientJsessionId;
      csrfToken = clientCsrfToken;
      console.log('🔑 클라이언트 세션 사용:', { jsessionId, csrfToken });
    } else {
      console.log('⚠️ 클라이언트 세션 없음, 브라우저 쿠키 사용');
      
      // 브라우저 쿠키에서 추출 (fallback)
      if (cookie) {
        const jsessionMatch = cookie.match(/JSESSIONID=([^;]+)/);
        if (jsessionMatch) jsessionId = jsessionMatch[1];
        
        // X-CSRF-TOKEN만 추출 (X_CSRF_TOKEN 제외)
        const csrfMatch = cookie.match(/X-CSRF-TOKEN=([^;]+)/);
        if (csrfMatch) csrfToken = csrfMatch[1];
      }
    }
    
    // 세션 정보로 쿠키 구성 (중복 제거)
    if (jsessionId) {
      let finalCookie = `JSESSIONID=${jsessionId}`;
      if (csrfToken && csrfToken !== 'null') {
        finalCookie += `; X-CSRF-TOKEN=${csrfToken}`;
      }
      headers.set('cookie', finalCookie);
      console.log('🍪 최종 쿠키 설정:', finalCookie);
    } else {
      console.log('⚠️ 세션 정보를 찾을 수 없음');
      return new Response(JSON.stringify({
        success: false,
        message: '세션이 없습니다. 다시 로그인해주세요.',
        status: 401
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Content-Type 헤더 전달
    const contentType = req.headers.get('content-type');
    if (contentType) {
      headers.set('content-type', contentType);
    }
    
    // User-Agent 설정
    headers.set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    // AJAX 헤더 추가 (Spring 서버가 요구하는 경우)
    headers.set('ajax', 'true');
    headers.set('X-Requested-With', 'XMLHttpRequest');

    // CSRF 토큰 추가 (쿠키에서 추출)
    // 헤더에서도 CSRF 토큰 확인
    const headerCsrfToken = req.headers.get('X-CSRF-TOKEN');
    console.log('🔍 헤더에서 CSRF 토큰:', headerCsrfToken);
    
    if (headerCsrfToken && headerCsrfToken !== 'null') {
      csrfToken = headerCsrfToken;
      console.log('🔑 헤더에서 CSRF 토큰 발견:', csrfToken);
    }
    
    // CSRF 토큰 헤더 설정 (always set X-CSRF-TOKEN header if available)
    if (csrfToken && csrfToken !== 'null') {
      headers.set('X-CSRF-TOKEN', csrfToken);
      console.log('🔑 최종 CSRF 토큰 설정:', csrfToken);
    } else {
      console.log('⚠️ CSRF 토큰을 찾을 수 없음');
    }
    


    // 요청 본문 처리
    let body: string | undefined;
    if (method !== 'GET') {
      body = await req.text();
      console.log('🔍 요청 본문:', body);
    }

    // Spring 서버로 요청
    const response = await fetch(springUrl, {
      method,
      headers,
      body,
      redirect: 'manual'
    });

    console.log('🔍 Spring 서버 응답 상태:', response.status, response.statusText);
    console.log('🔍 Spring 서버 응답 헤더:', Object.fromEntries(response.headers.entries()));

    // 302 리다이렉트 처리 (세션 만료)
    if (response.status === 302) {
      const location = response.headers.get('location');
      console.log('⚠️ 세션 만료로 리다이렉트:', location);
      
      return new Response(JSON.stringify({
        success: false,
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        status: 401,
        redirect: true,
        location: location
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 응답 처리
    const responseText = await response.text();
    console.log('🔍 Spring 서버 응답:', responseText);
    console.log('🔍 응답 길이:', responseText.length);
    console.log('🔍 응답 타입:', typeof responseText);
    
    let responseData;

    try {
      responseData = JSON.parse(responseText);
      console.log('✅ JSON 파싱 성공:', responseData);
      console.log('🔍 응답 데이터 키:', Object.keys(responseData));
      
      // 응답에서 새로운 CSRF 토큰이 있는지 확인
      if (responseData.signaldata && responseData.signaldata['X-CSRF-TOKEN']) {
        const newCsrfToken = responseData.signaldata['X-CSRF-TOKEN'];
        console.log('🔄 응답에서 새로운 CSRF 토큰 발견:', newCsrfToken);
        
        // 새로운 CSRF 토큰을 응답 헤더에 포함
        responseData.newCsrfToken = newCsrfToken;
        
        // 세션 업데이트 (중앙 관리)
        try {
          updateCsrfToken(newCsrfToken);
        } catch (error) {
          console.error('❌ 세션 업데이트 실패:', error);
        }
        
        // 브라우저 쿠키 업데이트를 위한 Set-Cookie 헤더 추가 (중복 제거)
        const setCookieHeaders = [
          // 기존 중복 쿠키 삭제
          `X_CSRF_TOKEN=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          `x-csrf-token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          // 새로운 토큰 설정
          `X-CSRF-TOKEN=${newCsrfToken}; Path=/; HttpOnly; SameSite=Strict`
        ];
        
        console.log('🍪 브라우저 쿠키 업데이트:', setCookieHeaders);
        
        // CSRF 토큰 오류인 경우 새로운 토큰으로 재시도
        if (responseData.STATUS === 403 && responseData.MSG?.includes('Invalid CSRF Token')) {
          console.log('🔄 CSRF 토큰 오류로 재시도합니다...');
          
          // 새로운 CSRF 토큰으로 요청 재구성
          const retryHeaders = new Headers(headers);
          retryHeaders.set('X-CSRF-TOKEN', newCsrfToken);
          
          // 쿠키 업데이트
          const currentCookie = retryHeaders.get('cookie');
          if (currentCookie) {
            const updatedCookie = currentCookie.replace(/X-CSRF-TOKEN=[^;]+/, `X-CSRF-TOKEN=${newCsrfToken}`);
            retryHeaders.set('cookie', updatedCookie);
            console.log('🍪 재시도 쿠키:', updatedCookie);
          }
          
          // 재시도 요청
          const retryResponse = await fetch(springUrl, {
            method,
            headers: retryHeaders,
            body,
            redirect: 'manual'
          });
          
          console.log('🔄 재시도 응답 상태:', retryResponse.status);
          
          if (retryResponse.ok) {
            const retryResult = await retryResponse.text();
            console.log('✅ 재시도 성공:', retryResult);
            
            try {
              const retryData = JSON.parse(retryResult);
              return new Response(JSON.stringify(retryData), {
                status: retryResponse.status,
                headers: {
                  'Content-Type': 'application/json',
                  'Set-Cookie': setCookieHeaders.join(', '),
                  ...Object.fromEntries(retryResponse.headers.entries())
                }
              });
            } catch (e) {
              return new Response(retryResult, {
                status: retryResponse.status,
                headers: {
                  'Content-Type': 'text/plain',
                  'Set-Cookie': setCookieHeaders.join(', '),
                  ...Object.fromEntries(retryResponse.headers.entries())
                }
              });
            }
          }
        }
        
        // CSRF 토큰이 있는 경우 Set-Cookie 헤더와 함께 반환
        const cleanHeaders = new Headers();
        cleanHeaders.set('Content-Type', 'application/json');
        cleanHeaders.set('Access-Control-Allow-Origin', '*');
        cleanHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        cleanHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        cleanHeaders.set('Set-Cookie', setCookieHeaders.join(', '));
        
        return new Response(JSON.stringify(responseData), {
          status: response.status,
          headers: cleanHeaders
        });
      }
      
      // 일반적인 데이터 응답 (CSRF 토큰이 없는 경우)
      console.log('✅ 일반 데이터 응답 반환:', responseData);
      console.log('🔍 응답 헤더:', {
        'Content-Type': 'application/json',
        ...Object.fromEntries(response.headers.entries())
      });
      
      // 브라우저에서 보기 좋게 헤더 정리
      const cleanHeaders = new Headers();
      cleanHeaders.set('Content-Type', 'application/json');
      
      // CORS 헤더 추가
      cleanHeaders.set('Access-Control-Allow-Origin', '*');
      cleanHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      cleanHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      
      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: cleanHeaders
      });
      
    } catch (e) {
      // JSON이 아닌 경우 텍스트로 반환
      return new Response(responseText, {
        status: response.status,
        headers: {
          'Content-Type': 'text/plain',
          ...Object.fromEntries(response.headers.entries())
        }
      });
    }

  } catch (error) {
    console.error('Spring 서버 프록시 오류:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: '서버 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 