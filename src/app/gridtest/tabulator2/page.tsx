"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SortAsc,
  Copy,
  FileSearch,
  PieChart,
  Calendar,
  ClipboardCopy,
  Clock,
} from "lucide-react";

export default function TabulatorPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Tabulator2 그리드 예제</h1>
      <p className="text-gray-500 mb-8">
        다양한 Tabulator2 기능을 테스트할 수 있는 예제 페이지입니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/gridtest/tabulator2/sample1">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <SortAsc className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>기본 테이블 및 정렬</CardTitle>
              <CardDescription>
                사용자 정보가 들어있는 기본 테이블 및 정렬 기능
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                기본적인 Tabulator2 그리드를 구현하고 컬럼별 정렬 기능을 제공합니다.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/gridtest/tabulator2/sample2">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <ClipboardCopy className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>클립보드 기능</CardTitle>
              <CardDescription>
                셀 선택 및 복사 기능 예제
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                셀 범위 선택과 클립보드 복사 기능을 제공하는 Tabulator2 그리드 예제입니다.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-10">
        <Button asChild variant="outline">
          <Link href="/gridtest">
            그리드 테스트 목록으로 돌아가기
          </Link>
        </Button>
      </div>
    </div>
  );
} 