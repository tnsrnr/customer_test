'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Clock, Building2, Globe, BarChart3, Package, Truck, Ship, Plane, DollarSign, TrendingUp, PieChart, LineChart
} from 'lucide-react';

// 전역 Chart.js 설정 import
import '@/global/lib/chart';

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState(0);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const router = useRouter();

  // 고정 통계 데이터 (글로벌 맵 기본값)
  const fixedStats = useMemo(() => ({
    sales: 7500000,
    volume: 18500,
    shipments: 2850,
    satisfaction: 94.2
  }), []);

  // 성능 최적화: 글로벌 지점 데이터 캐싱
  const globalLocations = useMemo(() => [
    // 서울 (중앙)
    { name: '서울', x: 500, y: 250, type: 'hq', color: '#ef4444', size: 'large' },
    
    // 아시아
    { name: '부산', x: 520, y: 270, type: 'port', color: '#3b82f6', size: 'medium' },
    { name: '인천', x: 510, y: 240, type: 'airport', color: '#10b981', size: 'medium' },
    { name: '도쿄', x: 650, y: 220, type: 'overseas', color: '#06b6d4', size: 'large' },
    { name: '상하이', x: 580, y: 260, type: 'overseas', color: '#ec4899', size: 'large' },
    { name: '싱가포르', x: 450, y: 350, type: 'overseas', color: '#84cc16', size: 'medium' },
    { name: '홍콩', x: 540, y: 290, type: 'overseas', color: '#f59e0b', size: 'large' },
    { name: '방콕', x: 420, y: 330, type: 'overseas', color: '#8b5cf6', size: 'medium' },
    { name: '마닐라', x: 580, y: 320, type: 'overseas', color: '#f97316', size: 'small' },
    { name: '자카르타', x: 440, y: 370, type: 'overseas', color: '#06b6d4', size: 'medium' },
    
    // 북미
    { name: '로스앤젤레스', x: 120, y: 250, type: 'overseas', color: '#f59e0b', size: 'large' },
    { name: '뉴욕', x: 200, y: 180, type: 'overseas', color: '#ef4444', size: 'large' },
    { name: '시카고', x: 180, y: 160, type: 'overseas', color: '#3b82f6', size: 'medium' },
    { name: '토론토', x: 220, y: 140, type: 'overseas', color: '#10b981', size: 'medium' },
    { name: '밴쿠버', x: 80, y: 120, type: 'overseas', color: '#8b5cf6', size: 'small' },
    { name: '휴스턴', x: 150, y: 300, type: 'overseas', color: '#ec4899', size: 'medium' },
    
    // 유럽
    { name: '함부르크', x: 400, y: 160, type: 'overseas', color: '#8b5cf6', size: 'large' },
    { name: '로테르담', x: 380, y: 170, type: 'overseas', color: '#06b6d4', size: 'large' },
    { name: '런던', x: 350, y: 180, type: 'overseas', color: '#f59e0b', size: 'large' },
    { name: '파리', x: 370, y: 190, type: 'overseas', color: '#84cc16', size: 'medium' },
    { name: '마르세유', x: 390, y: 210, type: 'overseas', color: '#f97316', size: 'medium' },
    { name: '바르셀로나', x: 360, y: 220, type: 'overseas', color: '#ec4899', size: 'small' },
    { name: '제노바', x: 410, y: 200, type: 'overseas', color: '#10b981', size: 'medium' },
    { name: '피레우스', x: 430, y: 220, type: 'overseas', color: '#8b5cf6', size: 'small' },
    
    // 중동
    { name: '두바이', x: 650, y: 280, type: 'overseas', color: '#f59e0b', size: 'large' },
    { name: '지다', x: 630, y: 290, type: 'overseas', color: '#06b6d4', size: 'medium' },
    { name: '도하', x: 670, y: 300, type: 'overseas', color: '#84cc16', size: 'small' },
    
    // 아프리카
    { name: '케이프타운', x: 480, y: 400, type: 'overseas', color: '#f97316', size: 'medium' },
    { name: '카사블랑카', x: 380, y: 280, type: 'overseas', color: '#ec4899', size: 'small' },
    
    // 오세아니아
    { name: '시드니', x: 950, y: 350, type: 'overseas', color: '#10b981', size: 'large' },
    { name: '멜버른', x: 930, y: 370, type: 'overseas', color: '#8b5cf6', size: 'medium' },
    { name: '오클랜드', x: 980, y: 390, type: 'overseas', color: '#06b6d4', size: 'small' },
    
    // 남미
    { name: '상파울루', x: 250, y: 350, type: 'overseas', color: '#84cc16', size: 'large' },
    { name: '부에노스아이레스', x: 230, y: 380, type: 'overseas', color: '#f59e0b', size: 'medium' },
    { name: '산티아고', x: 200, y: 370, type: 'overseas', color: '#ec4899', size: 'small' },
    { name: '리우데자네이루', x: 270, y: 360, type: 'overseas', color: '#f97316', size: 'medium' }
  ], []);

  useEffect(() => {
    const sessionData = localStorage.getItem('htns-session');
    if (sessionData) {
      try {
        const parsedSession = JSON.parse(sessionData);
        if (parsedSession.jsessionId && parsedSession.csrfToken) {
          setSession(parsedSession);
          // 로그인 시 글로벌 맵을 기본으로 설정
          setSelectedTab(0);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 0, name: '글로벌 맵', icon: Globe, color: 'from-blue-500 to-blue-600' },
    { id: 1, name: '매출대시보드', icon: TrendingUp, color: 'from-purple-500 to-purple-600' }
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

      <div className="relative z-10 p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-6"
          >
            <div className="text-center">
              <p className="text-blue-200 text-3xl font-bold mb-1">HTNS 그룹사</p>
              <p className="text-blue-200 text-2xl font-semibold">경영실적 대시보드</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {/* 실시간 시계 */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-300" />
                <span className="text-white font-mono text-lg">
                  {currentTime.toLocaleTimeString('ko-KR')}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto">
          {/* 탭 UI */}
          <div className="flex justify-center gap-2 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-base transition-all border-2 backdrop-blur-md shadow-sm ${
                  selectedTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white border-white/40 shadow-lg`
                    : 'bg-white/10 text-blue-100 border-white/10 hover:bg-white/20 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* 탭별 컨텐츠 */}
          {selectedTab === 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <Building2 className="w-8 h-8 text-blue-300" />
                <h2 className="text-2xl font-bold text-white">글로벌 물류 네트워크</h2>
              </div>
              <div className="relative w-full h-96">
                {/* 기존 SVG 맵 코드 전체 복사 */}
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                  {/* 배경 지도 (더 정교한 윤곽선) */}
                  <path
                    d="M 50 150 Q 100 120 150 150 Q 200 180 250 150 Q 300 120 350 150 Q 400 180 450 150 Q 500 120 550 150 Q 600 180 650 150 Q 700 120 750 150 Q 800 180 850 150 Q 900 120 950 150"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.4"
                  />
                  <path
                    d="M 50 200 Q 100 170 150 200 Q 200 230 250 200 Q 300 170 350 200 Q 400 230 450 200 Q 500 170 550 200 Q 600 230 650 200 Q 700 170 750 200 Q 800 230 850 200 Q 900 170 950 200"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.3"
                  />
                  <path
                    d="M 50 250 Q 100 220 150 250 Q 200 280 250 250 Q 300 220 350 250 Q 400 280 450 250 Q 500 220 550 250 Q 600 280 650 250 Q 700 220 750 250 Q 800 280 850 250 Q 900 220 950 250"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.2"
                  />
                  
                  {/* 글로벌 지점들 - 캐싱된 데이터 사용 */}
                  {globalLocations.map((location, index) => (
                    <g key={location.name}>
                      {/* 연결선 - 서울에서 모든 지점으로 */}
                      <motion.line
                        x1="500"
                        y1="250"
                        x2={location.x}
                        y2={location.y}
                        stroke={location.color}
                        strokeWidth={location.size === 'large' ? "3" : location.size === 'medium' ? "2" : "1"}
                        strokeDasharray="5,5"
                        opacity="0.6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: index * 0.1 }}
                      />
                      
                      {/* 거점 마커 */}
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
                      >
                        {/* 마커 크기별 조정 */}
                        <circle
                          cx={location.x}
                          cy={location.y}
                          r={location.size === 'large' ? 12 : location.size === 'medium' ? 8 : 6}
                          fill={location.color}
                          stroke="white"
                          strokeWidth="2"
                        />
                        <circle
                          cx={location.x}
                          cy={location.y}
                          r={location.size === 'large' ? 6 : location.size === 'medium' ? 4 : 3}
                          fill="white"
                        />

                        {/* 펄스 효과 - 최적화된 지속 시간 */}
                        <motion.circle
                          cx={location.x}
                          cy={location.y}
                          r={location.size === 'large' ? 18 : location.size === 'medium' ? 14 : 10}
                          stroke={location.color}
                          strokeWidth="2"
                          fill="none"
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
                        />
                        
                        {/* 추가 펄스 효과 - 최적화된 지속 시간 */}
                        <motion.circle
                          cx={location.x}
                          cy={location.y}
                          r={location.size === 'large' ? 24 : location.size === 'medium' ? 20 : 16}
                          stroke={location.color}
                          strokeWidth="1"
                          fill="none"
                          initial={{ scale: 0, opacity: 0.5 }}
                          animate={{ scale: 3, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 + 0.5 }}
                        />
                      </motion.g>

                      {/* 라벨 */}
                      <motion.text
                        x={location.x}
                        y={location.y + (location.size === 'large' ? 35 : 25)}
                        textAnchor="middle"
                        fontSize={location.size === 'large' ? "14" : location.size === 'medium' ? "12" : "10"}
                        fill="white"
                        fontWeight="bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 1.5 }}
                      >
                        {location.name}
                      </motion.text>
                    </g>
                  ))}

                  {/* 움직이는 물류 아이콘들 - 최적화된 애니메이션 */}
                  <motion.g
                    initial={{ x: 500, y: 250 }}
                    animate={{
                      x: [500, 150, 450, 820, 880, 780, 500, 600, 300, 500],
                      y: [250, 250, 180, 220, 210, 280, 250, 260, 320, 250]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <circle cx="0" cy="0" r="4" fill="#ef4444" />
                  </motion.g>

                  <motion.g
                    initial={{ x: 500, y: 250 }}
                    animate={{
                      x: [500, 450, 820, 880, 780, 870, 500, 580, 900, 500],
                      y: [250, 180, 220, 210, 280, 200, 250, 270, 320, 250]
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 2
                    }}
                  >
                    <circle cx="0" cy="0" r="3" fill="#3b82f6" />
                  </motion.g>

                  <motion.g
                    initial={{ x: 500, y: 250 }}
                    animate={{
                      x: [500, 250, 600, 900, 280, 500, 620, 950, 500],
                      y: [250, 200, 260, 320, 350, 250, 280, 360, 250]
                    }}
                    transition={{
                      duration: 14,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 4
                    }}
                  >
                    <circle cx="0" cy="0" r="3" fill="#10b981" />
                  </motion.g>

                  <motion.g
                    initial={{ x: 500, y: 250 }}
                    animate={{
                      x: [500, 400, 420, 440, 410, 500, 500, 500],
                      y: [250, 200, 210, 230, 240, 250, 350, 250]
                    }}
                    transition={{
                      duration: 11,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 6
                    }}
                  >
                    <circle cx="0" cy="0" r="2" fill="#f59e0b" />
                  </motion.g>
                </svg>
              </div>
              <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-white text-sm">본사</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-white text-sm">항구</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white text-sm">공항</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-white text-sm">해외거점</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-white text-sm">소규모거점</span>
                </div>
              </div>
            </motion.div>
          )}
          {selectedTab === 1 && (
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl overflow-hidden">
              <div className="flex items-center justify-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-300" />
                <h2 className="text-xl font-bold text-white">매출대시보드</h2>
              </div>
              
              {/* 매출 현황 카드들 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {/* 월간 매출 */}
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md rounded-xl p-4 border border-purple-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="w-6 h-6 text-purple-400" />
                    <div className="text-purple-400 text-xs font-semibold">
                      월간
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    ₩9,500,000
                  </div>
                  <div className="text-purple-300 text-xs">월간 매출액</div>
                </div>

                {/* 분기별 매출 */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-xl p-4 border border-blue-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    <div className="text-blue-400 text-xs font-semibold">
                      분기별
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    ₩22,500,000
                  </div>
                  <div className="text-blue-300 text-xs">분기별 매출액</div>
                </div>

                {/* 연간 매출 */}
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md rounded-xl p-4 border border-green-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <LineChart className="w-6 h-6 text-green-400" />
                    <div className="text-green-400 text-xs font-semibold">
                      연간
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    ₩85,000,000
                  </div>
                  <div className="text-green-300 text-xs">연간 매출액</div>
                </div>

                {/* 매출 성장률 */}
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-md rounded-xl p-4 border border-orange-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                    <div className="text-orange-400 text-xs font-semibold">
                      성장률
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    +12.5%
                  </div>
                  <div className="text-orange-300 text-xs">전년 대비 성장률</div>
                </div>
              </div>

              {/* 매출 차트 섹션 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* 월별 매출 추이 */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-white">월별 매출 추이</h3>
                    <LineChart className="w-4 h-4 text-purple-400" />
                  </div>
                  
                  {/* 월별 매출 바 차트 */}
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[
                      { month: '1월', height: 45 },
                      { month: '2월', height: 52 },
                      { month: '3월', height: 38 },
                      { month: '4월', height: 65 },
                      { month: '5월', height: 58 },
                      { month: '6월', height: 72 },
                      { month: '7월', height: 48 },
                      { month: '8월', height: 55 },
                      { month: '9월', height: 68 },
                      { month: '10월', height: 75 },
                      { month: '11월', height: 62 },
                      { month: '12월', height: 80 }
                    ].map((item, i) => (
                      <div
                        key={item.month}
                        className="bg-gradient-to-t from-purple-400 to-purple-600 rounded-t-lg flex-1"
                        style={{ height: `${item.height}%` }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-300 mt-2">
                    <span>1월</span>
                    <span>3월</span>
                    <span>6월</span>
                    <span>9월</span>
                    <span>12월</span>
                  </div>
                </div>

                {/* 부문별 매출 비율 */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-white">부문별 매출 비율</h3>
                    <PieChart className="w-4 h-4 text-blue-400" />
                  </div>
                  
                  {/* 부문별 매출 비율 */}
                  <div className="space-y-3">
                    {[
                      { name: '본사', percentage: 45, color: 'from-red-400 to-red-600' },
                      { name: '국내', percentage: 35, color: 'from-blue-400 to-blue-600' },
                      { name: '해외', percentage: 20, color: 'from-green-400 to-green-600' }
                    ].map((item, i) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 bg-gradient-to-r ${item.color} rounded-full`}></div>
                          <span className="text-white text-sm">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${item.color}`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-white text-sm font-semibold">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 주요 거래처 매출 현황 */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-white">주요 거래처 매출 현황</h3>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: '삼성전자', amount: 12500000, growth: '+12.5%' },
                    { name: 'LG전자', amount: 9800000, growth: '+8.3%' },
                    { name: '현대자동차', amount: 8700000, growth: '+15.2%' }
                  ].map((client, i) => (
                    <div
                      key={client.name}
                      className="bg-white/10 rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold">{client.name}</h4>
                        <span className="text-green-400 text-sm font-medium">{client.growth}</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        ₩{client.amount.toLocaleString()}
                      </div>
                      <div className="text-gray-300 text-sm">월간 매출</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}