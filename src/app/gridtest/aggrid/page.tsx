'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutGrid } from 'lucide-react';

export default function AgGridPage() {
  const examples = [
    { 
      title: 'AG Grid 샘플 1',
      description: '기본 출퇴근 데이터 테이블 및 통계 카드 예제',
      link: '/gridtest/aggrid/sample1',
      linkText: 'AG Grid 샘플 1 보기'
    },
    { 
      title: 'AG Grid 샘플 2',
      description: '사용자 정의 셀 렌더러 및 편집 기능이 포함된 예제',
      link: '/gridtest/aggrid/sample2',
      linkText: 'AG Grid 샘플 2 보기'
    },
    { 
      title: 'AG Grid 샘플 3',
      description: '고급 필터링 및 데이터 그룹화 기능이 포함된 예제',
      link: '/gridtest/aggrid/sample3',
      linkText: 'AG Grid 샘플 3 보기'
    }
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
          <h1 className="text-3xl font-bold">AG Grid 예제</h1>
          <p className="text-gray-500 mt-2">AG Grid의 다양한 기능과 사용법을 보여주는 예제 모음입니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutGrid className="h-5 w-5 mr-2 text-primary" />
                {example.title}
              </CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {example.title} 예제 페이지입니다.
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