import { create } from 'zustand';
import { DivisionData } from './types';

interface DivisionState {
  data: DivisionData | null;
  loading: boolean;
  error: string | null;
  selectedDivision: string | null;
  fetchDivisionData: () => Promise<void>;
  setSelectedDivision: (divisionId: string | null) => void;
}

// API 호출 함수들
const fetchDivisionCardsAPI = async () => {
  try {
    const response = await fetch('/auth/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: '/api/division/cards',
        method: 'GET',
      }),
    });

    if (!response.ok) {
      throw new Error('부문별 카드 데이터 로딩 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('부문별 카드 API 오류:', error);
    return null;
  }
};

const fetchDivisionTableAPI = async () => {
  try {
    const response = await fetch('/auth/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: '/api/division/table',
        method: 'GET',
      }),
    });

    if (!response.ok) {
      throw new Error('부문별 테이블 데이터 로딩 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('부문별 테이블 API 오류:', error);
    return null;
  }
};

// 목 데이터 생성 함수들
const generateMockDivisionCards = () => {
  return [
    {
      id: 'air',
      name: '항공',
      revenue: 615,
      growth: 0,
      profit: -13.7,
      color: 'bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-700/10',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-200',
      icon: 'Plane'
    },
    {
      id: 'sea',
      name: '해상',
      revenue: 203,
      growth: 1,
      profit: 0.5,
      color: 'bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-emerald-700/10',
      borderColor: 'border-emerald-400/30',
      textColor: 'text-emerald-200',
      icon: 'Ship'
    },
    {
      id: 'transport',
      name: '운송',
      revenue: 134,
      growth: -4,
      profit: 3.4,
      color: 'bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-purple-700/10',
      borderColor: 'border-purple-400/30',
      textColor: 'text-purple-200',
      icon: 'Truck'
    },
    {
      id: 'warehouse',
      name: '창고',
      revenue: 81,
      growth: 3,
      profit: -16.1,
      color: 'bg-gradient-to-br from-orange-500/20 via-orange-600/15 to-orange-700/10',
      borderColor: 'border-orange-400/30',
      textColor: 'text-orange-200',
      icon: 'Warehouse'
    },
    {
      id: 'construction',
      name: '도급',
      revenue: 93,
      growth: 5,
      profit: 2.8,
      color: 'bg-gradient-to-br from-pink-500/20 via-pink-600/15 to-pink-700/10',
      borderColor: 'border-pink-400/30',
      textColor: 'text-pink-200',
      icon: 'Building'
    },
    {
      id: 'other',
      name: '기타',
      revenue: 56,
      growth: 12,
      profit: 15.3,
      color: 'bg-gradient-to-br from-cyan-500/20 via-cyan-600/15 to-cyan-700/10',
      borderColor: 'border-cyan-400/30',
      textColor: 'text-cyan-200',
      icon: 'Package'
    }
  ];
};

const generateMockDivisionTable = () => {
  return {
    months: ['9월', '10월', '11월', '12월', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월'],
    divisions: [
      {
        name: '항공',
        color: 'blue',
        revenue: [620, 615, 598, 612, 589, 601, 605, 610, 608, 602, 595, 615],
        profit: [-2.8, -3.3, -0.7, -3.4, -4.2, -1.7, -2.1, -3.8, -2.5, -1.9, -2.3, -3.3]
      },
      {
        name: '해상',
        color: 'emerald',
        revenue: [205, 203, 198, 205, 192, 208, 210, 207, 205, 202, 200, 203],
        profit: [0.6, 0.5, 0.3, 0.8, 0.2, 0.6, 0.7, 0.5, 0.4, 0.3, 0.2, 0.5]
      },
      {
        name: '운송',
        color: 'purple',
        revenue: [158, 156, 148, 162, 155, 158, 160, 157, 159, 156, 154, 156],
        profit: [2.2, 2.1, 1.8, 2.3, 2.0, 1.9, 2.1, 2.0, 2.2, 1.8, 1.7, 2.1]
      },
      {
        name: '창고',
        color: 'orange',
        revenue: [90, 89, 92, 88, 95, 91, 93, 90, 92, 89, 87, 89],
        profit: [1.3, 1.2, 1.5, 1.1, 1.8, 1.4, 1.6, 1.3, 1.5, 1.2, 1.0, 1.2]
      },
      {
        name: '도급',
        color: 'pink',
        revenue: [68, 67, 71, 69, 73, 70, 72, 69, 71, 68, 66, 67],
        profit: [0.9, 0.8, 1.1, 0.9, 1.3, 1.0, 1.2, 0.9, 1.1, 0.8, 0.6, 0.8]
      },
      {
        name: '기타',
        color: 'cyan',
        revenue: [53, 52, 55, 53, 56, 54, 55, 53, 54, 52, 51, 52],
        profit: [0.4, 0.3, 0.5, 0.4, 0.6, 0.4, 0.5, 0.3, 0.4, 0.2, 0.1, 0.3]
      }
    ]
  };
};

// 데이터 파싱 함수
const parseDivisionData = (cardsData: any, tableData: any): DivisionData => {
  return {
    divisionCards: cardsData || generateMockDivisionCards(),
    divisionTable: tableData || generateMockDivisionTable()
  };
};

// Zustand store
export const useDivisionStore = create<DivisionState>((set) => ({
  data: null,
  loading: false,
  error: null,
  selectedDivision: null,
  
  fetchDivisionData: async () => {
    set({ loading: true, error: null });
    
    try {
      const [cardsData, tableData] = await Promise.all([
        fetchDivisionCardsAPI(),
        fetchDivisionTableAPI()
      ]);
      
      const parsedData = parseDivisionData(cardsData, tableData);
      set({ data: parsedData, loading: false });
    } catch (error) {
      console.error('부문별 데이터 로딩 오류:', error);
      set({
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        loading: false
      });
    }
  },
  
  setSelectedDivision: (divisionId: string | null) => {
    set({ selectedDivision: divisionId });
  }
}));
