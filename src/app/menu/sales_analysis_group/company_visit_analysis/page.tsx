'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Calendar, Building2, Target } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';

// Store & Types
import { useCompanyVisitAnalysisStore } from './store';

// Components
import AnalysisTable from './components/analysis_table';

export default function CompanyVisitAnalysisPage() {
  // Store에서 상태와 액션 가져오기
  const {
    tableData,
    loading,
    error,
    filters,
    stats,
    monthlyStats,
    fetchAnalysisData,
    setYear,
    setBusinessUnitFilter,
    setCategoryFilter,
  } = useCompanyVisitAnalysisStore();

  // 로컬 상태
  const [selectedYear, setSelectedYear] = useState<number>(filters.year);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<string>(filters.businessUnit || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || '');

  // 옵션 생성
  const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const businessUnitOptions = ['전체', '글로벌영업1사업부', '글로벌영업2사업부', '글로벌영업3사업부'];
  const categoryOptions = ['전체', '방문이력', '견적', '계약'];

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    fetchAnalysisData(selectedYear);
  };

  // 필터 변경 핸들러들
  const handleYearChange = (year: string) => {
    const yearNum = parseInt(year);
    setSelectedYear(yearNum);
    setYear(yearNum);
  };

  const handleBusinessUnitChange = (businessUnit: string) => {
    setSelectedBusinessUnit(businessUnit);
    setBusinessUnitFilter(businessUnit === '전체' ? '' : businessUnit);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCategoryFilter(category === '전체' ? '' : category);
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchAnalysisData(selectedYear);
  }, []);

  // 로딩 상태일 때만 로딩 화면 표시
  if (loading && tableData.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-lg text-gray-600">업체방문분석 데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 에러 상태일 때만 에러 화면 표시
  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <Button onClick={handleSearch} className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>다시 시도</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 컨트롤 영역 - 강화된 UI */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-b-2 border-gray-600 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          {/* 좌측: 검색 조건들 */}
          <div className="flex items-center space-x-6">
            {/* 기준년도 */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white whitespace-nowrap">기준년도</span>
              <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-32 h-8 text-sm bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 사업부 필터 */}
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white whitespace-nowrap">사업부</span>
              <Select value={selectedBusinessUnit} onValueChange={handleBusinessUnitChange}>
                <SelectTrigger className="w-40 h-8 text-sm bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {businessUnitOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 분류 필터 */}
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white whitespace-nowrap">분류</span>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-32 h-8 text-sm bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 우측: 조회 버튼 */}
          <Button 
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center space-x-2 h-9 px-6 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>조회</span>
          </Button>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 - 그리드만 표시 */}
      <div className="p-4">
        <AnalysisTable 
          tableData={tableData}
          stats={stats}
          monthlyStats={monthlyStats}
          loading={loading}
        />
      </div>
    </div>
  );
}