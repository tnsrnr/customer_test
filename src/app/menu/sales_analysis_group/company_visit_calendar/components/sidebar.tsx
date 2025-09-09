'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Checkbox } from '@/common/components/ui/checkbox';
import { CalendarIcon, Users, TrendingUp, Target, Building2, User, Users2 } from 'lucide-react';
import { useSalesAnalysis2Store } from '../store';

// 부서명을 사용자 친화적으로 변환하는 함수
const formatDeptName = (deptName: string): string => {
  // 해상영업그룹 → 해상그룹
  if (deptName === '해상영업그룹') {
    return '해상그룹';
  }
  
  // 글로벌영업X팀 → 영업X팀
  if (deptName.startsWith('글로벌영업') && deptName.endsWith('팀')) {
    return deptName.replace('글로벌', '');
  }
  
  return deptName; // 기타 부서명은 그대로 유지
};

interface SidebarProps {
  events: any[];
}

const Sidebar: React.FC<SidebarProps> = ({ events }) => {
  const { filters, setDisplayMode, getFilteredEvents, selectedDate } = useSalesAnalysis2Store();
  
  // 필터링된 이벤트 가져오기
  const filteredEvents = getFilteredEvents();
  
  // 이벤트 통계 계산
  const totalEvents = events.length;
  const filteredEventsCount = filteredEvents.length;
  
  // 현재 선택된 달의 CUSA 건수 계산 (실제 영업 건수)
  const currentMonthCusaCount = events.filter(event => {
    const eventDate = new Date(event.start);
    const isCurrentMonth = eventDate.getMonth() === selectedDate.getMonth();
    const isCurrentYear = eventDate.getFullYear() === selectedDate.getFullYear();
    const isCusaType = event.extendedProps.titleType === 'CUSA';
    
    return isCurrentMonth && isCurrentYear && isCusaType;
  }).length;
  
  // 고우선순위 이벤트 수 (삼성 관련)
  const highPriorityEvents = filteredEvents.filter(event => 
    event.extendedProps.samsungYn === 'Y'
  ).length;

  // 이번 주 이벤트 수 계산
  const thisWeekEvents = events.filter(event => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return event.start >= weekStart && event.start <= weekEnd;
  }).length;

  // 이번 달 이벤트 수 계산
  const thisMonthEvents = events.filter(event => {
    const now = new Date();
    return event.start.getMonth() === now.getMonth() && 
           event.start.getFullYear() === now.getFullYear();
  }).length;

  // 현재 월의 부서별 건수 계산
  const currentMonthDeptCounts = events.filter(event => {
    const eventDate = new Date(event.start);
    const isCurrentMonth = eventDate.getMonth() === selectedDate.getMonth();
    const isCurrentYear = eventDate.getFullYear() === selectedDate.getFullYear();
    const isCusaType = event.extendedProps.titleType === 'CUSA'; // CUSA만 카운트
    
    return isCurrentMonth && isCurrentYear && isCusaType; // CUSA 타입만 필터링
  }).reduce((acc, event) => {
    const deptName = event.extendedProps.deptName || '미분류';
    acc[deptName] = (acc[deptName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 부서별 건수를 배열로 변환하여 정렬
  const sortedDeptCounts = Object.entries(currentMonthDeptCounts)
    .sort(([deptNameA], [deptNameB]) => {
      // 영업1팀, 영업2팀, 영업3팀 순서로 정렬
      if (deptNameA.startsWith('영업') && deptNameB.startsWith('영업')) {
        const numA = parseInt(deptNameA.match(/\d+/)?.[0] || '0');
        const numB = parseInt(deptNameB.match(/\d+/)?.[0] || '0');
        return numA - numB; // 1팀, 2팀, 3팀 순서
      }
      
      // 영업팀들을 먼저, 해상그룹을 나중에
      if (deptNameA.startsWith('영업')) return -1;
      if (deptNameB.startsWith('영업')) return 1;
      
      // 기타는 알파벳 순서
      return deptNameA.localeCompare(deptNameB);
    });

  // 오늘 이벤트 수 계산
  const todayEvents = events.filter(event => {
    const today = new Date();
    return event.start.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="h-full space-y-4 overflow-y-auto">
      {/* 표시 모드 카드 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">표시 모드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="both"
              checked={filters.displayMode === 'both'}
              onCheckedChange={() => setDisplayMode('both')}
            />
            <label htmlFor="both" className="text-sm flex items-center space-x-2">
              <Users2 className="h-4 w-4 text-purple-500" />
              <span>전체</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="customer"
              checked={filters.displayMode === 'customer'}
              onCheckedChange={() => setDisplayMode('customer')}
            />
            <label htmlFor="customer" className="text-sm flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span>화주</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sales"
              checked={filters.displayMode === 'sales'}
              onCheckedChange={() => setDisplayMode('sales')}
            />
            <label htmlFor="sales" className="text-sm flex items-center space-x-2">
              <User className="h-4 w-4 text-green-500" />
              <span>영업사원</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* 요약 카드 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-center">
            {selectedDate.getMonth() + 1}월 요약
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">전체영업</span>
            </div>
            <Badge variant="secondary">{currentMonthCusaCount}</Badge>
          </div>
          
          {/* 부서별 건수 표시 */}
          {sortedDeptCounts.map(([deptName, count]) => (
            <div key={deptName} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">{formatDeptName(deptName)}</span>
              </div>
              <Badge variant="secondary">{count as number}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
