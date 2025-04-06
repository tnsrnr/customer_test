import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">관리자 관리</h1>
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>사용자 관리</CardTitle>
            <CardDescription>시스템 사용자 계정 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>사용자 목록</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>권한 관리</CardTitle>
            <CardDescription>사용자 권한 및 역할 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>권한 설정</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 