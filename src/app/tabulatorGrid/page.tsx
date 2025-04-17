'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table2 } from "lucide-react";
import Link from "next/link";

export default function GridTestPage() {
  const gridOptions = [
    {
      title: "Tabulator",
      description: "인터랙티브 테이블을 쉽게 생성할 수 있는 JavaScript 라이브러리",
      icon: <Table2 className="h-12 w-12 text-primary" />,
      href: "/tabulatorGrid"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tabulator 그리드 테스트</h1>
        <p className="text-muted-foreground">Tabulator 데이터 그리드 라이브러리 테스트</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gridOptions.map((option, index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-4">
                {option.icon}
                <CardTitle>{option.title}</CardTitle>
              </div>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                클릭하여 {option.title} 예제를 확인하세요.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={option.href}>예제 보기</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 