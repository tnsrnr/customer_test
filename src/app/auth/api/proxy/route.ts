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
    
    // Spring 서버용 세션 처리
    const cookie = req.headers.get('cookie');
    
    const clientJsessionId = req.headers.get('X-Session-JSESSIONID');
    const clientCsrfToken = req.headers.get('X-Session-CSRF-TOKEN');
    
    let jsessionId: string | null = null;
    let csrfToken: string | null = null;
    
    if (clientJsessionId && clientCsrfToken) {
      jsessionId = clientJsessionId;
      csrfToken = clientCsrfToken;
    } else {
      
      if (cookie) {
        // 쿠키 파싱 개선
        const cookies = cookie.split(';').map(c => c.trim());
        
        for (const cookieItem of cookies) {
          if (cookieItem.startsWith('JSESSIONID=')) {
            jsessionId = cookieItem.substring('JSESSIONID='.length);
          }
          if (cookieItem.startsWith('X-CSRF-TOKEN=')) {
            csrfToken = cookieItem.substring('X-CSRF-TOKEN='.length);
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
      
    } else {
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