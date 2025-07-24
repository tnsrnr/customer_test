'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Lock, User, CheckCircle } from 'lucide-react';
import { loginAPI } from '@/lib/api/client';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // 이미 로그인된 사용자 체크
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthStatus('');
    setIsLoading(true);

    try {
      const result = await loginAPI(username, password);
      
      if (result.success) {
        setAuthStatus('✅ 로그인 성공!');
        
        // 로그인 성공 시 사용자 정보 저장
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        
        // 메인 페이지로 이동
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setError(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAuth = () => {
    setAuthStatus('🔍 통합된 auth 디렉토리 방식 사용 중');
  };

  const handleClearSession = () => {
    setAuthStatus('🧹 세션 초기화 완료');
    setUsername('');
    setPassword('');
    localStorage.removeItem('user');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="absolute top-0 left-0 w-[28rem] h-[28rem] opacity-25 animate-spin-slow" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#2563eb" strokeWidth="40" strokeDasharray="40 40" />
          <text
            x="200"
            y="235"
            textAnchor="middle"
            fontSize="72"
            fontWeight="bold"
            fill="white"
            opacity="0.25"
            style={{ letterSpacing: 18 }}
          >
            HTNS
          </text>
        </svg>
        <svg className="absolute bottom-0 right-0 w-[32rem] h-[32rem] opacity-50 animate-pulse-slow" viewBox="0 0 512 512" fill="none">
          <text
            x="256"
            y="320"
            textAnchor="middle"
            fontSize="110"
            fontWeight="bold"
            fill="#3b82f6"
            opacity="0.5"
            style={{ letterSpacing: 32 }}
          >
            HTNS
          </text>
        </svg>
      </div>
      <Card className="relative z-10 w-full max-w-sm p-8 shadow-2xl rounded-2xl bg-white/80 border-0">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 rounded-full p-4 shadow-lg mb-4 animate-bounce">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">HTNS Dashboard</h1>
          <p className="text-slate-500 text-base">통합된 auth 디렉토리 로그인</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-1">
              아이디
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                autoFocus
                placeholder="아이디를 입력하세요"
                autoComplete="username"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
              />
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md animate-shake">
              {error}
            </div>
          )}
          {authStatus && (
            <div className={`text-sm p-3 rounded-md ${
              authStatus.includes('✅') 
                ? 'text-green-600 bg-green-50' 
                : authStatus.includes('⚠️') 
                ? 'text-yellow-600 bg-yellow-50'
                : authStatus.includes('🧹')
                ? 'text-blue-600 bg-blue-50'
                : 'text-red-600 bg-red-50'
            }`}>
              {authStatus}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white py-2.5 px-4 rounded-lg font-bold shadow-md hover:from-blue-700 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
          <button
            type="button"
            onClick={handleCheckAuth}
            className="w-full mt-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            인증 방식 확인
          </button>
          <button
            type="button"
            onClick={handleClearSession}
            className="w-full mt-2 bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200"
          >
            🧹 세션 초기화
          </button>
        </form>
        <div className="mt-8 text-center text-xs text-slate-500 select-none">
          <p>테스트 계정: <span className="font-semibold text-blue-600">admin@htns.com</span></p>
          <p>비밀번호: <span className="font-semibold text-blue-600">password123</span></p>
        </div>
      </Card>
    </div>
  );
} 