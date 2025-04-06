'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Table2 } from 'lucide-react';

export default function TabulatorPage() {
  const examples = [
    { 
      title: 'Tabulator 샘플',
      description: '기본 테이블 및 데이터 조작 기능이 포함된 예제',
      link: '/gridtest/tabulator/sample',
      linkText: 'Tabulator 샘플 보기'
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
          <h1 className="text-3xl font-bold">Tabulator 예제</h1>
          <p className="text-gray-500 mt-2">인터랙티브한 테이블 기능을 제공하는 Tabulator의 다양한 기능을 보여주는 예제입니다.</p>
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