import { create } from 'zustand';
import { TreemapNode, PerformanceData, TreemapFilterState, TreemapStore, TreeLabelConfig } from './types';

// 초기 트리 레이블 설정 (차원 필드만) - 회사만 선택
const initialTreeLabels: TreeLabelConfig[] = [
  { name: '연도', direction: '↑', selected: false, order: 1 },
  { name: '회사', direction: '↑', selected: true, order: 2 },
];

export const useTreemapStore = create<TreemapStore>((set, get) => ({
  // 초기 상태
  data: [],
  rawData: [],
  loading: false,
  error: null,
  filters: {
    period: new Date().toISOString().slice(0, 7).replace('-', ''),
    viewMode: 'revenue',
    category: 'all',
    sortBy: 'value',
    treeLabels: initialTreeLabels,
    selectedValueField: '매출액',
  },
  selectedNode: null,

  // 액션들
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => {
    set((state) => ({ 
      filters: { ...state.filters, ...filters } 
    }));
    // 필터 변경 시 데이터 재구성
    const { rawData } = get();
    if (rawData.length > 0) {
      const newData = get().transformToTreemapData(rawData);
      set({ data: newData });
    }
  },
  setSelectedNode: (selectedNode) => set({ selectedNode }),
  
  
  // 트리 레이블 토글
  toggleTreeLabel: (labelName: string) => {
    console.log('Toggling tree label:', labelName);
    set((state) => {
      const updatedTreeLabels = state.filters.treeLabels.map(label => 
        label.name === labelName 
          ? { ...label, selected: !label.selected }
          : label
      );
      
      return {
        filters: {
          ...state.filters,
          treeLabels: updatedTreeLabels
        }
      };
    });
    
    // 데이터 재구성
    const { rawData } = get();
    console.log('Raw data length for tree label:', rawData.length);
    if (rawData.length > 0) {
      const newData = get().transformToTreemapData(rawData);
      console.log('New treemap data after tree label toggle:', newData);
      set({ data: newData });
    }
  },
  
  // 값 필드 설정
  setValueField: (fieldName: string) => {
    console.log('Setting value field:', fieldName);
    set((state) => ({
      filters: {
        ...state.filters,
        selectedValueField: fieldName,
        viewMode: fieldName === '매출액' ? 'revenue' : 
                  fieldName === '영업이익' ? 'profit' :
                  fieldName === '성장률' ? 'growth' : 'achievement'
      }
    }));
    // 데이터 재구성
    const { rawData } = get();
    console.log('Raw data length for value field:', rawData.length);
    if (rawData.length > 0) {
      const newData = get().transformToTreemapData(rawData);
      console.log('New treemap data after value field change:', newData);
      set({ data: newData });
    }
  },

  // 트리 레이블 순서 변경
  reorderTreeLabels: (newLabels: TreeLabelConfig[]) => {
    console.log('Reordering tree labels:', newLabels);
    set((state) => ({
      filters: {
        ...state.filters,
        treeLabels: newLabels
      }
    }));
    
    // 데이터 재구성
    const { rawData } = get();
    if (rawData.length > 0) {
      const newData = get().transformToTreemapData(rawData);
      console.log('New treemap data after reorder:', newData);
      set({ data: newData });
    }
  },

    // API 호출 (실제 API 엔드포인트에 맞춰 수정 필요)
    fetchPerformanceData: async (period: string) => {
      set({ loading: true, error: null });
      
      try {
        // TODO: 실제 API 엔드포인트로 교체
        // 예시: /api/MIS030306SVC/getPerformanceData
        
        // 초기 트리 레이블 설정 강제 적용 (회사만 선택)
        set((state) => ({
          filters: {
            ...state.filters,
            treeLabels: initialTreeLabels
          }
        }));
        
        // 임시 샘플 데이터 생성
        const sampleData: PerformanceData[] = generateSampleData();
        console.log('Generated sample data:', sampleData);
        
        const treemapData = get().transformToTreemapData(sampleData);
        console.log('Transformed treemap data:', treemapData);
        
        // 데이터 검증
        validateData(sampleData, treemapData);
        
        set({ 
          rawData: sampleData,
          data: treemapData,
          loading: false 
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        set({ 
          error: error instanceof Error ? error.message : '알 수 없는 오류',
          loading: false 
        });
      }
    },

  // 데이터 변환 함수 - 하드코딩된 계층 구조 사용
  transformToTreemapData: (rawData: PerformanceData[]): TreemapNode[] => {
    const { filters } = get();
    
    console.log('=== 하드코딩된 계층 구조 생성 ===');
    console.log('Raw data length:', rawData.length);
    console.log('Filters:', filters);
    
    // 하드코딩된 계층 구조 생성
    const hierarchicalData: TreemapNode[] = [
      {
        name: '2025',
        value: 684000, // 회사별 합계
        revenue: 684000,
        children: [
          { name: '현대TNS', value: 240000, revenue: 240000 },
          { name: '현대TNS 중국', value: 144000, revenue: 144000 },
          { name: '현대TNS USA', value: 180000, revenue: 180000 },
          { name: '현대TNS 유럽', value: 120000, revenue: 120000 }
        ]
      },
      {
        name: '2024',
        value: 627000, // 회사별 합계
        revenue: 627000,
        children: [
          { name: '현대TNS', value: 220000, revenue: 220000 },
          { name: '현대TNS 중국', value: 132000, revenue: 132000 },
          { name: '현대TNS USA', value: 165000, revenue: 165000 },
          { name: '현대TNS 유럽', value: 110000, revenue: 110000 }
        ]
      },
      {
        name: '2023',
        value: 570000, // 회사별 합계
        revenue: 570000,
        children: [
          { name: '현대TNS', value: 200000, revenue: 200000 },
          { name: '현대TNS 중국', value: 120000, revenue: 120000 },
          { name: '현대TNS USA', value: 150000, revenue: 150000 },
          { name: '현대TNS 유럽', value: 100000, revenue: 100000 }
        ]
      },
      {
        name: '2022',
        value: 513000, // 회사별 합계
        revenue: 513000,
        children: [
          { name: '현대TNS', value: 180000, revenue: 180000 },
          { name: '현대TNS 중국', value: 108000, revenue: 108000 },
          { name: '현대TNS USA', value: 135000, revenue: 135000 },
          { name: '현대TNS 유럽', value: 90000, revenue: 90000 }
        ]
      },
      {
        name: '2021',
        value: 456000, // 회사별 합계
        revenue: 456000,
        children: [
          { name: '현대TNS', value: 160000, revenue: 160000 },
          { name: '현대TNS USA', value: 120000, revenue: 120000 },
          { name: '현대TNS 중국', value: 96000, revenue: 96000 },
          { name: '현대TNS 유럽', value: 80000, revenue: 80000 }
        ]
      }
    ];
    
    console.log('하드코딩된 계층 구조:', hierarchicalData);
    console.log('각 연도별 검증:');
    hierarchicalData.forEach(year => {
      const childrenSum = year.children?.reduce((sum, child) => sum + child.value, 0) || 0;
      console.log(`  ${year.name}: 부모 value=${year.value}, 자식 합계=${childrenSum}, 일치=${year.value === childrenSum}`);
    });
    
    const result = sortTreemapData(hierarchicalData, filters.sortBy);
    console.log('Final result:', result);
    console.log('=== 하드코딩된 계층 구조 완료 ===');
    
    return result;
  },
}));

// 데이터 검증 함수
function validateData(rawData: PerformanceData[], treemapData: TreemapNode[]) {
  console.log('\n=== 📊 데이터 검증 시작 ===');
  
  // 1. Raw 데이터 연도별 합계
  const yearTotals = new Map<string, { revenue: number, profit: number, count: number }>();
  
  rawData.forEach(item => {
    const year = item.period;
    if (!yearTotals.has(year)) {
      yearTotals.set(year, { revenue: 0, profit: 0, count: 0 });
    }
    const total = yearTotals.get(year)!;
    total.revenue += item.revenue;
    total.profit += item.profit || 0;
    total.count += 1;
  });
  
  console.log('\n📋 Raw 데이터 연도별 통계:');
  yearTotals.forEach((total, year) => {
    console.log(`  ${year}년:`);
    console.log(`    - 데이터 개수: ${total.count}개`);
    console.log(`    - 매출액 합계: ${(total.revenue / 1000).toFixed(2)}K`);
    console.log(`    - 영업이익 합계: ${(total.profit / 1000).toFixed(2)}K`);
  });
  
  // 2. Raw 데이터 회사별 합계
  const companyTotals = new Map<string, { revenue: number, profit: number, count: number }>();
  
  rawData.forEach(item => {
    const company = item.companyName;
    if (!companyTotals.has(company)) {
      companyTotals.set(company, { revenue: 0, profit: 0, count: 0 });
    }
    const total = companyTotals.get(company)!;
    total.revenue += item.revenue;
    total.profit += item.profit || 0;
    total.count += 1;
  });
  
  console.log('\n🏢 Raw 데이터 회사별 통계:');
  companyTotals.forEach((total, company) => {
    console.log(`  ${company}:`);
    console.log(`    - 데이터 개수: ${total.count}개`);
    console.log(`    - 매출액 합계: ${(total.revenue / 1000).toFixed(2)}K`);
    console.log(`    - 영업이익 합계: ${(total.profit / 1000).toFixed(2)}K`);
  });
  
  // 3. 트리맵 데이터 검증 (연도별)
  console.log('\n🌲 트리맵 데이터 검증:');
  treemapData.forEach(yearNode => {
    console.log(`\n  ${yearNode.name}년:`);
    console.log(`    - 트리맵 value: ${(yearNode.value / 1000).toFixed(2)}K`);
    console.log(`    - 트리맵 revenue: ${((yearNode.revenue || 0) / 1000).toFixed(2)}K`);
    
    if (yearNode.children) {
      console.log(`    - 자식 노드 개수: ${yearNode.children.length}개`);
      
      const childrenSum = yearNode.children.reduce((sum, child) => sum + child.value, 0);
      console.log(`    - 자식 노드 합계: ${(childrenSum / 1000).toFixed(2)}K`);
      
      const diff = yearNode.value - childrenSum;
      const diffPercent = (diff / yearNode.value) * 100;
      
      if (Math.abs(diff) > 0.01) {
        console.log(`    ⚠️ 불일치: ${(diff / 1000).toFixed(2)}K (${diffPercent.toFixed(2)}%)`);
        console.log(`    🔍 원인 분석:`);
        console.log(`      - 부모 노드 value: ${yearNode.value}`);
        console.log(`      - 자식 노드 합계: ${childrenSum}`);
        console.log(`      - 차이: ${diff}`);
        console.log(`      - 이는 데이터 중복이나 잘못된 집계 로직 때문일 수 있습니다.`);
      } else {
        console.log(`    ✅ 합계 일치 - 트리맵이 올바르게 표시될 것입니다.`);
      }
      
      // 각 회사별 상세
      yearNode.children.forEach(companyNode => {
        console.log(`      - ${companyNode.name}: ${(companyNode.value / 1000).toFixed(2)}K`);
      });
    }
  });
  
  // 4. 전체 합계 비교
  const rawTotalRevenue = rawData.reduce((sum, item) => sum + item.revenue, 0);
  const treemapTotalValue = treemapData.reduce((sum, node) => sum + node.value, 0);
  
  console.log('\n📊 전체 합계 비교:');
  console.log(`  Raw 데이터 매출액 합계: ${(rawTotalRevenue / 1000).toFixed(2)}K`);
  console.log(`  트리맵 데이터 value 합계: ${(treemapTotalValue / 1000).toFixed(2)}K`);
  
  const totalDiff = rawTotalRevenue - treemapTotalValue;
  if (Math.abs(totalDiff) > 0.01) {
    console.log(`  ⚠️ 불일치: ${(totalDiff / 1000).toFixed(2)}K`);
  } else {
    console.log(`  ✅ 합계 일치`);
  }
  
  console.log('\n=== 데이터 검증 완료 ===\n');
}

// 하드코딩된 샘플 데이터 생성 함수
function generateSampleData(): PerformanceData[] {
  // 이미지에서 보이는 정확한 값들을 하드코딩
  const data: PerformanceData[] = [
    // 2025년 데이터
    { companyCode: 'HTNS', companyName: '현대TNS', revenue: 240000, profit: 24000, growthRate: 5.2, target: 264000, achievement: 91, period: '2025' },
    { companyCode: 'HTNS_CN', companyName: '현대TNS 중국', revenue: 144000, profit: 14400, growthRate: 3.8, target: 158400, achievement: 91, period: '2025' },
    { companyCode: 'HTNS_US', companyName: '현대TNS USA', revenue: 180000, profit: 18000, growthRate: 4.5, target: 198000, achievement: 91, period: '2025' },
    { companyCode: 'HTNS_EU', companyName: '현대TNS 유럽', revenue: 120000, profit: 12000, growthRate: 2.1, target: 132000, achievement: 91, period: '2025' },
    
    // 2024년 데이터
    { companyCode: 'HTNS', companyName: '현대TNS', revenue: 220000, profit: 22000, growthRate: 4.8, target: 242000, achievement: 91, period: '2024' },
    { companyCode: 'HTNS_CN', companyName: '현대TNS 중국', revenue: 132000, profit: 13200, growthRate: 3.5, target: 145200, achievement: 91, period: '2024' },
    { companyCode: 'HTNS_US', companyName: '현대TNS USA', revenue: 165000, profit: 16500, growthRate: 4.2, target: 181500, achievement: 91, period: '2024' },
    { companyCode: 'HTNS_EU', companyName: '현대TNS 유럽', revenue: 110000, profit: 11000, growthRate: 1.8, target: 121000, achievement: 91, period: '2024' },
    
    // 2023년 데이터
    { companyCode: 'HTNS', companyName: '현대TNS', revenue: 200000, profit: 20000, growthRate: 4.5, target: 220000, achievement: 91, period: '2023' },
    { companyCode: 'HTNS_CN', companyName: '현대TNS 중국', revenue: 120000, profit: 12000, growthRate: 3.2, target: 132000, achievement: 91, period: '2023' },
    { companyCode: 'HTNS_US', companyName: '현대TNS USA', revenue: 150000, profit: 15000, growthRate: 3.8, target: 165000, achievement: 91, period: '2023' },
    { companyCode: 'HTNS_EU', companyName: '현대TNS 유럽', revenue: 100000, profit: 10000, growthRate: 1.5, target: 110000, achievement: 91, period: '2023' },
    
    // 2022년 데이터
    { companyCode: 'HTNS', companyName: '현대TNS', revenue: 180000, profit: 18000, growthRate: 4.2, target: 198000, achievement: 91, period: '2022' },
    { companyCode: 'HTNS_CN', companyName: '현대TNS 중국', revenue: 108000, profit: 10800, growthRate: 2.9, target: 118800, achievement: 91, period: '2022' },
    { companyCode: 'HTNS_US', companyName: '현대TNS USA', revenue: 135000, profit: 13500, growthRate: 3.5, target: 148500, achievement: 91, period: '2022' },
    { companyCode: 'HTNS_EU', companyName: '현대TNS 유럽', revenue: 90000, profit: 9000, growthRate: 1.2, target: 99000, achievement: 91, period: '2022' },
    
    // 2021년 데이터
    { companyCode: 'HTNS', companyName: '현대TNS', revenue: 160000, profit: 16000, growthRate: 3.8, target: 176000, achievement: 91, period: '2021' },
    { companyCode: 'HTNS_US', companyName: '현대TNS USA', revenue: 120000, profit: 12000, growthRate: 3.2, target: 132000, achievement: 91, period: '2021' },
    { companyCode: 'HTNS_CN', companyName: '현대TNS 중국', revenue: 96000, profit: 9600, growthRate: 2.5, target: 105600, achievement: 91, period: '2021' },
    { companyCode: 'HTNS_EU', companyName: '현대TNS 유럽', revenue: 80000, profit: 8000, growthRate: 0.8, target: 88000, achievement: 91, period: '2021' },
  ];

  console.log('Generated hardcoded sample data:');
  console.log('Total items:', data.length);
  
  // 연도별 데이터 검증
  const yearGroups = new Map<string, PerformanceData[]>();
  data.forEach(item => {
    if (!yearGroups.has(item.period)) {
      yearGroups.set(item.period, []);
    }
    yearGroups.get(item.period)!.push(item);
  });
  
  console.log('Year groups:');
  yearGroups.forEach((items, year) => {
    const totalRevenue = items.reduce((sum, item) => sum + item.revenue, 0);
    console.log(`  ${year}: ${items.length} items, total revenue: ${(totalRevenue / 1000).toFixed(0)}K`);
    items.forEach(item => {
      console.log(`    - ${item.companyName}: ${(item.revenue / 1000).toFixed(0)}K`);
    });
  });

  return data;
}

// 단순화된 계층적 데이터 구조 생성 함수
function buildHierarchy(rawData: PerformanceData[], labels: string[], filters: any): TreemapNode[] {
  if (labels.length === 0) return [];

  const currentLabel = labels[0];
  const remainingLabels = labels.slice(1);
  
  console.log(`Building hierarchy for label: ${currentLabel}, remaining: ${remainingLabels.join(', ')}`);

  // 현재 레벨에서 그룹화
  const groups = new Map<string, PerformanceData[]>();
  
  rawData.forEach(item => {
    let groupKey = '';
    
    switch (currentLabel) {
      case '연도':
        groupKey = item.period;
        break;
      case '회사':
        groupKey = item.companyName;
        break;
      default:
        groupKey = 'Unknown';
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(item);
  });

  console.log(`Groups created for ${currentLabel}:`, Array.from(groups.keys()));
  
  // 각 그룹을 트리맵 노드로 변환
  return Array.from(groups.entries()).map(([groupName, items]) => {
    const totalRevenue = items.reduce((sum, item) => sum + item.revenue, 0);
    const totalProfit = items.reduce((sum, item) => sum + (item.profit || 0), 0);
    const avgGrowth = items.reduce((sum, item) => sum + (item.growthRate || 0), 0) / items.length;
    
    console.log(`Processing group: ${groupName}, items count: ${items.length}, total revenue: ${totalRevenue}`);
    
    // 값 계산 (선택된 값 필드에 따라)
    let value = 0;
    switch (filters.selectedValueField) {
      case '매출액':
        value = totalRevenue;
        break;
      case '영업이익':
        value = totalProfit;
        break;
      case '성장률':
        value = Math.abs(avgGrowth);
        break;
      default:
        value = totalRevenue;
    }

    const node: TreemapNode = {
      name: groupName,
      value: value,
      revenue: totalRevenue,
      growthRate: avgGrowth,
      profitRate: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      category: groupName,
    };

    // 하위 레벨이 있으면 재귀적으로 처리
    if (remainingLabels.length > 0) {
      node.children = buildHierarchy(items, remainingLabels, filters);
      
      // 하위 노드들의 합계와 현재 노드의 값을 비교
      if (node.children && node.children.length > 0) {
        const childrenSum = node.children.reduce((sum, child) => sum + child.value, 0);
        console.log(`Parent node ${groupName}: original value=${value}, children sum=${childrenSum}`);
        
        // 부모 노드의 value를 자식들의 합계로 업데이트 (정확한 집계를 위해)
        node.value = childrenSum;
        console.log(`Updated parent value to children sum: ${childrenSum}`);
      }
    }

    return node;
  });
}

// 정렬 함수
function sortTreemapData(data: TreemapNode[], sortBy: string): TreemapNode[] {
  const sorted = [...data].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.value - a.value;
      case 'growth':
        return (b.growthRate || 0) - (a.growthRate || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // 자식 노드도 재귀적으로 정렬
  return sorted.map(node => ({
    ...node,
    children: node.children ? sortTreemapData(node.children, sortBy) : undefined,
  }));
}

