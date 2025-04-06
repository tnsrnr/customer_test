import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ComPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">공통 관리</h1>
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>공통 코드 관리</CardTitle>
            <CardDescription>시스템 공통 코드 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>코드 그룹 관리</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>시스템 설정</CardTitle>
            <CardDescription>시스템 전반적인 설정 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>설정 관리</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 