'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployeeStore } from '@/lib/store/employeeStore';
import { useParams } from 'next/navigation';

export default function EmployeeDetailPage() {
  const params = useParams();
  const { employees, fetchEmployees } = useEmployeeStore();
  const employee = employees.find(emp => emp.id === params.id);

  React.useEffect(() => {
    if (employees.length === 0) {
      fetchEmployees();
    }
  }, [employees.length, fetchEmployees]);

  if (!employee) {
    return (
      <main className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">직원 정보를 찾을 수 없습니다</h1>
          <Button asChild>
            <Link href="/hrs/employees">목록으로 돌아가기</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">직원 상세 정보</h1>
        <div className="space-x-4">
          <Button asChild variant="outline">
            <Link href={`/hrs/employees/${employee.id}/edit`}>수정</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/hrs/employees">목록으로</Link>
          </Button>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{employee.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">부서</h3>
                <p>{employee.department}</p>
              </div>
              <div>
                <h3 className="font-semibold">직책</h3>
                <p>{employee.position}</p>
              </div>
              <div>
                <h3 className="font-semibold">이메일</h3>
                <p>{employee.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">전화번호</h3>
                <p>{employee.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold">입사일</h3>
                <p>{new Date(employee.hireDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 