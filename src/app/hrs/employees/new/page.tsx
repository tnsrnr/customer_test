import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import EmployeeForm from '@/components/hr/EmployeeForm';

export default function NewEmployeePage() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">새 직원 등록</h1>
        <Button asChild variant="outline">
          <Link href="/hrs/employees">돌아가기</Link>
        </Button>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <EmployeeForm />
      </div>
    </main>
  );
} 