'use client';

import { useTopClientsStore } from '../store';
import { Plane, Ship, Truck, Train } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Plane,
  Ship,
  Truck,
  Train,
};

// 탭별 색상 매핑
const tabColors = {
  '항공수출': 'text-blue-600',
  '항공수입': 'text-purple-600',
  '해상수출': 'text-emerald-600',
  '해상수입': 'text-cyan-600',
  '운송': 'text-amber-600',
  '철도': 'text-red-600',
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isAnimating?: boolean;
}

function TabButton({ active, onClick, icon, label, isAnimating = false }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium relative ${
        active 
          ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20' 
          : 'text-blue-200 hover:bg-white/10 hover:text-white hover:shadow-md backdrop-blur-sm'
      }`}
    >
      {/* 아이콘 애니메이션 컨테이너 */}
      <div className="relative">
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}

export function TopSection() {
  const { selectedTab, animatingTab, setSelectedTab, setAnimatingTab, transportData } = useTopClientsStore();

  const handleTabClick = (tab: string) => {
    // 즉시 화면 전환
    setSelectedTab(tab as any);
    
    // 애니메이션 시작 (화면 전환과 독립적)
    setAnimatingTab(tab);
    
    // 3초 후 애니메이션만 종료
    setTimeout(() => {
      setAnimatingTab(null);
    }, 3000);
  };

  return (
    <div className="mb-8 relative">
      <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
        {Object.entries(transportData).map(([key, data]) => {
          const IconComponent = iconMap[data.iconName as keyof typeof iconMap];
          const iconColor = tabColors[key as keyof typeof tabColors] || 'text-blue-600';
          return (
            <TabButton
              key={key}
              active={selectedTab === key}
              onClick={() => handleTabClick(key)}
              icon={<IconComponent className={`w-12 h-12 ${iconColor}`} />}
              label={key}
              isAnimating={animatingTab === key}
            />
          );
        })}
      </div>
      
      {/* 오른쪽 노란색 선 영역 */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-yellow-400/30 to-yellow-400/50 rounded-r-2xl pointer-events-none">
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-full"></div>
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-full"></div>
      </div>
      
      {/* 애니메이션 아이콘 - 전체 영역에서 움직임 */}
      {animatingTab && (
        <motion.div
          className="absolute z-50 pointer-events-none"
          initial={{ 
            x: 850, // 철도 아이콘 옆에서 시작 (50px 더 오른쪽)
            y: 0, 
            opacity: 1, 
            scale: 1.2 
          }}
          animate={{ 
            x: [850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450], 
            y: [0, -5, 5, -3, 0, 3, -3, 0, 2, -2, 0, 0, 0],
            opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            scale: [1.2, 1.3, 1.2, 1.25, 1.2, 1.3, 1.2, 1.25, 1.2, 1.3, 1.2, 1.25, 1]
          }}
          transition={{ 
            duration: 3,
            ease: "easeInOut"
          }}
          style={{
            left: '20px', // 탭 버튼 시작 위치
            top: '40%', // 더 위로 이동
            transform: 'translateY(-50%)'
          }}
        >
          {(() => {
            const IconComponent = iconMap[transportData[animatingTab as keyof typeof transportData]?.iconName as keyof typeof iconMap];
            const iconColor = tabColors[animatingTab as keyof typeof tabColors] || 'text-blue-600';
            return IconComponent ? <IconComponent className={`w-12 h-12 ${iconColor}`} /> : null;
          })()}
        </motion.div>
      )}
    </div>
  );
}
