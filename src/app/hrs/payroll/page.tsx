'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';

export default function PayrollPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">급여 관리</h1>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          급여 지급
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 급여</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩450,000,000</div>
            <p className="text-xs text-muted-foreground">이번 달</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 급여</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩3,750,000</div>
            <p className="text-xs text-muted-foreground">이번 달</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">급여 대상자</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120명</div>
            <p className="text-xs text-muted-foreground">이번 달</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">급여 지급일</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25일</div>
            <p className="text-xs text-muted-foreground">매월</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>최근 급여 지급 내역</CardTitle>
          <CardDescription>최근 3개월 급여 지급 내역</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">2023년 3월</p>
                <p className="text-sm text-muted-foreground">120명 / ₩450,000,000</p>
              </div>
              <Button variant="outline" size="sm">상세보기</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">2023년 2월</p>
                <p className="text-sm text-muted-foreground">118명 / ₩442,500,000</p>
              </div>
              <Button variant="outline" size="sm">상세보기</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">2023년 1월</p>
                <p className="text-sm text-muted-foreground">115명 / ₩431,250,000</p>
              </div>
              <Button variant="outline" size="sm">상세보기</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 