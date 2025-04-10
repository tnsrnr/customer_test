'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun, Smartphone, Tablet, Laptop, Move, DownloadCloud } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { Switch } from '@/components/ui/switch';
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Label } from '@/components/ui/label';
import "tabulator-tables/dist/css/tabulator.min.css";

interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: string;
  status: string;
  dueDate: string;
  completion: number;
  description: string;
}

// ToggleGroup 컴포넌트 (ShadCN에서 제공하지 않으므로 직접 구현)
interface ToggleGroupProps {
  type: "single" | "multiple";
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ 
  type, 
  value, 
  onValueChange, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            pressed: child.props.value === value,
            onClick: () => onValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

const ToggleGroupItem = Toggle;

export default function TabulatorResponsiveExample() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentLayout, setCurrentLayout] = useState<string>("desktop");
  const [responsiveMode, setResponsiveMode] = useState<string>("responsive");
  
  // 샘플 데이터
  const data: Task[] = [
    { id: 1, title: "웹사이트 리디자인", assignee: "김진우", priority: "높음", status: "진행중", dueDate: "2023-12-20", completion: 65, description: "회사 웹사이트의 모든 페이지 디자인 업데이트" },
    { id: 2, title: "모바일 앱 개발", assignee: "이미영", priority: "높음", status: "진행중", dueDate: "2024-01-15", completion: 40, description: "iOS 및 안드로이드용 모바일 앱 개발" },
    { id: 3, title: "사용자 테스트 진행", assignee: "박성훈", priority: "중간", status: "대기중", dueDate: "2023-12-05", completion: 0, description: "새 기능에 대한 사용자 테스트 진행 및 피드백 수집" },
    { id: 4, title: "SEO 최적화", assignee: "정다희", priority: "낮음", status: "완료", dueDate: "2023-11-25", completion: 100, description: "검색 엔진 최적화를 위한 메타 태그 및 콘텐츠 업데이트" },
    { id: 5, title: "보안 감사", assignee: "최재혁", priority: "높음", status: "대기중", dueDate: "2023-12-10", completion: 0, description: "웹사이트 및 서버 보안 취약점 검사" },
    { id: 6, title: "콘텐츠 업데이트", assignee: "김진우", priority: "중간", status: "진행중", dueDate: "2023-12-15", completion: 30, description: "블로그 및 제품 설명 페이지 콘텐츠 업데이트" },
    { id: 7, title: "데이터베이스 마이그레이션", assignee: "이미영", priority: "높음", status: "진행중", dueDate: "2023-12-22", completion: 50, description: "레거시 데이터베이스에서 새 구조로 데이터 마이그레이션" },
    { id: 8, title: "이메일 뉴스레터 설정", assignee: "정다희", priority: "낮음", status: "완료", dueDate: "2023-11-18", completion: 100, description: "월간 뉴스레터 템플릿 및 구독자 목록 설정" },
    { id: 9, title: "분석 대시보드 개발", assignee: "박성훈", priority: "중간", status: "진행중", dueDate: "2024-01-05", completion: 25, description: "사용자 행동 및 전환 분석을 위한 대시보드 개발" },
    { id: 10, title: "API 통합", assignee: "최재혁", priority: "높음", status: "대기중", dueDate: "2023-12-30", completion: 0, description: "결제 및 배송 서비스 API 통합" },
  ];

  // 초기 테이블 설정
  useEffect(() => {
    let table: Tabulator | null = null;
    let initialized = false;
    
    const init = () => {
      if (!tableRef.current) return;
      
      try {
        // 테이블 초기화
        table = new Tabulator(tableRef.current, {
          data: data,
          layout: "fitColumns",
          pagination: true,
          paginationSize: 5,
          movableColumns: true,
          tooltips: true,
          columns: getColumns(),
          initialSort: [
            { column: "dueDate", dir: "asc" }
          ],
          rowFormatter: function(row) {
            // 완료된 작업은 회색으로 표시
            const data = row.getData();
            const element = row.getElement();
            
            if (data.status === "완료") {
              element.style.backgroundColor = darkMode ? "#1f2937" : "#f3f4f6";
              element.style.color = darkMode ? "#9ca3af" : "#6b7280";
            } else {
              element.style.backgroundColor = "";
              element.style.color = "";
            }
          },
        });
        
        // 테이블 완전히 렌더링 후 상태 업데이트
        table.on("tableBuilt", function() {
          setTabulator(table);
          initialized = true;
        });
        
      } catch (error) {
        console.error("테이블 초기화 오류:", error);
      }
    };
    
    // 테이블 초기화
    init();
    
    return () => {
      if (table) {
        table.destroy();
      }
    };
  }, []);

  // 테마 및 레이아웃 변경 감지
  useEffect(() => {
    if (!tabulator) return;
    
    const applyChanges = () => {
      try {
        applyTheme();
        applyLayout();
      } catch (error) {
        console.error("테마/레이아웃 적용 오류:", error);
      }
    };
    
    // DOM이 렌더링된 후에만 변경사항 적용
    const timer = setTimeout(applyChanges, 200);
    
    return () => {
      clearTimeout(timer);
    };
  }, [darkMode, currentLayout, responsiveMode, tabulator]);

  // 컬럼 설정
  const getColumns = () => {
    return [
      { 
        title: "ID", 
        field: "id", 
        sorter: "number", 
        width: 60, 
        headerSort: true,
        responsive: 0
      },
      { 
        title: "제목", 
        field: "title", 
        sorter: "string",
        formatter: function(cell, formatterParams, onRendered) {
          const value = cell.getValue();
          const data = cell.getRow().getData();
          const status = data.status;
          
          let statusColor = "";
          if (status === "완료") statusColor = "text-green-600";
          else if (status === "진행중") statusColor = "text-blue-600";
          else statusColor = "text-amber-600";
          
          return `<div>${value}</div><div class="text-xs ${statusColor} mt-1">${status}</div>`;
        },
        tooltip: function(cell) {
          return cell.getRow().getData().description;
        },
        responsive: 0
      },
      { 
        title: "담당자", 
        field: "assignee", 
        sorter: "string",
        responsive: 2
      },
      { 
        title: "우선순위", 
        field: "priority", 
        sorter: "string",
        formatter: function(cell) {
          const value = cell.getValue();
          let className = "";
          
          if (value === "높음") className = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
          else if (value === "중간") className = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
          else className = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
          
          return `<span class="px-2 py-1 rounded-full text-xs font-medium ${className}">${value}</span>`;
        },
        responsive: 1
      },
      { 
        title: "상태", 
        field: "status", 
        sorter: "string",
        formatter: function(cell) {
          const value = cell.getValue();
          let className = "";
          
          if (value === "완료") className = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
          else if (value === "진행중") className = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
          else className = "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
          
          return `<span class="px-2 py-1 rounded-full text-xs font-medium ${className}">${value}</span>`;
        },
        responsive: 1
      },
      { 
        title: "마감일", 
        field: "dueDate", 
        sorter: "date",
        formatter: function(cell) {
          const value = cell.getValue();
          const dueDate = new Date(value);
          const today = new Date();
          const isOverdue = dueDate < today && cell.getRow().getData().status !== "완료";
          
          const formattedDate = new Date(value).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          return isOverdue ? 
            `<span class="text-red-600 font-medium">${formattedDate}</span>` : 
            formattedDate;
        },
        responsive: 2
      },
      { 
        title: "진행률", 
        field: "completion", 
        sorter: "number",
        formatter: function(cell) {
          const value = cell.getValue();
          
          // 진행률 바 만들기
          const barColor = value === 100 ? 
            "bg-green-500 dark:bg-green-600" : 
            "bg-blue-500 dark:bg-blue-600";
          
          const textColor = value === 100 ? 
            "text-green-800 dark:text-green-200" : 
            "text-blue-800 dark:text-blue-200";
          
          return `
            <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div class="h-2 ${barColor} rounded-full" style="width: ${value}%"></div>
            </div>
            <div class="text-center text-xs mt-1 ${textColor}">${value}%</div>
          `;
        },
        responsive: 3
      },
    ];
  };
  
  // 테마 적용
  const applyTheme = () => {
    if (!tableRef.current || !tabulator) return;
    
    const element = tableRef.current;
    
    if (darkMode) {
      // 다크 모드 적용
      element.classList.add('tabulator-dark');
      element.querySelectorAll('.tabulator').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '#1f2937';
        (el as HTMLElement).style.color = '#e5e7eb';
        (el as HTMLElement).style.border = '1px solid #374151';
      });
      
      element.querySelectorAll('.tabulator-header').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '#111827';
        (el as HTMLElement).style.borderBottom = '2px solid #374151';
      });
      
      element.querySelectorAll('.tabulator-footer').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '#111827';
        (el as HTMLElement).style.borderTop = '1px solid #374151';
      });
      
      element.querySelectorAll('.tabulator-cell').forEach(el => {
        (el as HTMLElement).style.borderRight = '1px solid #374151';
      });
      
      element.querySelectorAll('.tabulator-page').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '#374151';
        (el as HTMLElement).style.color = '#e5e7eb';
      });
      
      element.querySelectorAll('.tabulator-page.active').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '#4f46e5';
        (el as HTMLElement).style.color = '#ffffff';
      });
    } else {
      // 라이트 모드 적용
      element.classList.remove('tabulator-dark');
      element.querySelectorAll('.tabulator').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '';
        (el as HTMLElement).style.color = '';
        (el as HTMLElement).style.border = '';
      });
      
      element.querySelectorAll('.tabulator-header, .tabulator-footer').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '';
        (el as HTMLElement).style.borderBottom = '';
        (el as HTMLElement).style.borderTop = '';
      });
      
      element.querySelectorAll('.tabulator-cell').forEach(el => {
        (el as HTMLElement).style.borderRight = '';
      });
      
      element.querySelectorAll('.tabulator-page').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '';
        (el as HTMLElement).style.color = '';
      });
      
      element.querySelectorAll('.tabulator-page.active').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '';
        (el as HTMLElement).style.color = '';
      });
    }
    
    // 테이블 다시 그리기 - requestAnimationFrame 사용
    if (tabulator) {
      try {
        requestAnimationFrame(() => {
          if (tabulator && document.body.contains(tableRef.current)) {
            tabulator.redraw(false); // 완전히 다시 그리지 않고 업데이트만
          }
        });
      } catch (err) {
        console.error("테이블 다시 그리기 오류:", err);
      }
    }
  };
  
  // 레이아웃 적용
  const applyLayout = () => {
    if (!tabulator || !tableRef.current || !document.body.contains(tableRef.current)) return;
    
    try {
      if (responsiveMode === "responsive") {
        // 반응형 레이아웃 적용
        let cols: any;
        
        switch(currentLayout) {
          case "mobile":
            // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
            tabulator.setHeight("400px");
            cols = getColumns().filter(col => col.responsive <= 0);
            break;
          case "tablet":
            // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
            tabulator.setHeight("500px");
            cols = getColumns().filter(col => col.responsive <= 1);
            break;
          case "laptop":
            // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
            tabulator.setHeight("600px");
            cols = getColumns().filter(col => col.responsive <= 2);
            break;
          default:
            // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
            tabulator.setHeight();
            cols = getColumns();
        }
        
        tabulator.setColumns(cols);
      } else {
        // 전체 컬럼 표시
        tabulator.setColumns(getColumns());
        
        // 디바이스별 레이아웃 설정
        switch(currentLayout) {
          case "mobile":
            // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
            tabulator.setHeight("400px");
            tabulator.setData(data.slice(0, 3));
            break;
          case "tablet":
            // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
            tabulator.setHeight("500px");
            tabulator.setData(data.slice(0, 5));
            break;
          case "laptop":
            // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
            tabulator.setHeight("600px");
            tabulator.setData(data.slice(0, 8));
            break;
          default:
            // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
            tabulator.setHeight();
            tabulator.setData(data);
        }
      }
      
      // 테이블 다시 그리기 - requestAnimationFrame 사용
      requestAnimationFrame(() => {
        if (tabulator && document.body.contains(tableRef.current)) {
          tabulator.redraw(false); // 완전히 다시 그리지 않고 업데이트만
        }
      });
    } catch (err) {
      console.error("레이아웃 적용 오류:", err);
    }
  };

  // PDF 내보내기
  const exportPDF = () => {
    tabulator?.download("pdf", "tasks_data.pdf", {
      orientation: "portrait",
      title: "업무 목록",
    });
  };

  // Excel 내보내기
  const exportExcel = () => {
    tabulator?.download("xlsx", "tasks_data.xlsx");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">반응형 레이아웃 및 테마</h1>
          <p className="text-gray-500 mt-1">다양한 화면 크기와 테마에 맞춤화된 Tabulator 예제입니다.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6 md:items-center mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Label htmlFor="dark-mode">다크 모드</Label>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-gray-500" />
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Moon className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <Separator className="hidden md:block h-6" orientation="vertical" />
              <div>
                <Label className="mb-2 block">화면 크기</Label>
                <ToggleGroup type="single" value={currentLayout} onValueChange={(value) => value && setCurrentLayout(value)}>
                  <ToggleGroupItem value="mobile" aria-label="모바일">
                    <Smartphone className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="tablet" aria-label="태블릿">
                    <Tablet className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="laptop" aria-label="노트북">
                    <Laptop className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="desktop" aria-label="데스크탑">
                    <Move className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <Separator className="hidden md:block h-6" orientation="vertical" />
              <div>
                <Label className="mb-2 block">대응 모드</Label>
                <ToggleGroup type="single" value={responsiveMode} onValueChange={(value) => value && setResponsiveMode(value)}>
                  <ToggleGroupItem value="responsive" aria-label="반응형">
                    컬럼 조정
                  </ToggleGroupItem>
                  <ToggleGroupItem value="preview" aria-label="미리보기">
                    데이터 제한
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportPDF}>
                <DownloadCloud className="h-4 w-4 mr-2" />
                PDF 내보내기
              </Button>
              <Button variant="outline" onClick={exportExcel}>
                <DownloadCloud className="h-4 w-4 mr-2" />
                Excel 내보내기
              </Button>
            </div>
          </div>

          <div ref={tableRef} className={`w-full ${darkMode ? 'dark' : ''}`}></div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-gray-500 mb-4">
        <p>* 이 예제에서는 다양한 화면 크기와 테마에 맞게 테이블 레이아웃이 조정됩니다.</p>
        <p>* 반응형 모드에서는 화면 크기에 따라 표시되는 열이 달라지며, 미리보기 모드에서는 데이터 수가 제한됩니다.</p>
        <p>* 열 헤더를 드래그하여 열 순서를 변경할 수 있습니다.</p>
      </div>
    </div>
  );
} 