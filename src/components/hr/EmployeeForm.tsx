'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Employee } from '@/lib/types/employee';
import { useEmployeeStore } from '@/lib/store/employeeStore';

interface EmployeeFormProps {
  employee?: Employee;
  onCancel?: () => void;
}

export default function EmployeeForm({ employee, onCancel }: EmployeeFormProps) {
  const router = useRouter();
  const { addEmployee, updateEmployee } = useEmployeeStore();
  
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: employee?.name || '',
    department: employee?.department || '',
    position: employee?.position || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    hireDate: employee?.hireDate || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Employee, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof Employee]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Employee, string>> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
      isValid = false;
    }

    if (!formData.department.trim()) {
      newErrors.department = '부서를 입력해주세요';
      isValid = false;
    }

    if (!formData.position.trim()) {
      newErrors.position = '직급을 입력해주세요';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요';
      isValid = false;
    }

    if (!formData.hireDate.trim()) {
      newErrors.hireDate = '입사일을 입력해주세요';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (employee) {
      // Update existing employee
      updateEmployee({
        ...formData,
        id: employee.id
      });
      router.push(`/hrs/employees/${employee.id}`);
    } else {
      // Add new employee
      const newEmployee = {
        ...formData,
        id: `EMP${Date.now().toString().slice(-6)}` // Simple ID generation
      };
      addEmployee(newEmployee);
      router.push('/hrs/employees');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">이름</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="department">부서</Label>
              <Input 
                id="department" 
                name="department" 
                value={formData.department} 
                onChange={handleChange}
                className={errors.department ? 'border-red-500' : ''}
              />
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            <div>
              <Label htmlFor="position">직급</Label>
              <Input 
                id="position" 
                name="position" 
                value={formData.position} 
                onChange={handleChange}
                className={errors.position ? 'border-red-500' : ''}
              />
              {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
            </div>

            <div>
              <Label htmlFor="email">이메일</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">전화번호</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="hireDate">입사일</Label>
              <Input 
                id="hireDate" 
                name="hireDate" 
                type="date"
                value={formData.hireDate} 
                onChange={handleChange}
                className={errors.hireDate ? 'border-red-500' : ''}
              />
              {errors.hireDate && <p className="text-red-500 text-sm mt-1">{errors.hireDate}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel || (() => router.back())}
            >
              취소
            </Button>
            <Button type="submit">
              {employee ? '수정하기' : '등록하기'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 