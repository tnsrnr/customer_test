'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Table2, SortAsc, FileSearch, Edit3, PieChart, Smartphone } from 'lucide-react';

export default function TabulatorPage() {
  const examples = [
    { 
      title: '기본 테이블 및 정렬',
      description: '기본 테이블 레이아웃과 열 정렬 기능이 포함된 예제',
      link: '/gridtest/tabulator/sample1',
      linkText: '예제 보기',
      icon: <SortAsc className="h-5 w-5 mr-2 text-primary" />
    },
    { 
      title: '필터링 및 검색',
      description: '검색 및 필터링 기능이 포함된 강력한 데이터 테이블',
      link: '/gridtest/tabulator/sample2',
      linkText: '예제 보기',
      icon: <FileSearch className="h-5 w-5 mr-2 text-primary" />
    },
    { 
      title: '편집 가능한 테이블',
      description: '셀 편집 및 행 추가/삭제 기능이 포함된 인터랙티브 테이블',
      link: '/gridtest/tabulator/sample3',
      linkText: '예제 보기',
      icon: <Edit3 className="h-5 w-5 mr-2 text-primary" />
    },
    { 
      title: '데이터 시각화 및 집계',
      description: '데이터 집계 및 차트 기능을 갖춘 고급 분석 테이블',
      link: '/gridtest/tabulator/sample4',
      linkText: '예제 보기',
      icon: <PieChart className="h-5 w-5 mr-2 text-primary" />
    },
    { 
      title: '반응형 레이아웃 및 테마',
      description: '다양한 화면 크기와 테마에 맞춤화된 반응형 테이블',
      link: '/gridtest/tabulator/sample5',
      linkText: '예제 보기',
      icon: <Smartphone className="h-5 w-5 mr-2 text-primary" />
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Tabulator 예제</h1>
          <p className="text-gray-500 mt-2">인터랙티브한 테이블 기능을 제공하는 Tabulator의 다양한 기능을 보여주는 예제입니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                {example.icon || <Table2 className="h-5 w-5 mr-2 text-primary" />}
                {example.title}
              </CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {example.title} 예제 페이지입니다. 이 예제에서는 Tabulator의 {example.description.toLowerCase()}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={example.link}>{example.linkText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 