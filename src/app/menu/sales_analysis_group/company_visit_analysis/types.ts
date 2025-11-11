// D3 트리맵 및 피벗 매트릭스 통합 타입 정의

// 트리맵 노드 타입
export interface TreemapNode {
  name: string;
  value: number;
  children?: TreemapNode[];
  // 추가 메타데이터
  year?: string;
  company?: string;
  country?: string;
  person?: string;
  month?: string;
  qty?: number;
  color?: string;
}

// 필드 타입
export interface Field {
  name: string;
  type: 'dimension' | 'measure';
  icon: string;
}

// 트리 레이블 설정
export interface TreeLabel {
  name: string;
  direction: '↑' | '↓';
  order: number;
}

// 트리 레이블 설정 (드래그 가능)
export interface TreeLabelConfig {
  name: string;
  direction: '↑' | '↓';
  order: number;
  selected: boolean;
}

// 피벗 매트릭스 설정
export interface PivotConfig {
  values: string[];
  treeLabels: TreeLabelConfig[];
  selectedValue: string;
}

// 샘플 데이터 타입
export interface SampleData {
  year: string;
  company: string;
  country: string;
  person: string;
  month: string;
  qty: number;
  value: number;
}

// 스토어 상태
export interface TreemapStore {
  data: TreemapNode[];
  rawData: SampleData[];
  loading: boolean;
  error: string | null;
  pivotConfig: PivotConfig;
  selectedNode: TreemapNode | null;
  
  // 액션
  setData: (data: TreemapNode[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPivotConfig: (config: Partial<PivotConfig>) => void;
  setSelectedNode: (node: TreemapNode | null) => void;
  generateSampleData: () => void;
  transformToTreemapData: () => void;
  reorderTreeLabels: (labels: TreeLabelConfig[]) => void;
  setValueField: (value: string) => void;
}
