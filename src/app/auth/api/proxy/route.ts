import { NextRequest } from 'next/server';

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
    if (cookie) {
      headers.set('cookie', cookie);
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

    // 요청 본문 처리
    let body: string | undefined;
    if (method !== 'GET') {
      body = await req.text();
    }

    // Spring 서버로 요청
    const response = await fetch(springUrl, {
      method,
      headers,
      body,
      redirect: 'manual'
    });

    // 응답 처리
    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
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

    // JSON 응답 반환
    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(response.headers.entries())
      }
    });

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