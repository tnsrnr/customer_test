"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Save,
  Download,
  FileDown,
  Table,
  Grid,
  Info,
  ArrowLeft
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

// Handsontable 관련 임포트
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// 모든 Handsontable 모듈 등록
registerAllModules();

interface DepartmentSummary {
  department: string;
  totalEmployees: number;
  regularCount: number;
  regularRate: number;
  lateCount: number;
  lateRate: number;
  leaveEarlyCount: number;
  leaveEarlyRate: number;
  absentCount: number;
  absentRate: number;
  vacationCount: number;
  vacationRate: number;
}

export default function Handsontable2Page() {
  const [data, setData] = useState<any[]>([]);
  const hotTableRef = useRef<any>(null);
  
  // 더미 데이터 생성
  useEffect(() => {
    generateDummyData();
  }, []);
  
  const generateDummyData = () => {
    const departments = [
      "개발팀", "인사팀", "마케팅팀", "영업팀", "경영지원팀"
    ];
    
    const summaryData: DepartmentSummary[] = departments.map(dept => {
      const totalEmployees = Math.floor(Math.random() * 30) + 10;
      const regularCount = Math.floor(Math.random() * totalEmployees * 0.8);
      const lateCount = Math.floor(Math.random() * (totalEmployees - regularCount) * 0.4);
      const leaveEarlyCount = Math.floor(Math.random() * (totalEmployees - regularCount - lateCount) * 0.4);
      const absentCount = Math.floor(Math.random() * (totalEmployees - regularCount - lateCount - leaveEarlyCount) * 0.5);
      const vacationCount = totalEmployees - regularCount - lateCount - leaveEarlyCount - absentCount;
      
      return {
        department: dept,
        totalEmployees,
        regularCount,
        regularRate: parseFloat((regularCount / totalEmployees * 100).toFixed(1)),
        lateCount,
        lateRate: parseFloat((lateCount / totalEmployees * 100).toFixed(1)),
        leaveEarlyCount,
        leaveEarlyRate: parseFloat((leaveEarlyCount / totalEmployees * 100).toFixed(1)),
        absentCount,
        absentRate: parseFloat((absentCount / totalEmployees * 100).toFixed(1)),
        vacationCount,
        vacationRate: parseFloat((vacationCount / totalEmployees * 100).toFixed(1)),
      };
    });
    
    // 합계 행 추가
    const totals = summaryData.reduce((acc, curr) => {
      acc.totalEmployees += curr.totalEmployees;
      acc.regularCount += curr.regularCount;
      acc.lateCount += curr.lateCount;
      acc.leaveEarlyCount += curr.leaveEarlyCount;
      acc.absentCount += curr.absentCount;
      acc.vacationCount += curr.vacationCount;
      return acc;
    }, {
      department: '합계',
      totalEmployees: 0,
      regularCount: 0,
      regularRate: 0,
      lateCount: 0,
      lateRate: 0,
      leaveEarlyCount: 0,
      leaveEarlyRate: 0,
      absentCount: 0,
      absentRate: 0,
      vacationCount: 0,
      vacationRate: 0,
    });
    
    // 비율 재계산
    totals.regularRate = parseFloat((totals.regularCount / totals.totalEmployees * 100).toFixed(1));
    totals.lateRate = parseFloat((totals.lateCount / totals.totalEmployees * 100).toFixed(1));
    totals.leaveEarlyRate = parseFloat((totals.leaveEarlyCount / totals.totalEmployees * 100).toFixed(1));
    totals.absentRate = parseFloat((totals.absentCount / totals.totalEmployees * 100).toFixed(1));
    totals.vacationRate = parseFloat((totals.vacationCount / totals.totalEmployees * 100).toFixed(1));
    
    // 데이터 설정
    setData([...summaryData, totals]);
  };
  
  // 퍼센트 포맷터
  const percentRenderer = (instance: any, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: number, cellProperties: any) => {
    td.innerHTML = `${value}%`;
    
    // 80% 이상이면 녹색, 50-80%면 노란색, 50% 미만이면 빨간색
    if (prop === 'regularRate') {
      if (value >= 80) {
        td.className = 'bg-green-100 text-green-800';
      } else if (value >= 50) {
        td.className = 'bg-amber-100 text-amber-800';
      } else {
        td.className = 'bg-red-100 text-red-800';
      }
    }
    
    // 마지막 행(합계)인 경우 배경색 설정
    if (row === instance.countRows() - 1) {
      td.style.fontWeight = 'bold';
      td.style.backgroundColor = '#f8fafc';
    }
    
    return td;
  };
  
  // 숫자 포맷터
  const numericRenderer = (instance: any, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: number, cellProperties: any) => {
    td.innerHTML = value.toString();
    
    // 마지막 행(합계)인 경우 배경색 설정
    if (row === instance.countRows() - 1) {
      td.style.fontWeight = 'bold';
      td.style.backgroundColor = '#f8fafc';
    }
    
    return td;
  };
  
  // 부서명 포맷터
  const departmentRenderer = (instance: any, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: string, cellProperties: any) => {
    td.innerHTML = value;
    
    // 마지막 행(합계)인 경우 배경색 설정
    if (row === instance.countRows() - 1) {
      td.style.fontWeight = 'bold';
      td.style.backgroundColor = '#f8fafc';
    }
    
    return td;
  };
  
  // 중첩 헤더 설정
  const nestedHeaders = [
    [
      { label: '부서', colspan: 1 },
      { label: '총 인원', colspan: 1 },
      { label: '정상 출근', colspan: 2 },
      { label: '지각', colspan: 2 },
      { label: '조퇴', colspan: 2 },
      { label: '결근', colspan: 2 },
      { label: '휴가', colspan: 2 }
    ],
    [
      '',
      '',
      '인원',
      '비율 (%)',
      '인원',
      '비율 (%)',
      '인원',
      '비율 (%)',
      '인원',
      '비율 (%)',
      '인원',
      '비율 (%)',
    ]
  ];
  
  // 컬럼 정의
  const columns = [
    { data: 'department', title: '부서', renderer: departmentRenderer },
    { data: 'totalEmployees', title: '총 인원', type: 'numeric', renderer: numericRenderer },
    { data: 'regularCount', title: '정상 출근 인원', type: 'numeric', renderer: numericRenderer },
    { data: 'regularRate', title: '정상 출근 비율', type: 'numeric', numericFormat: { pattern: '0.0' }, renderer: percentRenderer },
    { data: 'lateCount', title: '지각 인원', type: 'numeric', renderer: numericRenderer },
    { data: 'lateRate', title: '지각 비율', type: 'numeric', numericFormat: { pattern: '0.0' }, renderer: percentRenderer },
    { data: 'leaveEarlyCount', title: '조퇴 인원', type: 'numeric', renderer: numericRenderer },
    { data: 'leaveEarlyRate', title: '조퇴 비율', type: 'numeric', numericFormat: { pattern: '0.0' }, renderer: percentRenderer },
    { data: 'absentCount', title: '결근 인원', type: 'numeric', renderer: numericRenderer },
    { data: 'absentRate', title: '결근 비율', type: 'numeric', numericFormat: { pattern: '0.0' }, renderer: percentRenderer },
    { data: 'vacationCount', title: '휴가 인원', type: 'numeric', renderer: numericRenderer },
    { data: 'vacationRate', title: '휴가 비율', type: 'numeric', numericFormat: { pattern: '0.0' }, renderer: percentRenderer },
  ];
  
  // 셀 병합 설정
  const mergeCells = [
    { row: data.length - 1, col: 0, rowspan: 1, colspan: 1 }
  ];
  
  // 테이블 설정
  const tableSettings = {
    licenseKey: 'non-commercial-and-evaluation',
    data: data,
    columns: columns,
    nestedHeaders: nestedHeaders,
    mergeCells: mergeCells,
    rowHeaders: true,
    columnSorting: false,
    readOnly: true,
    width: '100%',
    height: 400,
    manualColumnResize: true,
    fixedRowsTop: 0,
    fixedColumnsLeft: 2,
    stretchH: 'all' as 'all' | 'none' | 'last',
    className: 'htCenter',
  };
  
  // 엑셀 다운로드 기능
  const downloadExcel = () => {
    if (hotTableRef.current && hotTableRef.current.hotInstance) {
      const exportPlugin = hotTableRef.current.hotInstance.getPlugin('exportFile');
      exportPlugin.downloadFile('csv', {
        filename: '부서별_출결_현황',
        columnHeaders: true,
        rowHeaders: true,
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Handsontable 샘플2 - 데이터 유효성 검사</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/gridtest/handsontable">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={downloadExcel}>
            <FileDown className="h-4 w-4 mr-2" />
            엑셀 다운로드
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">부서별 출결 현황 분석</CardTitle>
          <div className="flex justify-end space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={generateDummyData}>
                    <Grid className="h-4 w-4 mr-2" />
                    데이터 재생성
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>새로운 랜덤 데이터를 생성합니다</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 bg-blue-50 p-3 rounded-md">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">이 샘플에서 구현된 기능:</p>
                <ul className="list-disc list-inside mt-1 ml-1">
                  <li>중첩 헤더(Nested Headers): 다단계 헤더 구성</li>
                  <li>조건부 서식(Conditional Formatting): 셀 값에 따른 색상 변경</li>
                  <li>고정 열(Fixed Columns): 처음 두 열 고정</li>
                  <li>셀 병합(Merged Cells): 특정 셀 병합</li>
                  <li>데이터 내보내기: CSV/엑셀 형식으로 내보내기</li>
                </ul>
              </div>
            </div>
          </div>
          
          <HotTable
            ref={hotTableRef}
            settings={tableSettings}
          />
        </CardContent>
      </Card>
    </div>
  );
} 