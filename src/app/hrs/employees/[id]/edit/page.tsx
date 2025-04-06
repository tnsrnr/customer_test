'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import EmployeeForm from '@/components/hr/EmployeeForm';
import { useEmployeeStore } from '@/lib/store/employeeStore';
import { useParams } from 'next/navigation';

export default function EditEmployeePage() {
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
        <h1 className="text-4xl font-bold">직원 정보 수정</h1>
        <Button asChild variant="outline">
          <Link href={`/hrs/employees/${employee.id}`}>돌아가기</Link>
        </Button>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {employee ? (
          <EmployeeForm 
            employee={employee} 
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-lg mb-4">해당 직원 정보를 찾을 수 없습니다.</p>
            <Button asChild>
              <Link href="/hrs/employees">직원 목록으로 돌아가기</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
} 