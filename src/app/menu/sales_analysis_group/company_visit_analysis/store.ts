import { create } from 'zustand';
import { TreemapNode, SampleData, PivotConfig, TreemapStore, TreeLabelConfig } from './types';

// 초기 피벗 설정
const initialPivotConfig: PivotConfig = {
  values: ['Value (Sum)'],
  treeLabels: [
    { name: 'Year', direction: '↑', order: 1, selected: true },
    { name: 'Company', direction: '↑', order: 2, selected: true },
    { name: 'Country', direction: '↑', order: 3, selected: false },
    { name: 'Person', direction: '↑', order: 4, selected: false },
    { name: 'Month', direction: '↑', order: 5, selected: false }
  ],
  selectedValue: 'value'
};

export const useTreemapStore = create<TreemapStore>((set, get) => ({
  // 초기 상태
  data: [],
  rawData: [],
  loading: false,
  error: null,
  pivotConfig: initialPivotConfig,
  selectedNode: null,

  // 액션들
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPivotConfig: (config) => set((state) => ({
    pivotConfig: { ...state.pivotConfig, ...config }
  })),
  setSelectedNode: (selectedNode) => set({ selectedNode }),

  // 샘플 데이터 생성 (Sencha Ext JS SalesData 구조 참고)
  generateSampleData: () => {
    set({ loading: true });
    
    const companies = ['Google', 'Apple', 'Dell', 'Microsoft', 'Adobe'];
    const countries = ['Belgium', 'Netherlands', 'United Kingdom', 'Canada', 'United States', 'Australia'];
    const persons = ['John', 'Michael', 'Mary', 'Anne', 'Robert'];
    const years = ['2012', '2013', '2014', '2015', '2016'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const sampleData: SampleData[] = [];
    let rand = 37; // Sencha와 동일한 시드값
    
    // Sencha의 randomItem 함수와 유사한 로직
    const randomItem = (data: string[]) => {
      const k = rand % data.length;
      rand = rand * 1664525 + 1013904223;
      rand &= 0x7FFFFFFF;
      return data[k];
    };
    
    // 500개 아이템 생성 (Sencha와 동일)
    for (let i = 0; i < 500; i++) {
      const year = randomItem(years);
      const company = randomItem(companies);
      const country = randomItem(countries);
      const person = randomItem(persons);
      const month = randomItem(months);
      
      // Sencha와 유사한 값 범위
      const qty = Math.floor(Math.random() * 30 + 1);
      const value = Math.random() * 1000 + 1;
      
      sampleData.push({
        year,
        company,
        country,
        person,
        month,
        qty,
        value: Math.round(value * 100) / 100 // 소수점 2자리
      });
    }

    console.log('Generated sample data:', sampleData.length, 'items');
    console.log('Sample items:', sampleData.slice(0, 5));
    
    set({ rawData: sampleData, loading: false });
    get().transformToTreemapData();
  },

  // 트리맵 데이터로 변환
  transformToTreemapData: () => {
    const { rawData, pivotConfig } = get();
    
    if (rawData.length === 0) return;

    // 선택된 트리 레이블 순서대로 계층 구조 생성
    const selectedLabels = pivotConfig.treeLabels
      .sort((a, b) => a.order - b.order)
      .map(label => label.name);

    const hierarchicalData = buildHierarchy(rawData, selectedLabels);
    set({ data: hierarchicalData });
  },

  // 트리 레이블 순서 변경
  reorderTreeLabels: (labels) => {
    set((state) => ({
      pivotConfig: {
        ...state.pivotConfig,
        treeLabels: labels
      }
    }));
    get().transformToTreemapData();
  },

  // 값 필드 변경
  setValueField: (value) => {
    set((state) => ({
      pivotConfig: {
        ...state.pivotConfig,
        selectedValue: value
      }
    }));
    get().transformToTreemapData();
  }
}));

// 계층적 데이터 구조 생성 함수
function buildHierarchy(rawData: SampleData[], labels: string[]): TreemapNode[] {
  if (labels.length === 0) return [];

  const currentLabel = labels[0];
  const remainingLabels = labels.slice(1);
  
  // 현재 레벨에서 그룹화
  const groups = new Map<string, SampleData[]>();
  
  rawData.forEach(item => {
    let groupKey = '';
    
    switch (currentLabel) {
      case 'Year':
        groupKey = item.year;
        break;
      case 'Company':
        groupKey = item.company;
        break;
      case 'Country':
        groupKey = item.country;
              break;
      case 'Person':
        groupKey = item.person;
              break;
      case 'Month':
        groupKey = item.month;
              break;
      default:
        groupKey = 'Unknown';
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(item);
  });

  // 각 그룹을 트리맵 노드로 변환
  return Array.from(groups.entries()).map(([groupName, items]) => {
    const totalValue = items.reduce((sum, item) => sum + item.value, 0);
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    
    const node: TreemapNode = {
      name: groupName,
      value: totalValue,
      qty: totalQty,
    };

    // 하위 레벨이 있으면 재귀적으로 처리
    if (remainingLabels.length > 0) {
      node.children = buildHierarchy(items, remainingLabels);
      
      // 부모 노드의 값을 자식들의 합계로 설정하지 않고 원래 값 유지
      // 이렇게 하면 D3에서 올바른 비율로 표시됨
      console.log(`Parent node ${groupName}: original value=${totalValue}`);
    }

    return node;
  });
}
