'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Mail, Phone, User } from 'lucide-react';

export default function EmployeesPage() {
  // 샘플 직원 데이터
  const employees = [
    {
      id: 1,
      name: '홍길동',
      position: '개발자',
      department: '개발팀',
      email: 'hong@example.com',
      phone: '010-1234-5678',
      status: '재직중',
      avatar: '/avatars/01.png',
    },
    {
      id: 2,
      name: '김철수',
      position: '디자이너',
      department: '디자인팀',
      email: 'kim@example.com',
      phone: '010-2345-6789',
      status: '재직중',
      avatar: '/avatars/02.png',
    },
    {
      id: 3,
      name: '이영희',
      position: '마케터',
      department: '마케팅팀',
      email: 'lee@example.com',
      phone: '010-3456-7890',
      status: '휴직',
      avatar: '/avatars/03.png',
    },
    {
      id: 4,
      name: '박지성',
      position: '인사담당',
      department: '인사팀',
      email: 'park@example.com',
      phone: '010-4567-8901',
      status: '재직중',
      avatar: '/avatars/04.png',
    },
    {
      id: 5,
      name: '최영수',
      position: '영업담당',
      department: '영업팀',
      email: 'choi@example.com',
      phone: '010-5678-9012',
      status: '재직중',
      avatar: '/avatars/05.png',
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">직원 관리</h1>
        <Button asChild>
          <Link href="/hrs/employees/new">
            <User className="mr-2 h-4 w-4" />
            새 직원 등록
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>직원 목록</CardTitle>
          <CardDescription>전체 직원 목록 및 정보</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>직원</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{employee.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.position}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.department}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.status === '재직중' ? 'default' : 'secondary'}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/hrs/employees/${employee.id}`}>상세보기</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 