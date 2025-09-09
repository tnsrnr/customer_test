'use client';

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { CalendarIcon, MapPin, Users, User, Building2 } from 'lucide-react';
import { useSalesAnalysis2Store } from '../store';
import { CalendarEvent } from '../types';

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose, onEdit, onDelete }) => {
  const { 
    visitDetail, 
    visitDetailLoading, 
    visitDetailError, 
    fetchVisitDetail, 
    clearVisitDetail 
  } = useSalesAnalysis2Store();

  // 모달이 열릴 때 방문 상세 데이터 가져오기
  useEffect(() => {
    if (isOpen && event) {
      console.log('Event data:', event);
      console.log('Extended props:', event.extendedProps);
      
      if (event.extendedProps && event.extendedProps.seqNo) {
        console.log('Fetching visit detail for seqNo:', event.extendedProps.seqNo);
        
        // 추가 파라미터들 준비 (올바른 매핑 적용)
        const additionalParams = {
          customerCode: event.extendedProps.customerCode,
          companyCode: event.extendedProps.companyCode,  // SEARCH_COMPANY_CODE로 매핑
          deptName: event.extendedProps.deptName,
          deptCode: event.extendedProps.deptCode,
          salesName: event.extendedProps.salesName,
          salesId: event.extendedProps.salesId,
          customerName: event.extendedProps.customerName,
          hashtag: event.extendedProps.hashtag,
          startDate: event.extendedProps.startDate,      // VISIT_DATE_FROM으로 매핑
          endDate: event.extendedProps.endDate,          // VISIT_DATE_TO로 매핑
        };
        
        console.log('Additional params for API call:', additionalParams);
        
        // seqNo와 추가 파라미터들을 함께 전달하여 방문 상세 데이터 조회
        fetchVisitDetail(event.extendedProps.seqNo.toString(), additionalParams);
      } else {
        console.warn('seqNo not found in event.extendedProps');
      }
    }
    
    // 모달이 닫힐 때 방문 상세 데이터 클리어
    return () => {
      if (!isOpen) {
        clearVisitDetail();
      }
    };
  }, [isOpen, event, fetchVisitDetail, clearVisitDetail]);

  if (!event) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}/${month}/${day}`;
  };

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return '-';
    return dateTimeStr.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1/$2/$3');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">

        {visitDetailLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">방문 정보를 불러오는 중...</span>
          </div>
        )}

        {visitDetailError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-red-600">오류: {visitDetailError}</p>
          </div>
        )}

        {visitDetail && (
          <div className="space-y-2">
            {/* 헤더 정보 - 2x3 그리드 (간격 최소화) */}
            <div className="p-2 bg-white border border-gray-200 rounded-lg">
              <div className="grid grid-cols-3 gap-2">
                {/* 첫 번째 줄 */}
                <div className="flex items-center space-x-1 p-1.5 bg-gray-50 border border-gray-200 rounded">
                  <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">거래처:</span>
                  <span className="text-sm text-gray-900 truncate" title={visitDetail.CUSTOMER_NAME}>
                    {visitDetail.CUSTOMER_NAME}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 p-1.5 bg-gray-50 border border-gray-200 rounded">
                  <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">지역/장소:</span>
                  <span className="text-sm text-gray-900 truncate" title={visitDetail.VISIT_PLACE}>
                    {visitDetail.VISIT_PLACE}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 p-1.5 bg-gray-50 border border-gray-200 rounded">
                  <User className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">영업담당자:</span>
                  <span className="text-sm text-gray-900 truncate" title={visitDetail.SALES_NAME}>
                    {visitDetail.SALES_NAME}
                  </span>
                </div>
                
                {/* 두 번째 줄 */}
                <div className="flex items-center space-x-1 p-1.5 bg-gray-50 border border-gray-200 rounded">
                  <Users className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">참석자:</span>
                  <span className="text-sm text-gray-900 truncate" title={`${visitDetail.CUSTOMER_STAFF}, ${visitDetail.SALES_STAFF}`}>
                    {visitDetail.CUSTOMER_STAFF}, {visitDetail.SALES_STAFF}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 p-1.5 bg-gray-50 border border-gray-200 rounded">
                  <CalendarIcon className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">방문일자:</span>
                  <span className="text-sm text-gray-900 truncate" title={formatDate(visitDetail.VISIT_DATE)}>
                    {formatDate(visitDetail.VISIT_DATE)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 p-1.5 bg-gray-50 border border-gray-200 rounded">
                  <CalendarIcon className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">방문타입:</span>
                  <span className="text-sm text-gray-900 truncate" title={visitDetail.REGULAR_FLAG_NAME}>
                    {visitDetail.REGULAR_FLAG_NAME}
                  </span>
                </div>
              </div>
            </div>

            {/* 협의사항 (간격 최소화) */}
            <div className="flex">
              <div className="w-20 flex-shrink-0">
                <div className="bg-gray-100 p-1.5 rounded-l border border-gray-300 border-r-0 h-full flex items-center justify-center">
                  <h3 className="text-sm font-medium text-gray-700">협의사항</h3>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 p-1.5 rounded-r border border-gray-300 h-full flex items-center">
                  <p className="text-sm text-gray-700">{visitDetail.VISIT_TITLE}</p>
                </div>
              </div>
            </div>

            {/* 회의(방문) 내용 (간격 최소화) */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-1 pt-2 px-2">
                <CardTitle className="text-lg font-semibold">회의(방문) 내용</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-2">
                <div className="bg-gray-50 p-2 rounded">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {visitDetail.VISIT_CONTENTS}
                  </pre>
                </div>
              </CardContent>
            </Card>

          </div>
        )}

        {!visitDetail && !visitDetailLoading && !visitDetailError && (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">
              {event && event.extendedProps && event.extendedProps.seqNo 
                ? "방문 상세 정보를 찾을 수 없습니다."
                : "방문 정보의 식별자가 없어 상세 정보를 불러올 수 없습니다."
              }
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
