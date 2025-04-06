'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Download } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "tabulator-tables/dist/css/tabulator.min.css";

interface SalesData {
  id: number;
  product: string;
  category: string;
  region: string;
  year: number;
  quarter: number;
  month: string;
  sales: number;
  units: number;
  profit: number;
}

export default function TabulatorVisualizationExample() {
  const tableRef = useRef<HTMLDivElement>(null);
  const chartTableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [chartTabulator, setChartTabulator] = useState<Tabulator | null>(null);
  const [groupByField, setGroupByField] = useState<string>("category");
  const [aggregateType, setAggregateType] = useState<string>("sum");
  const [valueField, setValueField] = useState<string>("sales");
  const [selectedTab, setSelectedTab] = useState<string>("table");

  // 샘플 데이터
  const data: SalesData[] = [
    { id: 1, product: "노트북", category: "전자기기", region: "서울", year: 2023, quarter: 1, month: "1월", sales: 15000000, units: 10, profit: 3000000 },
    { id: 2, product: "스마트폰", category: "전자기기", region: "부산", year: 2023, quarter: 1, month: "1월", sales: 8500000, units: 17, profit: 2550000 },
    { id: 3, product: "모니터", category: "전자기기", region: "대구", year: 2023, quarter: 1, month: "2월", sales: 4200000, units: 14, profit: 840000 },
    { id: 4, product: "키보드", category: "주변기기", region: "인천", year: 2023, quarter: 1, month: "2월", sales: 1200000, units: 30, profit: 480000 },
    { id: 5, product: "마우스", category: "주변기기", region: "광주", year: 2023, quarter: 1, month: "3월", sales: 800000, units: 40, profit: 400000 },
    { id: 6, product: "이어폰", category: "주변기기", region: "대전", year: 2023, quarter: 1, month: "3월", sales: 2500000, units: 25, profit: 1000000 },
    { id: 7, product: "노트북", category: "전자기기", region: "서울", year: 2023, quarter: 2, month: "4월", sales: 18000000, units: 12, profit: 3600000 },
    { id: 8, product: "스마트폰", category: "전자기기", region: "부산", year: 2023, quarter: 2, month: "4월", sales: 9500000, units: 19, profit: 2850000 },
    { id: 9, product: "태블릿", category: "전자기기", region: "대구", year: 2023, quarter: 2, month: "5월", sales: 6800000, units: 8, profit: 1700000 },
    { id: 10, product: "프린터", category: "사무기기", region: "인천", year: 2023, quarter: 2, month: "5월", sales: 3200000, units: 4, profit: 640000 },
    { id: 11, product: "스캐너", category: "사무기기", region: "광주", year: 2023, quarter: 2, month: "6월", sales: 1800000, units: 3, profit: 360000 },
    { id: 12, product: "복사기", category: "사무기기", region: "대전", year: 2023, quarter: 2, month: "6월", sales: 5500000, units: 2, profit: 1100000 },
    { id: 13, product: "노트북", category: "전자기기", region: "서울", year: 2023, quarter: 3, month: "7월", sales: 16500000, units: 11, profit: 3300000 },
    { id: 14, product: "스마트폰", category: "전자기기", region: "부산", year: 2023, quarter: 3, month: "7월", sales: 9000000, units: 18, profit: 2700000 },
    { id: 15, product: "태블릿", category: "전자기기", region: "대구", year: 2023, quarter: 3, month: "8월", sales: 7200000, units: 9, profit: 1800000 },
    { id: 16, product: "키보드", category: "주변기기", region: "인천", year: 2023, quarter: 3, month: "8월", sales: 1500000, units: 35, profit: 600000 },
    { id: 17, product: "마우스", category: "주변기기", region: "광주", year: 2023, quarter: 3, month: "9월", sales: 900000, units: 45, profit: 450000 },
    { id: 18, product: "이어폰", category: "주변기기", region: "대전", year: 2023, quarter: 3, month: "9월", sales: 3000000, units: 30, profit: 1200000 },
    { id: 19, product: "노트북", category: "전자기기", region: "서울", year: 2023, quarter: 4, month: "10월", sales: 19500000, units: 13, profit: 3900000 },
    { id: 20, product: "스마트폰", category: "전자기기", region: "부산", year: 2023, quarter: 4, month: "10월", sales: 10000000, units: 20, profit: 3000000 },
    { id: 21, product: "모니터", category: "전자기기", region: "대구", year: 2023, quarter: 4, month: "11월", sales: 4800000, units: 16, profit: 960000 },
    { id: 22, product: "프린터", category: "사무기기", region: "인천", year: 2023, quarter: 4, month: "11월", sales: 3800000, units: 5, profit: 760000 },
    { id: 23, product: "스캐너", category: "사무기기", region: "광주", year: 2023, quarter: 4, month: "12월", sales: 2100000, units: 4, profit: 420000 },
    { id: 24, product: "복사기", category: "사무기기", region: "대전", year: 2023, quarter: 4, month: "12월", sales: 6200000, units: 3, profit: 1240000 },
  ];

  useEffect(() => {
    if (tableRef.current) {
      // 메인 테이블 초기화
      const table = new Tabulator(tableRef.current, {
        data: data,
        layout: "fitColumns",
        pagination: true,
        paginationSize: 10,
        columns: [
          { title: "ID", field: "id", sorter: "number", width: 60 },
          { title: "제품", field: "product", sorter: "string", headerFilter: "input" },
          { title: "카테고리", field: "category", sorter: "string", headerFilter: "list", headerFilterParams: { values: true } },
          { title: "지역", field: "region", sorter: "string", headerFilter: "list", headerFilterParams: { values: true } },
          { title: "연도", field: "year", sorter: "number" },
          { title: "분기", field: "quarter", sorter: "number" },
          { title: "월", field: "month", sorter: "string" },
          { 
            title: "매출액", 
            field: "sales", 
            sorter: "number",
            formatter: "money",
            formatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            },
            bottomCalc: "sum",
            bottomCalcFormatter: "money",
            bottomCalcFormatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            }
          },
          { 
            title: "판매량", 
            field: "units", 
            sorter: "number",
            bottomCalc: "sum"
          },
          { 
            title: "이익", 
            field: "profit", 
            sorter: "number",
            formatter: "money",
            formatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            },
            bottomCalc: "sum",
            bottomCalcFormatter: "money",
            bottomCalcFormatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            }
          },
        ],
        initialSort: [
          { column: "id", dir: "asc" }
        ],
      });
      
      setTabulator(table);
    }
    
    return () => {
      tabulator?.destroy();
    };
  }, []);

  // 차트 데이터 업데이트
  useEffect(() => {
    if(selectedTab === "chart" && chartTableRef.current) {
      // 기존 차트 테이블 제거
      if(chartTabulator) {
        chartTabulator.destroy();
      }
      
      // 집계 함수 설정
      const getAggregateFunction = () => {
        switch (aggregateType) {
          case "sum": return "sum";
          case "avg": return "avg";
          case "count": return "count";
          case "max": return "max";
          case "min": return "min";
          default: return "sum";
        }
      };
      
      // 집계 타이틀 설정
      const getAggregateTitle = () => {
        const fieldTitle = valueField === "sales" ? "매출액" : valueField === "units" ? "판매량" : "이익";
        const aggTitle = aggregateType === "sum" ? "합계" : 
                        aggregateType === "avg" ? "평균" : 
                        aggregateType === "count" ? "개수" : 
                        aggregateType === "max" ? "최대값" : "최소값";
        
        return `${fieldTitle} ${aggTitle}`;
      };
      
      // 필드 타이틀 설정
      const getFieldTitle = () => {
        return groupByField === "category" ? "카테고리" : 
               groupByField === "region" ? "지역" : 
               groupByField === "quarter" ? "분기" : 
               groupByField === "month" ? "월" : 
               groupByField === "product" ? "제품" : "연도";
      };
      
      // 집계 데이터 생성
      interface AggregatedItem {
        [key: string]: string | number;
      }
      
      const aggregatedData: AggregatedItem[] = [];
      const grouped: Record<string, SalesData[]> = {};
      
      // 그룹화
      data.forEach(item => {
        const groupValue = String(item[groupByField]);
        if (!grouped[groupValue]) {
          grouped[groupValue] = [];
        }
        grouped[groupValue].push(item);
      });
      
      // 집계 계산
      for (const group in grouped) {
        let aggregateValue = 0;
        
        if (aggregateType === "sum") {
          aggregateValue = grouped[group].reduce((sum, item) => {
            const value = Number(item[valueField as keyof SalesData]);
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
        } else if (aggregateType === "avg") {
          aggregateValue = grouped[group].reduce((sum, item) => {
            const value = Number(item[valueField as keyof SalesData]);
            return sum + (isNaN(value) ? 0 : value);
          }, 0) / grouped[group].length;
        } else if (aggregateType === "count") {
          aggregateValue = grouped[group].length;
        } else if (aggregateType === "max") {
          aggregateValue = Math.max(...grouped[group].map(item => {
            const value = Number(item[valueField as keyof SalesData]);
            return isNaN(value) ? 0 : value;
          }));
        } else if (aggregateType === "min") {
          aggregateValue = Math.min(...grouped[group].map(item => {
            const value = Number(item[valueField as keyof SalesData]);
            return isNaN(value) ? 0 : value;
          }));
        }
        
        aggregatedData.push({
          [groupByField]: group,
          [valueField]: aggregateValue
        });
      }
      
      // 차트 테이블 생성
      const chartTable = new Tabulator(chartTableRef.current, {
        layout: "fitColumns",
        columns: [
          { title: getFieldTitle(), field: groupByField, sorter: "string" },
          { 
            title: getAggregateTitle(), 
            field: valueField, 
            sorter: "number",
            formatter: valueField === "units" ? "plaintext" : "money",
            formatterParams: valueField === "units" ? {} : {
              thousand: ",",
              symbol: "₩",
              precision: 0
            }
          },
        ],
        dataTree: true,
        dataTreeStartExpanded: true,
        groupBy: groupByField,
        groupHeader: function(value, count, data, group) {
          const fieldValue = valueField === "sales" ? "sales" : valueField === "units" ? "units" : "profit";
          let sum = 0;
          
          data.forEach((item: any) => {
            sum += item[fieldValue];
          });
          
          const formattedSum = valueField === "units" 
            ? sum 
            : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(sum);
            
          return `${value} <span style="color:#666;">(${count} 항목)</span> <span style="color:#333; font-weight:bold;">합계: ${formattedSum}</span>`;
        },
      });
      
      // 차트 데이터 설정
      chartTable.setData(aggregatedData);
      
      // 차트 생성 - 직접 DOM 조작 대신 리렌더링 후 처리
      setTimeout(() => {
        // 테이블이 완전히 렌더링된 후에 차트 바 추가
        const rows = chartTableRef.current?.querySelectorAll<HTMLElement>('.tabulator-row');
        const values = aggregatedData.map(item => item[valueField] as number);
        
        // 최대값 찾기 (비율 계산용)
        const maxValue = Math.max(...values);
        
        // 각 행의 셀에 차트 바 추가
        if (rows) {
          rows.forEach((row, i) => {
            const cell = row.querySelector(`.tabulator-cell[tabulator-field="${valueField}"]`);
            if (cell && i < values.length) {
              const value = values[i];
              const barWidth = Math.round((value / maxValue) * 100);
              
              const barElement = document.createElement("div");
              barElement.style.height = "12px";
              barElement.style.width = `${barWidth}%`;
              barElement.style.backgroundColor = "#4f46e5";
              barElement.style.marginTop = "5px";
              barElement.style.borderRadius = "2px";
              
              cell.appendChild(barElement);
            }
          });
        }
      }, 100);
      
      setChartTabulator(chartTable);
    }
  }, [selectedTab, groupByField, aggregateType, valueField, data]);

  // CSV 다운로드
  const downloadCSV = () => {
    tabulator?.download("csv", "sales_data.csv", { delimiter: "," });
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
          <h1 className="text-2xl font-bold">데이터 시각화 및 집계</h1>
          <p className="text-gray-500 mt-1">다양한 집계 및 차트 기능을 갖춘 Tabulator 예제입니다.</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <Tabs defaultValue="table" value={selectedTab} onValueChange={setSelectedTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="table">데이터 테이블</TabsTrigger>
                <TabsTrigger value="chart">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  집계 및 차트
                </TabsTrigger>
              </TabsList>
              
              <Button variant="outline" onClick={downloadCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV 다운로드
              </Button>
            </div>
            
            <TabsContent value="table" className="border-none p-0">
              <div ref={tableRef} className="w-full"></div>
            </TabsContent>
            
            <TabsContent value="chart" className="border-none p-0">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">그룹화 기준</label>
                  <Select value={groupByField} onValueChange={setGroupByField}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="category">카테고리</SelectItem>
                      <SelectItem value="region">지역</SelectItem>
                      <SelectItem value="product">제품</SelectItem>
                      <SelectItem value="quarter">분기</SelectItem>
                      <SelectItem value="month">월</SelectItem>
                      <SelectItem value="year">연도</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">집계 유형</label>
                  <Select value={aggregateType} onValueChange={setAggregateType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sum">합계</SelectItem>
                      <SelectItem value="avg">평균</SelectItem>
                      <SelectItem value="count">개수</SelectItem>
                      <SelectItem value="max">최대값</SelectItem>
                      <SelectItem value="min">최소값</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">집계 필드</label>
                  <Select value={valueField} onValueChange={setValueField}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">매출액</SelectItem>
                      <SelectItem value="units">판매량</SelectItem>
                      <SelectItem value="profit">이익</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div ref={chartTableRef} className="w-full"></div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-sm text-gray-500 mb-4">
        <p>* 데이터 테이블에서는 열 헤더를 클릭하여 정렬하거나 필터링할 수 있습니다.</p>
        <p>* 차트 탭에서는 다양한 방식으로 데이터를 집계하고 시각화할 수 있습니다.</p>
      </div>
    </div>
  );
} 