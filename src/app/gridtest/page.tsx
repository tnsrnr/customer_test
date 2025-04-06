'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { LayoutGrid, Table2 } from 'lucide-react';

export default function GridTest() {
  const gridOptions = [
    { 
      title: 'AG Grid',
      description: 'JavaScript 데이터 그리드 컴포넌트 AG Grid 예제 모음',
      icon: <LayoutGrid className="h-10 w-10 text-primary" />,
      link: '/gridtest/aggrid',
      linkText: 'AG Grid 예제 보기'
    },
    { 
      title: 'Handsontable',
      description: 'Excel과 유사한 인터페이스를 제공하는 Handsontable 예제 모음',
      icon: <Table2 className="h-10 w-10 text-primary" />,
      link: '/gridtest/handsontable',
      linkText: 'Handsontable 예제 보기'
    },
    { 
      title: 'Tabulator',
      description: '인터랙티브 테이블을 쉽게 생성할 수 있는 Tabulator 예제 모음',
      icon: <Table2 className="h-10 w-10 text-primary" />,
      link: '/gridtest/tabulator',
      linkText: 'Tabulator 예제 보기'
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">그리드 테스트</h1>
        <p className="text-gray-500 mt-2">다양한 자바스크립트 그리드 라이브러리 테스트 페이지입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gridOptions.map((option, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4">
              {option.icon}
              <div>
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                클릭하여 {option.title} 예제를 확인하세요.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={option.link}>{option.linkText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 