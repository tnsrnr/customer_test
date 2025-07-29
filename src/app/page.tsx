'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LogOut, User, TrendingUp, Target, Activity, Award, Calendar
} from 'lucide-react';

// 전역 Chart.js 설정 import
import '@/lib/chart-config';

interface SessionData {
  jsessionId: string;
  csrfToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    empID?: string;
    hMenu?: string;
    roles?: string[];
  };
}

export default function HomePage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionData = localStorage.getItem('htns-session');
    if (sessionData) {
      try {
        const parsedSession = JSON.parse(sessionData);
        if (parsedSession.jsessionId && parsedSession.csrfToken) {
          setSession(parsedSession);
        } else {
          router.push('/auth');
        }
      } catch (e) {
        localStorage.removeItem('htns-session');
        router.push('/auth');
      }
    } else {
      router.push('/auth');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('htns-session');
    router.push('/auth');
  };

  const quickStats = [
    { title: '총 매출액', value: '2,619억원', change: '+12.5%', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { title: '영업이익', value: '26억원', change: '+8.3%', icon: Target, color: 'from-green-500 to-green-600' },
    { title: '물동량', value: '15,847톤', change: '+5.2%', icon: Activity, color: 'from-purple-500 to-purple-600' },
    { title: '달성율', value: '73%', change: '+2.1%', icon: Award, color: 'from-orange-500 to-orange-600' },
  ];

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800">
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
            fontWeight="900"
            fill="#3b82f6"
            opacity="0.5"
            style={{ letterSpacing: 32 }}
          >
            HTNS
          </text>
        </svg>
      </div>

      <div className="relative z-10 p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-12">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-6"
          >
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                안녕하세요, <span className="text-blue-300">{session.user.name || session.user.id}</span>님!
              </h1>
              <p className="text-blue-200 text-lg">HTNS 그룹 경영 현황 대시보드</p>
            </div>
          </motion.div>
          
          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 px-6 py-3 rounded-xl backdrop-blur-md border border-red-500/30 transition-all duration-200 hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            로그아웃
          </motion.button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-6xl mx-auto">
          {/* 퀵 스탯 */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/25 hover:bg-white/25 transition-all duration-300 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-green-300 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-blue-200 text-lg font-medium">{stat.title}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* 환영 메시지 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Calendar className="w-8 h-8 text-blue-300" />
              <h2 className="text-2xl font-bold text-white">2025년 5월 경영 현황</h2>
            </div>
            <p className="text-blue-200 text-lg leading-relaxed max-w-3xl mx-auto">
              상단 네비게이션을 통해 각종 경영 현황과 실적 데이터를 확인하실 수 있습니다. 
              전사실적, 운송현황, 재무현황 등 다양한 정보를 한눈에 파악하세요.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}