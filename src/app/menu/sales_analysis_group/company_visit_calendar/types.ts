// 트리맵 데이터 노드 타입
export interface TreemapNode {
  name: string;
  value: number;
  children?: TreemapNode[];
  // 추가 메타데이터
  growthRate?: number;      // 성장률 (%)
  profitRate?: number;       // 수익률 (%)
  revenue?: number;          // 매출액
  target?: number;           // 목표
  achievement?: number;      // 달성률 (%)
  category?: string;         // 카테고리
  color?: string;           // 커스텀 색상
}

// API 응답 타입 (경영실적 데이터)
export interface PerformanceData {
  companyCode: string;
  companyName: string;
  divisionCode?: string;
  divisionName?: string;
  deptCode?: string;
  deptName?: string;
  revenue: number;           // 매출액
  profit?: number;           // 영업이익
  growthRate?: number;       // 전년대비 성장률
  target?: number;           // 목표 매출
  achievement?: number;      // 달성률
  period: string;            // 기간 (YYYYMM)
}


// 트리 레이블 타입
export interface TreeLabelConfig {
  name: string;
  direction: '↑' | '↓';
  selected: boolean;
  order: number;
}

// 필터 상태 타입
export interface TreemapFilterState {
  period: string;            // 조회 기간 (YYYYMM)
  viewMode: 'revenue' | 'profit' | 'growth' | 'achievement';  // 표시 모드
  category: 'all' | 'domestic' | 'overseas' | 'division';     // 카테고리
  sortBy: 'value' | 'growth' | 'name';                        // 정렬 기준
  treeLabels: TreeLabelConfig[]; // 트리 레이블 상태
  selectedValueField: string; // 현재 선택된 값 필드
}

// 스토어 타입
export interface TreemapStore {
  // 상태
  data: TreemapNode[];
  rawData: PerformanceData[];
  loading: boolean;
  error: string | null;
  filters: TreemapFilterState;
  selectedNode: TreemapNode | null;
  
  // 액션
  setData: (data: TreemapNode[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<TreemapFilterState>) => void;
  setSelectedNode: (node: TreemapNode | null) => void;
  toggleTreeLabel: (labelName: string) => void;
  setValueField: (fieldName: string) => void;
  
  // API 호출
  fetchPerformanceData: (period: string) => Promise<void>;
  
  // 데이터 변환
  transformToTreemapData: (rawData: PerformanceData[]) => TreemapNode[];
}

