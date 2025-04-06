'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Table2 } from 'lucide-react';

export default function HandsontablePage() {
  const examples = [
    { 
      title: 'Handsontable 샘플',
      description: '복사/붙여넣기를 지원하는 기본 테이블 예제',
      link: '/gridtest/handsontable/sample',
      linkText: 'Handsontable 샘플 보기'
    },
    { 
      title: 'Handsontable 샘플2',
      description: '기본 편집 및 데이터 유효성 검사 기능이 포함된 예제',
      link: '/gridtest/handsontable/sample2',
      linkText: 'Handsontable 샘플2 보기'
    },
    { 
      title: 'Handsontable 샘플3',
      description: '컨텍스트 메뉴 및 사용자 정의 렌더러 예제',
      link: '/gridtest/handsontable/sample3',
      linkText: 'Handsontable 샘플3 보기'
    },
    { 
      title: 'Handsontable 샘플4',
      description: '셀 병합 및 고정 기능이 포함된 예제',
      link: '/gridtest/handsontable/sample4',
      linkText: 'Handsontable 샘플4 보기'
    },
    { 
      title: 'Handsontable 샘플5',
      description: '헤더 이동 및 사용자 정의 도구모음 기능이 포함된 예제',
      link: '/gridtest/handsontable/sample5',
      linkText: 'Handsontable 샘플5 보기'
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
          <h1 className="text-3xl font-bold">Handsontable 예제</h1>
          <p className="text-gray-500 mt-2">Excel과 유사한 UI를 제공하는 Handsontable의 다양한 기능을 보여주는 예제 모음입니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Table2 className="h-5 w-5 mr-2 text-primary" />
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