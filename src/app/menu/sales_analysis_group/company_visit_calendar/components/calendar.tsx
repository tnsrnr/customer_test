'use client';

import React, { useState, useCallback, memo, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';

// ShadCN Components
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader } from '@/common/components/ui/card';

// Lucide Icons
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Grid,
  List
} from 'lucide-react';

// Store
import { useSalesAnalysis2Store } from '../store';

// Styles
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Types
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  isLoading?: boolean;
}

// Locale 설정
const locales = {
  'ko': ko,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent: React.FC<CalendarProps> = memo(({ events, onEventClick, isLoading = false }) => {
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  
  // Store에서 필요한 상태만 가져오기
  const { 
    selectedDate, 
    fetchCalendarData,
    setSelectedDate 
  } = useSalesAnalysis2Store();

  // 이전/다음 월 이동
  const goToPrevious = useCallback(() => {
    const newDate = new Date(selectedDate);
    if (view === 'month') {
      newDate.setMonth(selectedDate.getMonth() - 1);
      setSelectedDate(newDate);
      // API 호출 (백그라운드에서 병렬 처리)
      fetchCalendarData(newDate);
    } else if (view === 'week') {
      newDate.setDate(selectedDate.getDate() - 7);
      setSelectedDate(newDate);
    } else if (view === 'day') {
      newDate.setDate(selectedDate.getDate() - 1);
      setSelectedDate(newDate);
    }
  }, [selectedDate, view, fetchCalendarData, setSelectedDate]);

  const goToNext = useCallback(() => {
    const newDate = new Date(selectedDate);
    if (view === 'month') {
      newDate.setMonth(selectedDate.getMonth() + 1);
      setSelectedDate(newDate);
      // API 호출 (백그라운드에서 병렬 처리)
      fetchCalendarData(newDate);
    } else if (view === 'week') {
      newDate.setDate(selectedDate.getDate() + 7);
      setSelectedDate(newDate);
    } else if (view === 'day') {
      newDate.setDate(selectedDate.getDate() + 1);
      setSelectedDate(newDate);
    }
  }, [selectedDate, view, fetchCalendarData, setSelectedDate]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    fetchCalendarData(today);
  }, [setSelectedDate, fetchCalendarData]);

  // 현재 날짜 표시 포맷
  const currentDateDisplay = useMemo(() => {
    if (view === 'month') {
      return `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월`;
    } else if (view === 'week') {
      const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const endOfWeekDate = new Date(startOfWeekDate);
      endOfWeekDate.setDate(startOfWeekDate.getDate() + 6);
      return `${startOfWeekDate.getMonth() + 1}월 ${startOfWeekDate.getDate()}일 - ${endOfWeekDate.getMonth() + 1}월 ${endOfWeekDate.getDate()}일`;
    } else if (view === 'day') {
      return `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;
    }
    return selectedDate.toLocaleDateString('ko-KR');
  }, [selectedDate, view]);

  // 뷰 변경 핸들러
  const handleViewChange = useCallback((newView: 'month' | 'week' | 'day' | 'agenda') => {
    setView(newView);
  }, []);

  // 이벤트 클릭 핸들러
  const handleEventClick = useCallback((event: CalendarEvent) => {
    if (onEventClick) {
      onEventClick(event);
    }
  }, [onEventClick]);

  // 날짜 변경 핸들러
  const handleNavigate = useCallback((newDate: Date) => {
    setSelectedDate(newDate);
  }, [setSelectedDate]);

  // 이벤트 스타일 설정
  const eventPropGetter = useCallback((event: CalendarEvent) => ({
    style: {
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      color: event.textColor,
      borderRadius: '6px',
      border: 'none',
      padding: '2px 6px',
      fontSize: '12px',
      fontWeight: '500',
    },
  }), []);

  // 메시지 설정
  const messages = useMemo(() => ({
    noEventsInRange: '이 기간에 일정이 없습니다.',
    today: '오늘',
    previous: '이전',
    next: '다음',
    month: '월',
    week: '주',
    day: '일',
    agenda: '목록',
    date: '날짜',
    time: '시간',
    event: '이벤트',
    allDay: '종일',
    yesterday: '어제',
    tomorrow: '내일',
    showMore: (total: number) => `+${total}개 더보기`,
  }), []);

  // 뷰 설정
  const views = useMemo(() => ({
    month: true,
    week: true,
    day: true,
    agenda: true,
  }), []);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={isLoading} // 로딩 중에는 버튼 비활성화
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentDateDisplay}
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={isLoading} // 로딩 중에는 버튼 비활성화
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              disabled={isLoading} // 로딩 중에는 버튼 비활성화
            >
              오늘
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('month')}
                className="h-5 px-1.5 text-xs"
              >
                <Grid className="h-3 w-3 mr-1" />
                월간
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('week')}
                className="h-5 px-1.5 text-xs"
              >
                <CalendarIcon className="h-3 w-3 mr-1" />
                주간
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('day')}
                className="h-5 px-1.5 text-xs"
              >
                <CalendarIcon className="h-3 w-3 mr-1" />
                일간
              </Button>
              <Button
                variant={view === 'agenda' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('agenda')}
                className="h-5 px-1.5 text-xs"
              >
                <List className="h-3 w-3 mr-1" />
                목록
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-[calc(100vh-200px)] relative">
          {/* 달력은 항상 표시 (로딩 상태와 관계없이) */}
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            view={view}
            onView={handleViewChange}
            date={selectedDate}
            onNavigate={handleNavigate}
            onSelectEvent={handleEventClick}
            selectable
            popup
            selectMirror
            step={60}
            timeslots={1}
            defaultView="month"
            toolbar={false}
            views={views}
            messages={messages}
            eventPropGetter={eventPropGetter}
          />
          
          {/* 로딩 오버레이 - 달력 위에만 표시 */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10 transition-opacity duration-300">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">데이터 로딩 중...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

CalendarComponent.displayName = 'CalendarComponent';

export default CalendarComponent;
