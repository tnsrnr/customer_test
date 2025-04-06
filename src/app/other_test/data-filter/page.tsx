'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

type SortField = 'name' | 'email' | 'role' | 'status' | 'lastLogin';
type SortDirection = 'asc' | 'desc';

// 샘플 사용자 데이터
const dummyUsers: User[] = [
  { id: 1, name: '김철수', email: 'kim@example.com', role: '관리자', status: 'active', lastLogin: '2023-04-01' },
  { id: 2, name: '이영희', email: 'lee@example.com', role: '편집자', status: 'active', lastLogin: '2023-04-05' },
  { id: 3, name: '박민수', email: 'park@example.com', role: '사용자', status: 'inactive', lastLogin: '2023-03-20' },
  { id: 4, name: '정수연', email: 'jung@example.com', role: '편집자', status: 'pending', lastLogin: '2023-04-10' },
  { id: 5, name: '홍길동', email: 'hong@example.com', role: '사용자', status: 'active', lastLogin: '2023-04-08' },
  { id: 6, name: '최지수', email: 'choi@example.com', role: '관리자', status: 'active', lastLogin: '2023-04-12' },
  { id: 7, name: '강동훈', email: 'kang@example.com', role: '사용자', status: 'inactive', lastLogin: '2023-03-15' },
  { id: 8, name: '윤미란', email: 'yoon@example.com', role: '편집자', status: 'pending', lastLogin: '2023-04-02' },
  { id: 9, name: '장승우', email: 'jang@example.com', role: '사용자', status: 'active', lastLogin: '2023-04-07' },
  { id: 10, name: '한지민', email: 'han@example.com', role: '편집자', status: 'active', lastLogin: '2023-04-09' },
];

export default function DataFilterPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    setUsers(dummyUsers);
    setFilteredUsers(dummyUsers);
  }, []);

  // 검색, 필터링, 정렬 적용
  useEffect(() => {
    let result = [...users];
    
    // 검색어 필터링
    if (searchQuery) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 역할 필터링
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // 상태 필터링
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // 정렬
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter, statusFilter, sortField, sortDirection]);

  // 모두 선택 체크박스 상태 변경 시
  useEffect(() => {
    if (selectAll) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  }, [selectAll, filteredUsers]);

  // 정렬 필드 변경 핸들러
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // 같은 필드를 다시 클릭하면 정렬 방향 전환
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 필드 클릭 시 해당 필드로 정렬 필드 변경, 기본 오름차순
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 사용자 선택 체크박스 변경 핸들러
  const handleUserSelect = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // 상태에 따른 배지 색상 결정
  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">활성</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500">비활성</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">대기중</Badge>;
      default:
        return null;
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" /> 
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">데이터 필터링 및 정렬 데모</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>사용자 목록</CardTitle>
          <CardDescription>
            검색, 필터링, 정렬 기능을 테스트할 수 있는 사용자 목록 예제입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 필터 및 검색 영역 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* 검색창 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="이름 또는 이메일로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            {/* 역할 필터 */}
            <div className="w-full md:w-[180px]">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 역할</SelectItem>
                  <SelectItem value="관리자">관리자</SelectItem>
                  <SelectItem value="편집자">편집자</SelectItem>
                  <SelectItem value="사용자">사용자</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* 상태 필터 */}
            <div className="w-full md:w-[180px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* 선택된 사용자 수 표시 및 작업 버튼 */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center justify-between mb-4 p-2 bg-muted rounded">
              <span>{selectedUsers.length}명의 사용자가 선택됨</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm">선택 사용자 삭제</Button>
                <Button variant="outline" size="sm">상태 변경</Button>
              </div>
            </div>
          )}
          
          {/* 사용자 테이블 */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={setSelectAll}
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      이름
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                    <div className="flex items-center">
                      이메일
                      {getSortIcon('email')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
                    <div className="flex items-center">
                      역할
                      {getSortIcon('role')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      상태
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('lastLogin')}>
                    <div className="flex items-center">
                      마지막 로그인
                      {getSortIcon('lastLogin')}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      검색 결과가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => 
                            handleUserSelect(user.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* 페이지네이션 및 표시 행 수 설정 (실제 동작하지는 않음) */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Label htmlFor="rows-per-page" className="text-sm">행 표시:</Label>
              <Select defaultValue="10">
                <SelectTrigger id="rows-per-page" className="w-16 h-8">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">총 {filteredUsers.length}개 항목</span>
            </div>
            
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled>이전</Button>
              <Button variant="outline" size="sm" className="px-3 bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm" disabled>다음</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 