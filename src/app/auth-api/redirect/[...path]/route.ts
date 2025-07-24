import { NextRequest, NextResponse } from 'next/server';
import { menuPathMapping } from '@/app/menu/menu-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = '/' + params.path.join('/');
  
  // 메뉴 경로 매핑에서 새 경로 찾기
  const newPath = menuPathMapping[path];
  
  if (newPath) {
    // 새 경로로 리다이렉트
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // 매핑되지 않은 경로는 404
  return NextResponse.json({ error: 'Page not found' }, { status: 404 });
} 