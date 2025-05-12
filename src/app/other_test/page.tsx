'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, FileStack, LineChart, ClipboardCheck, Sun, Upload, Repeat, ArrowDownUp, Table2 } from 'lucide-react';

export default function OtherTestPage() {
  const testOptions = [
    {
      title: '토스트 메시지 데모',
      description: '다양한 형태의 알림 토스트 메시지 데모',
      icon: <Bell className="h-10 w-10 text-primary" />,
      link: '/other_test/toast-demo',
      linkText: '토스트 데모 보기'
    },
    {
      title: '다이얼로그/모달 데모',
      description: '다양한 용도의 다이얼로그 및 모달 창 예제',
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      link: '/other_test/dialog-demo',
      linkText: '다이얼로그 데모 보기'
    },
    {
      title: '폼 밸리데이션 데모',
      description: '사용자 입력 유효성 검사 및 폼 관리 예제',
      icon: <ClipboardCheck className="h-10 w-10 text-primary" />,
      link: '/other_test/form-validation',
      linkText: '폼 밸리데이션 데모 보기'
    },
    {
      title: '데이터 필터링 데모',
      description: '데이터 검색, 필터링, 정렬 기능 예제',
      icon: <FileStack className="h-10 w-10 text-primary" />,
      link: '/other_test/data-filter',
      linkText: '데이터 필터링 데모 보기'
    },
    {
      title: '스켈레톤 UI 데모',
      description: '로딩 상태 표시를 위한 스켈레톤 UI 예제',
      icon: <LineChart className="h-10 w-10 text-primary" />,
      link: '/other_test/skeleton-demo',
      linkText: '스켈레톤 UI 데모 보기'
    },
    {
      title: '테마 전환 데모',
      description: '라이트/다크 모드 테마 전환 기능 예제',
      icon: <Sun className="h-10 w-10 text-primary" />,
      link: '/other_test/theme-toggle',
      linkText: '테마 전환 데모 보기'
    },
    {
      title: '드래그 앤 드롭 업로드',
      description: '파일을 끌어다 놓는 방식의 업로드 인터페이스',
      icon: <Upload className="h-10 w-10 text-primary" />,
      link: '/other_test/drag-drop-upload',
      linkText: '드래그 앤 드롭 데모 보기',
      isNew: true
    },
    {
      title: '무한 스크롤 데모',
      description: '스크롤에 따라 데이터를 지속적으로 로드하는 예제',
      icon: <Repeat className="h-10 w-10 text-primary" />,
      link: '/other_test/infinite-scroll',
      linkText: '무한 스크롤 데모 보기',
      isNew: true
    },
    {
      title: '멀티스텝 폼 마법사',
      description: '여러 단계로 진행되는 복잡한 폼 입력 마법사',
      icon: <ArrowDownUp className="h-10 w-10 text-primary" />,
      link: '/other_test/multi-step-form',
      linkText: '멀티스텝 폼 데모 보기',
      isNew: true
    },
    { 
      title: 'Tabulator',
      description: '인터랙티브 테이블을 쉽게 생성할 수 있는 Tabulator 예제 모음',
      icon: <Table2 className="h-10 w-10 text-primary" />,
      link: '/tabulatorGrid',
      linkText: 'Tabulator 예제 보기'
    }
    // 여기에 향후 다른 테스트 기능들을 추가할 수 있습니다
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">각종 테스트 기능</h1>
        <p className="text-gray-500 mt-2">다양한 UI 컴포넌트와 기능의 테스트 페이지입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testOptions.map((option, index) => (
          <Card key={`test-option-${index}`} className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4">
              {option.icon}
              <div className="flex-1">
                <div className="flex items-center">
                  <CardTitle>{option.title}</CardTitle>
                  {option.isNew && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <CardDescription>{option.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                클릭하여 {option.title}를 확인하세요.
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