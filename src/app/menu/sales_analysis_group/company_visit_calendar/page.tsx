'use client';

import React, { useEffect, useMemo, memo } from 'react';

// Components
import Sidebar from './components/sidebar';
import CalendarComponent from './components/calendar';
import EventModal from './components/event_modal';

// Store
import { useSalesAnalysis2Store } from './store';
import { CalendarEvent } from './types';

// 메인 페이지 컴포넌트를 memo로 최적화
const SalesAnalysis2Page = memo(() => {
  const {
    events,
    loading,
    error,
    selectedDate,
    selectedEvent,
    showEventModal,
    fetchCalendarData,
    setSelectedEvent,
    setShowEventModal,
    getFilteredEvents
  } = useSalesAnalysis2Store();

  // 필터링된 이벤트 가져오기
  const filteredEvents = getFilteredEvents();

  // 컴포넌트 마운트 시 데이터 로드 (1회만)
  useEffect(() => {
    fetchCalendarData(selectedDate);
  }, []); // 빈 의존성 배열로 1회만 실행

  // 이벤트 클릭 핸들러 - useMemo로 최적화
  const handleEventClick = useMemo(() => (event: CalendarEvent) => {
    console.log('이벤트 클릭됨:', event);
    console.log('이벤트 extendedProps:', event?.extendedProps);
    console.log('seqNo:', event?.extendedProps?.seqNo);
    setSelectedEvent(event);
    setShowEventModal(true);
  }, [setSelectedEvent, setShowEventModal]);

  // 모달 닫기 핸들러 - useMemo로 최적화
  const handleCloseModal = useMemo(() => () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  }, [setShowEventModal, setSelectedEvent]);

  // 이벤트 수정 핸들러 - useMemo로 최적화
  const handleEditEvent = useMemo(() => (event: any) => {
    console.log('이벤트 수정:', event);
    // 여기에 이벤트 수정 로직을 추가할 수 있습니다
  }, []);

  // 이벤트 삭제 핸들러 - useMemo로 최적화
  const handleDeleteEvent = useMemo(() => (eventId: string) => {
    console.log('이벤트 삭제:', eventId);
    // 여기에 이벤트 삭제 로직을 추가할 수 있습니다
  }, []);

  // 에러 상태만 표시 (전체 로딩은 제거)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">데이터 로드 오류</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchCalendarData(selectedDate)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 메인 콘텐츠 - 달력은 항상 표시하고 로딩 상태만 전달
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="h-screen flex gap-4">
        {/* 사이드바와 달력을 1:9 비율로 조정 */}
        <div className="w-[10%] min-w-[180px]">
          <Sidebar events={events} />
        </div>
        
        <div className="w-[90%] flex-1">
          {/* 달력은 항상 표시하고 로딩 상태만 전달 */}
          <CalendarComponent 
            events={filteredEvents} // 필터링된 이벤트 전달
            onEventClick={handleEventClick}
            isLoading={loading} // 로딩 상태 전달
          />
        </div>
      </div>

      {/* 이벤트 상세 모달 */}
      <EventModal
        event={selectedEvent}
        isOpen={showEventModal}
        onClose={handleCloseModal}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
});

SalesAnalysis2Page.displayName = 'SalesAnalysis2Page';

export default SalesAnalysis2Page;
