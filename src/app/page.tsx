'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, Calendar, Clock, Building2, Globe, BarChart3, Package, Truck, Ship, Plane, Warehouse, DollarSign
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
  const [selectedTab, setSelectedTab] = useState(2);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const router = useRouter();

  // 성능 최적화: 랜덤 통계 데이터 캐싱
  const randomStats = useMemo(() => ({
    sales: Math.floor(Math.random() * 1000000 + 5000000),
    volume: Math.floor(Math.random() * 5000 + 15000),
    shipments: Math.floor(Math.random() * 500 + 2500),
    satisfaction: (Math.random() * 10 + 90).toFixed(1)
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
          // 로그인 시 랜덤 탭 선택
          setSelectedTab(Math.floor(Math.random() * 5));
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
    { id: 1, name: '3D 네트워크', icon: Package, color: 'from-purple-500 to-purple-600' },
    { id: 2, name: '실시간 통계', icon: BarChart3, color: 'from-green-500 to-green-600' },
    { id: 3, name: '미니어처 센터', icon: Warehouse, color: 'from-orange-500 to-orange-600' },
    { id: 4, name: '파티클 시스템', icon: Truck, color: 'from-red-500 to-red-600' }
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
        <svg className="absolute bottom-0 right-0 w-[32rem] h-[32rem] opacity-50 animate-pulse-slow" viewBox="0 0 512 512" fill="none">
          <text
            x="256"
            y="480"
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
        <div className="flex justify-between items-center mb-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-6"
          >
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
              <Globe className="w-8 h-8 text-white" />
            </div>
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
        <div className="max-w-6xl mx-auto">
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
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <Package className="w-8 h-8 text-purple-300" />
                <h2 className="text-2xl font-bold text-white">3D 물류 네트워크 시각화</h2>
              </div>
              
              {/* 3D 네트워크 애니메이션 */}
              <div className="relative w-full h-96 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl overflow-hidden">
                {/* 3D 그리드 배경 */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 1000 500" className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#8b5cf6" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* 움직이는 항공기 */}
                <motion.div
                  className="absolute"
                  initial={{ x: -50, y: 100 }}
                  animate={{ 
                    x: [50, 200, 400, 600, 800, 950],
                    y: [100, 50, 150, 80, 120, 100]
                  }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Plane className="w-8 h-8 text-blue-400 drop-shadow-lg" />
                </motion.div>

                {/* 움직이는 배 */}
                <motion.div
                  className="absolute"
                  initial={{ x: -50, y: 300 }}
                  animate={{ 
                    x: [50, 150, 300, 500, 700, 900, 950],
                    y: [300, 280, 320, 290, 310, 300, 300]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    ease: "linear",
                    delay: 3
                  }}
                >
                  <Ship className="w-10 h-10 text-cyan-400 drop-shadow-lg" />
                </motion.div>

                {/* 움직이는 트럭 */}
                <motion.div
                  className="absolute"
                  initial={{ x: -50, y: 400 }}
                  animate={{ 
                    x: [50, 200, 350, 500, 650, 800, 950],
                    y: [400, 380, 420, 390, 410, 400, 400]
                  }}
                  transition={{ 
                    duration: 12, 
                    repeat: Infinity,
                    ease: "linear",
                    delay: 6
                  }}
                >
                  <Truck className="w-8 h-8 text-green-400 drop-shadow-lg" />
                </motion.div>

                {/* 연결선들 */}
                <svg className="absolute inset-0 w-full h-full">
                  <motion.path
                    d="M 100 150 Q 300 100 500 150 Q 700 200 900 150"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.path
                    d="M 100 350 Q 300 300 500 350 Q 700 400 900 350"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />
                </svg>

                {/* 3D 효과를 위한 그림자 */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* 범례 */}
              <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-400" />
                  <span className="text-white text-sm">항공 운송</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ship className="w-5 h-5 text-cyan-400" />
                  <span className="text-white text-sm">해상 운송</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-400" />
                  <span className="text-white text-sm">육상 운송</span>
                </div>
              </div>
            </motion.div>
          )}
          {selectedTab === 2 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <BarChart3 className="w-8 h-8 text-green-300" />
                <h2 className="text-2xl font-bold text-white">실시간 통계 대시보드</h2>
              </div>
              
              {/* 실시간 통계 카드들 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* 총 매출 */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md rounded-2xl p-6 border border-green-400/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-8 h-8 text-green-400" />
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-green-400 text-sm font-semibold"
                    >
                      실시간
                    </motion.div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      ₩{randomStats.sales.toLocaleString()}
                    </motion.span>
                  </div>
                  <div className="text-green-300 text-sm">총 매출액</div>
                </motion.div>

                {/* 물동량 */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-6 border border-blue-400/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-8 h-8 text-blue-400" />
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-blue-400 text-sm font-semibold"
                    >
                      실시간
                    </motion.div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {randomStats.volume.toLocaleString()}톤
                    </motion.span>
                  </div>
                  <div className="text-blue-300 text-sm">월간 물동량</div>
                </motion.div>

                {/* 운송 건수 */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Truck className="w-8 h-8 text-purple-400" />
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-purple-400 text-sm font-semibold"
                    >
                      실시간
                    </motion.div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      {randomStats.shipments.toLocaleString()}건
                    </motion.span>
                  </div>
                  <div className="text-purple-300 text-sm">월간 운송 건수</div>
                </motion.div>

                {/* 고객 만족도 */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-md rounded-2xl p-6 border border-orange-400/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="w-8 h-8 text-orange-400" />
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-orange-400 text-sm font-semibold"
                    >
                      실시간
                    </motion.div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      {randomStats.satisfaction}%
                    </motion.span>
                  </div>
                  <div className="text-orange-300 text-sm">고객 만족도</div>
                </motion.div>
              </div>

              {/* 실시간 차트 */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">실시간 물류 현황</h3>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <BarChart3 className="w-5 h-5 text-green-400" />
                  </motion.div>
                </div>
                
                {/* 실시간 바 차트 */}
                <div className="flex items-end justify-between h-32 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: Math.random() * 100 + 20 }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="bg-gradient-to-t from-green-400 to-green-600 rounded-t-lg flex-1"
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-gray-300 mt-2">
                  <span>00:00</span>
                  <span>03:00</span>
                  <span>06:00</span>
                  <span>09:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                  <span>21:00</span>
                </div>
              </div>
            </motion.div>
          )}
          {selectedTab === 3 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <Warehouse className="w-8 h-8 text-orange-300" />
                <h2 className="text-2xl font-bold text-white">미니어처 물류 센터</h2>
              </div>
              
              {/* 미니어처 센터 레이아웃 */}
              <div className="relative w-full h-96 bg-gradient-to-br from-orange-900/20 to-yellow-900/20 rounded-2xl overflow-hidden">
                {/* 배경 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-transparent to-green-900/30"></div>
                
                {/* 공항 영역 */}
                <div className="absolute top-4 left-4 w-32 h-24 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="flex items-center justify-center gap-2 p-2">
                    <Plane className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-xs font-semibold">공항</span>
                  </div>
                  
                  {/* 움직이는 비행기들 */}
                  <motion.div
                    className="absolute top-8 left-2"
                    animate={{ 
                      x: [0, 100, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Plane className="w-6 h-6 text-blue-400" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-12 right-2"
                    animate={{ 
                      x: [0, -80, 0],
                      y: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    <Plane className="w-5 h-5 text-blue-300" />
                  </motion.div>
                </div>

                {/* 항구 영역 */}
                <div className="absolute top-4 right-4 w-32 h-24 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="flex items-center justify-center gap-2 p-2">
                    <Ship className="w-4 h-4 text-cyan-400" />
                    <span className="text-white text-xs font-semibold">항구</span>
                  </div>
                  
                  {/* 움직이는 배들 */}
                  <motion.div
                    className="absolute bottom-2 left-4"
                    animate={{ 
                      x: [0, 60, 0],
                      y: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Ship className="w-6 h-6 text-cyan-400" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-4 right-4"
                    animate={{ 
                      x: [0, -40, 0],
                      y: [0, -3, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  >
                    <Ship className="w-5 h-5 text-cyan-300" />
                  </motion.div>
                </div>

                {/* 창고 영역 */}
                <div className="absolute bottom-4 left-4 w-32 h-24 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="flex items-center justify-center gap-2 p-2">
                    <Warehouse className="w-4 h-4 text-orange-400" />
                    <span className="text-white text-xs font-semibold">창고</span>
                  </div>
                  
                  {/* 움직이는 트럭들 */}
                  <motion.div
                    className="absolute bottom-2 left-2"
                    animate={{ 
                      x: [0, 80, 0],
                      y: [0, -2, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Truck className="w-5 h-5 text-orange-400" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-4 right-2"
                    animate={{ 
                      x: [0, -60, 0],
                      y: [0, -1, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                  >
                    <Truck className="w-4 h-4 text-orange-300" />
                  </motion.div>
                </div>

                {/* 중앙 물류 허브 */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-32 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30">
                  <div className="flex items-center justify-center gap-2 p-2">
                    <Package className="w-5 h-5 text-yellow-400" />
                    <span className="text-white text-sm font-semibold">물류 허브</span>
                  </div>
                  
                  {/* 중앙에서 움직이는 패키지들 */}
                  <motion.div
                    className="absolute top-8 left-4"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Package className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-8 right-4"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, -360]
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    <Package className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                </div>

                {/* 연결선들 */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <motion.path
                    d="M 80 80 Q 200 60 300 80"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.path
                    d="M 300 80 Q 400 100 500 80"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />
                  <motion.path
                    d="M 80 300 Q 200 280 300 300"
                    stroke="#f97316"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  />
                </svg>

                {/* 미니어처 효과를 위한 그림자 */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* 범례 */}
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm">공항</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-cyan-400" />
                  <span className="text-white text-sm">항구</span>
                </div>
                <div className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-orange-400" />
                  <span className="text-white text-sm">창고</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm">물류 허브</span>
                </div>
              </div>
            </motion.div>
          )}
          {selectedTab === 4 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <Truck className="w-8 h-8 text-red-300" />
                <h2 className="text-2xl font-bold text-white">파티클 시스템</h2>
              </div>
              
              {/* 파티클 시스템 컨테이너 */}
              <div className="relative w-full h-96 bg-gradient-to-br from-red-900/20 to-pink-900/20 rounded-2xl overflow-hidden">
                {/* 중앙 HTNS 로고 */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="bg-gradient-to-br from-red-500 to-pink-500 rounded-full p-6 shadow-2xl"
                  >
                    <div className="text-white font-bold text-xl">HTNS</div>
                  </motion.div>
                </div>

                {/* 파티클 아이콘들 - 최적화된 개수 */}
                {/* 비행기 파티클 */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`plane-${i}`}
                    className="absolute"
                    initial={{ 
                      x: Math.random() * 800 + 100,
                      y: Math.random() * 400 + 50
                    }}
                    animate={{ 
                      x: [Math.random() * 800 + 100, Math.random() * 800 + 100],
                      y: [Math.random() * 400 + 50, Math.random() * 400 + 50],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: Math.random() * 8 + 8, 
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.5
                    }}
                  >
                    <Plane className="w-4 h-4 text-blue-400 opacity-60" />
                  </motion.div>
                ))}

                {/* 배 파티클 */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`ship-${i}`}
                    className="absolute"
                    initial={{ 
                      x: Math.random() * 800 + 100,
                      y: Math.random() * 400 + 50
                    }}
                    animate={{ 
                      x: [Math.random() * 800 + 100, Math.random() * 800 + 100],
                      y: [Math.random() * 400 + 50, Math.random() * 400 + 50],
                      rotate: [0, -360]
                    }}
                    transition={{ 
                      duration: Math.random() * 10 + 10, 
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.7
                    }}
                  >
                    <Ship className="w-5 h-5 text-cyan-400 opacity-60" />
                  </motion.div>
                ))}

                {/* 트럭 파티클 */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`truck-${i}`}
                    className="absolute"
                    initial={{ 
                      x: Math.random() * 800 + 100,
                      y: Math.random() * 400 + 50
                    }}
                    animate={{ 
                      x: [Math.random() * 800 + 100, Math.random() * 800 + 100],
                      y: [Math.random() * 400 + 50, Math.random() * 400 + 50],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: Math.random() * 6 + 6, 
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.3
                    }}
                  >
                    <Truck className="w-4 h-4 text-green-400 opacity-60" />
                  </motion.div>
                ))}

                {/* 패키지 파티클 */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`package-${i}`}
                    className="absolute"
                    initial={{ 
                      x: Math.random() * 800 + 100,
                      y: Math.random() * 400 + 50
                    }}
                    animate={{ 
                      x: [Math.random() * 800 + 100, Math.random() * 800 + 100],
                      y: [Math.random() * 400 + 50, Math.random() * 400 + 50],
                      rotate: [0, 720]
                    }}
                    transition={{ 
                      duration: Math.random() * 12 + 12, 
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.2
                    }}
                  >
                    <Package className="w-3 h-3 text-yellow-400 opacity-70" />
                  </motion.div>
                ))}

                {/* 창고 파티클 */}
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={`warehouse-${i}`}
                    className="absolute"
                    initial={{ 
                      x: Math.random() * 800 + 100,
                      y: Math.random() * 400 + 50
                    }}
                    animate={{ 
                      x: [Math.random() * 800 + 100, Math.random() * 800 + 100],
                      y: [Math.random() * 400 + 50, Math.random() * 400 + 50],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      duration: Math.random() * 15 + 15, 
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 1
                    }}
                  >
                    <Warehouse className="w-6 h-6 text-orange-400 opacity-50" />
                  </motion.div>
                ))}

                {/* 중앙으로 향하는 파티클 흐름 - 최적화된 개수 */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.circle
                      key={`flow-${i}`}
                      cx={Math.random() * 800 + 100}
                      cy={Math.random() * 400 + 50}
                      r="2"
                      fill="#ef4444"
                      opacity="0.6"
                      initial={{ 
                        cx: Math.random() * 800 + 100,
                        cy: Math.random() * 400 + 50
                      }}
                      animate={{ 
                        cx: [Math.random() * 800 + 100, 400, Math.random() * 800 + 100],
                        cy: [Math.random() * 400 + 50, 200, Math.random() * 400 + 50]
                      }}
                      transition={{ 
                        duration: Math.random() * 6 + 6, 
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.4
                      }}
                    />
                  ))}
                </svg>

                {/* 파티클 효과를 위한 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-pink-500/10"></div>
              </div>

              {/* 범례 */}
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm">항공 운송</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-cyan-400" />
                  <span className="text-white text-sm">해상 운송</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">육상 운송</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm">화물</span>
                </div>
                <div className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-orange-400" />
                  <span className="text-white text-sm">창고</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}