import { NextRequest, NextResponse } from 'next/server';
import { updateCsrfToken } from '@/app/auth/session';

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

    let targetUrl: string;
    let headers = new Headers();

    // 환경변수에서 Spring 서버 URL 가져오기
    const springServerUrl = process.env.SPRING_SERVER_URL || 'https://qa-lv1.htns.com';
    targetUrl = `${springServerUrl}${targetPath}`;
    console.log(`🚀 Spring 서버 프록시 요청: ${method} ${targetUrl}`);
    
    // Spring 서버용 세션 처리
    const cookie = req.headers.get('cookie');
    console.log('🍪 원본 쿠키:', cookie);
    console.log('🔍 요청 URL:', targetUrl);
    
    const clientJsessionId = req.headers.get('X-Session-JSESSIONID');
    const clientCsrfToken = req.headers.get('X-Session-CSRF-TOKEN');
    
    console.log('🔑 클라이언트 세션 헤더:', { 
      jsessionId: clientJsessionId, 
      csrfToken: clientCsrfToken 
    });
    
    let jsessionId: string | null = null;
    let csrfToken: string | null = null;
    
    if (clientJsessionId && clientCsrfToken) {
      jsessionId = clientJsessionId;
      csrfToken = clientCsrfToken;
      console.log('🔑 클라이언트 세션 사용:', { jsessionId, csrfToken });
    } else {
      console.log('⚠️ 클라이언트 세션 없음, 브라우저 쿠키 사용');
      
      if (cookie) {
        // 쿠키 파싱 개선
        const cookies = cookie.split(';').map(c => c.trim());
        
        for (const cookieItem of cookies) {
          if (cookieItem.startsWith('JSESSIONID=')) {
            jsessionId = cookieItem.substring('JSESSIONID='.length);
            console.log('🔑 JSESSIONID 추출:', jsessionId);
          }
          if (cookieItem.startsWith('X-CSRF-TOKEN=')) {
            csrfToken = cookieItem.substring('X-CSRF-TOKEN='.length);
            console.log('🔑 CSRF 토큰 추출:', csrfToken);
          }
        }
      }
    }
    
    if (jsessionId) {
      let finalCookie = `JSESSIONID=${jsessionId}`;
      if (csrfToken && csrfToken !== 'null') {
        finalCookie += `; X-CSRF-TOKEN=${csrfToken}`;
      }
      headers.set('cookie', finalCookie);
      
      // getInit API와 동일한 헤더 추가
      headers.set('X-CSRF-TOKEN', csrfToken || '');
      headers.set('ajax', 'true');
      headers.set('X-Requested-With', 'XMLHttpRequest');
      
      console.log('🍪 최종 쿠키 설정:', finalCookie);
      console.log('🔑 추가 헤더:', {
        'X-CSRF-TOKEN': csrfToken,
        'ajax': 'true',
        'X-Requested-With': 'XMLHttpRequest'
      });
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
      headers.set('Content-Type', contentType);
    }

    // 요청 본문 처리
    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const requestBody = await req.json();
        body = JSON.stringify(requestBody);
      } catch (e) {
        // JSON이 아닌 경우 텍스트로 처리
        body = await req.text();
      }
    }

    // 실제 서버로 요청 전송
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    // 응답 처리
    const responseData = await response.text();
    let jsonResponse;
    
    try {
      jsonResponse = JSON.parse(responseData);
    } catch (e) {
      jsonResponse = { data: responseData };
    }

    // Spring 서버 응답 시 CSRF 토큰 업데이트
    if (response.headers.get('set-cookie')) {
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        console.log('🔄 CSRF 토큰 업데이트:', setCookieHeader);
        await updateCsrfToken(setCookieHeader);
      }
    }

    console.log(`✅ 프록시 응답 성공: ${response.status}`);
    return new Response(JSON.stringify(jsonResponse), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ 프록시 요청 실패:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '프록시 요청에 실패했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 