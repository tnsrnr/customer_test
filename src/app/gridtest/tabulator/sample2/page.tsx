'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import "tabulator-tables/dist/css/tabulator.min.css";

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  startDate: string;
  salary: number;
  status: string;
}

export default function TabulatorFilteringExample() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');

  // 샘플 데이터
  const data: Employee[] = [
    { id: 1, name: "김철수", position: "선임 개발자", department: "개발팀", email: "kim@example.com", startDate: "2019-05-12", salary: 5000000, status: "재직" },
    { id: 2, name: "이영희", position: "마케팅 매니저", department: "마케팅", email: "lee@example.com", startDate: "2020-03-15", salary: 4800000, status: "재직" },
    { id: 3, name: "박준호", position: "인사 담당자", department: "인사팀", email: "park@example.com", startDate: "2018-01-10", salary: 6200000, status: "휴직" },
    { id: 4, name: "정미영", position: "백엔드 개발자", department: "개발팀", email: "jung@example.com", startDate: "2020-11-20", salary: 5500000, status: "재직" },
    { id: 5, name: "강동원", position: "콘텐츠 제작자", department: "마케팅", email: "kang@example.com", startDate: "2021-07-05", salary: 4200000, status: "재직" },
    { id: 6, name: "한지민", position: "재무 분석가", department: "재무팀", email: "han@example.com", startDate: "2019-09-22", salary: 5900000, status: "재직" },
    { id: 7, name: "오세진", position: "프론트엔드 개발자", department: "개발팀", email: "oh@example.com", startDate: "2020-08-15", salary: 5100000, status: "퇴사" },
    { id: 8, name: "홍길동", position: "이사", department: "경영진", email: "hong@example.com", startDate: "2017-03-18", salary: 8000000, status: "재직" },
    { id: 9, name: "최수진", position: "UI/UX 디자이너", department: "디자인팀", email: "choi@example.com", startDate: "2021-02-10", salary: 4500000, status: "재직" },
    { id: 10, name: "윤태호", position: "데이터 분석가", department: "개발팀", email: "yoon@example.com", startDate: "2020-04-05", salary: 5300000, status: "재직" },
    { id: 11, name: "장서연", position: "고객 지원 담당자", department: "고객지원팀", email: "jang@example.com", startDate: "2021-10-15", salary: 3800000, status: "재직" },
    { id: 12, name: "임현우", position: "네트워크 관리자", department: "개발팀", email: "lim@example.com", startDate: "2019-11-20", salary: 5200000, status: "휴직" },
  ];

  // 부서 목록 추출
  const departments = Array.from(new Set(data.map(item => item.department)));

  useEffect(() => {
    if (tableRef.current) {
      // 테이블 초기화
      const table = new Tabulator(tableRef.current, {
        data: data,
        layout: "fitColumns",
        pagination: true,
        paginationSize: 5,
        columns: [
          { title: "ID", field: "id", sorter: "number", width: 70 },
          { title: "이름", field: "name", sorter: "string" },
          { title: "직책", field: "position", sorter: "string" },
          { title: "부서", field: "department", sorter: "string" },
          { title: "이메일", field: "email", sorter: "string" },
          { title: "입사일", field: "startDate", sorter: "date" },
          { 
            title: "급여", 
            field: "salary", 
            sorter: "number",
            formatter: "money",
            formatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            }
          },
          { 
            title: "상태", 
            field: "status", 
            sorter: "string",
            formatter: function(cell) {
              const value = cell.getValue();
              let color = "";
              
              if(value === "재직") color = "bg-green-100 text-green-800";
              else if(value === "휴직") color = "bg-yellow-100 text-yellow-800";
              else if(value === "퇴사") color = "bg-red-100 text-red-800";
              
              return `<span class="px-2 py-1 rounded-full text-xs font-medium ${color}">${value}</span>`;
            }
          },
        ],
      });
      
      setTabulator(table);
    }
    
    return () => {
      tabulator?.destroy();
    };
  }, []);

  // 검색 처리
  const handleSearch = () => {
    if (tabulator) {
      tabulator.clearFilter();
      
      if (searchValue) {
        tabulator.setFilter([
          { field: "name", type: "like", value: searchValue },
          { field: "position", type: "like", value: searchValue },
          { field: "email", type: "like", value: searchValue },
        ]);
      }
      
      if (departmentFilter) {
        tabulator.addFilter("department", "=", departmentFilter);
      }
    }
  };

  // 필터 초기화
  const handleClearFilters = () => {
    setSearchValue('');
    setDepartmentFilter('');
    tabulator?.clearFilter();
  };

  // 부서 필터 변경 처리
  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    
    if(tabulator) {
      tabulator.clearFilter();
      
      if (value) {
        tabulator.setFilter("department", "=", value);
      }
      
      if (searchValue) {
        // 각 필드에 대해 개별적으로 필터 적용
        tabulator.addFilter("name", "like", searchValue);
        tabulator.addFilter("position", "like", searchValue);
        tabulator.addFilter("email", "like", searchValue);
      }
    }
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
          <h1 className="text-2xl font-bold">필터링 및 검색</h1>
          <p className="text-gray-500 mt-1">검색 및 필터링 기능을 갖춘 Tabulator 예제입니다.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="이름, 직책 또는 이메일로 검색..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={departmentFilter} onValueChange={handleDepartmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 부서</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch}>검색</Button>
              <Button variant="outline" onClick={handleClearFilters}>초기화</Button>
            </div>
          </div>
          
          <div ref={tableRef} className="w-full"></div>
        </CardContent>
      </Card>
    </div>
  );
} 