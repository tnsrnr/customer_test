'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DepartmentsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">부서 관리</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          새 부서 추가
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>개발팀</CardTitle>
            <CardDescription>소프트웨어 개발 및 유지보수</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">직원 수: 15명</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>인사팀</CardTitle>
            <CardDescription>인사 관리 및 채용</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">직원 수: 8명</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>마케팅팀</CardTitle>
            <CardDescription>마케팅 및 홍보</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">직원 수: 10명</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 