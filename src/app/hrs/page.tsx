import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HrsPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">인사 관리</h1>
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>직원 관리</CardTitle>
            <CardDescription>직원 정보 및 인사 기록 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>직원 목록</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>부서 관리</CardTitle>
            <CardDescription>조직 구조 및 부서 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>부서 구조</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>근태 관리</CardTitle>
            <CardDescription>근무 시간 및 휴가 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>근태 현황</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>급여 관리</CardTitle>
            <CardDescription>급여 및 수당 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>급여 관리</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 