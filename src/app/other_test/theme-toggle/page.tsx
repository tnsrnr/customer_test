'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggleDemo() {
  // 클라이언트 컴포넌트에서 hydration 문제 방지
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 컴포넌트가 마운트된 후에만 UI 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  // 테마 변경 예시 컨텐츠
  const demoContent = [
    { 
      title: '기본 카드', 
      description: '테마에 따라 스타일이 변경되는 기본 카드' 
    },
    { 
      title: '강조 컨텐츠', 
      description: '강조 색상으로 표시되는 컨텐츠 영역'
    },
    { 
      title: '중요 알림', 
      description: '사용자 주의를 끌기 위한 알림 영역'
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/other_test">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">테마 전환 데모</h1>
          <p className="text-muted-foreground mt-1">라이트 모드와 다크 모드 간의 테마 전환 예시</p>
        </div>
      </div>

      {mounted && (
        <>
          <div className="flex flex-col mb-8 space-y-4">
            <div className="flex items-center space-x-4 justify-start">
              <Button 
                variant={theme === 'light' ? 'default' : 'outline'} 
                onClick={() => setTheme('light')}
                size="sm"
              >
                <Sun className="h-4 w-4 mr-2" />
                라이트 모드
              </Button>
              
              <Button 
                variant={theme === 'dark' ? 'default' : 'outline'} 
                onClick={() => setTheme('dark')}
                size="sm"
              >
                <Moon className="h-4 w-4 mr-2" />
                다크 모드
              </Button>
              
              <Button 
                variant={theme === 'system' ? 'default' : 'outline'} 
                onClick={() => setTheme('system')}
                size="sm"
              >
                <Monitor className="h-4 w-4 mr-2" />
                시스템 설정
              </Button>
            </div>
            
            <div className="mt-2 text-sm text-muted-foreground">
              현재 테마: <span className="font-semibold">{theme === 'system' ? '시스템 설정' : theme === 'dark' ? '다크 모드' : '라이트 모드'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {demoContent.map((content, index) => (
              <Card key={index} className="transition-colors duration-300">
                <CardHeader>
                  <CardTitle>{content.title}</CardTitle>
                  <CardDescription>{content.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 rounded-md border flex items-center justify-center">
                    <p className="text-center text-muted-foreground">테마에 따라 변경되는 색상</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" className="mr-2">취소</Button>
                  <Button>확인</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="code">코드 예시</TabsTrigger>
              <TabsTrigger value="setup">설정 방법</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="p-4 border rounded-md">
              <pre className="text-sm overflow-auto p-4 bg-secondary">
                {`// 1. next-themes 설치
npm install next-themes

// 2. 테마 공급자 추가 (layout.tsx)
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// 3. 컴포넌트에서 사용
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}`}
              </pre>
            </TabsContent>
            <TabsContent value="setup" className="p-4 border rounded-md">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">1. 필요한 패키지 설치</h3>
                  <p className="text-muted-foreground">Next.js 프로젝트에 next-themes 패키지를 설치합니다:</p>
                  <code className="block p-2 mt-2 bg-secondary rounded">npm install next-themes</code>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">2. Tailwind CSS 설정</h3>
                  <p className="text-muted-foreground">tailwind.config.js 파일에 다크모드 설정을 추가합니다:</p>
                  <code className="block p-2 mt-2 bg-secondary rounded">
                    darkMode: ["class"]
                  </code>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">3. ThemeProvider 추가</h3>
                  <p className="text-muted-foreground">루트 레이아웃(layout.tsx)에 ThemeProvider 추가:</p>
                  <code className="block p-2 mt-2 bg-secondary rounded">
                    {`import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`}
                  </code>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
} 