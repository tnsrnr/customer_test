import { NextRequest, NextResponse } from 'next/server';
import { clearSession } from '@/app/auth/session';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 로그아웃 요청 처리');
    
    // 세션 삭제
    clearSession();
    
    return NextResponse.json({
      success: true,
      message: '로그아웃 성공'
    });
  } catch (error) {
    console.error('❌ 로그아웃 오류:', error);
    return NextResponse.json(
      { success: false, message: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 