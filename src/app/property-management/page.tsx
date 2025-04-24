'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, MessageSquare, Database, Filter } from 'lucide-react';

export default function PropertyManagement() {
  const [checkDateRange, setCheckDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [registerDateRange, setRegisterDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // 샘플 데이터
  const properties = [
    { id: 1, checkDate: '24.04.03', registerDate: '24.04.03', propertyType: '대지', propertyNumber: 'A12311', address: '서울시 중구', floor: '3', area: '85,000㎡', price: '85,000원', companyName: '010-9123-1212', ownerName: '박철수', useType: '도로', status: '승인' },
    { id: 2, checkDate: '24.04.03', registerDate: '24.04.03', propertyType: '대지', propertyNumber: 'A12311', address: '서울시 강남구', floor: '6', area: '125,000㎡', price: '175,000원', companyName: '010-9123-1212', ownerName: '김영희', useType: '건물', status: '승인' },
    { id: 3, checkDate: '24.04.03', registerDate: '24.04.03', propertyType: '땅', propertyNumber: 'A12312', address: '서울시 영등포구', floor: '2', area: '60,000㎡', price: '85,000원', companyName: '010-9123-1212', ownerName: '이순철', useType: '공원', status: '승인' },
    { id: 4, checkDate: '24.04.03', registerDate: '24.04.03', propertyType: '대지', propertyNumber: 'A12311', address: '서울시 마포구', floor: '3', area: '85,000㎡', price: '85,000원', companyName: '010-9123-1212', ownerName: '최철수', useType: '상가', status: '승인' },
    { id: 5, checkDate: '24.04.03', registerDate: '24.04.03', propertyType: '건물', propertyNumber: 'A12312', address: '서울시 강서구', floor: '2', area: '60,000㎡', price: '85,000원', companyName: '010-9123-1212', ownerName: '최영희', useType: '공원', status: '승인' },
  ];

  return (
    <div className="space-y-4">
      {/* 상단 탭 메뉴 */}
      <div className="flex items-center border-b gap-4 pb-2 mb-3">
        <button className="px-4 py-1.5 flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 font-medium">
          <Bell className="h-4 w-4" />
          알림 시스템
        </button>
        <button className="px-4 py-1.5 flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <MessageSquare className="h-4 w-4" />
          다이얼로그/모달
        </button>
        <button className="px-4 py-1.5 flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <Database className="h-4 w-4" />
          데이터 테이블
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-3">부지재 관리</h1>
      
      {/* 검색 필터 */}
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 flex items-center gap-2">
              <label className="w-20 font-medium text-sm text-gray-700">조회일</label>
              <DatePickerWithRange 
                dateRange={checkDateRange}
                setDateRange={setCheckDateRange}
                className="flex-1"
              />
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <label className="w-20 font-medium text-sm text-gray-700">등록일</label>
              <DatePickerWithRange 
                dateRange={registerDateRange}
                setDateRange={setRegisterDateRange}
                className="flex-1"
              />
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <label className="w-20 font-medium text-sm text-gray-700">부지종류</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="land">대지</SelectItem>
                  <SelectItem value="building">건물</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <label className="w-20 font-medium text-sm text-gray-700">등록자</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="kim">김영희</SelectItem>
                  <SelectItem value="park">박철수</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Button className="w-24">조회</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* 부지 목록 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">부지 목록</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-green-600 border-green-600">등록 양식</Button>
            <Button variant="outline" className="text-gray-600">수정하기</Button>
            <Button variant="destructive">삭제하기</Button>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="text-center">조회일</TableHead>
                <TableHead className="text-center">등록일</TableHead>
                <TableHead className="text-center">부지종류</TableHead>
                <TableHead className="text-center">부지번호</TableHead>
                <TableHead className="text-center">주소지</TableHead>
                <TableHead className="text-center">면적</TableHead>
                <TableHead className="text-center">층수</TableHead>
                <TableHead className="text-center">제공금액/평</TableHead>
                <TableHead className="text-center">제공금액/월</TableHead>
                <TableHead className="text-center">연락처</TableHead>
                <TableHead className="text-center">소유자명</TableHead>
                <TableHead className="text-center">사용용도</TableHead>
                <TableHead className="text-center">상태</TableHead>
                <TableHead className="text-center">승인</TableHead>
                <TableHead className="text-center">거절</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="text-center">
                    <Checkbox id={`select-${property.id}`} />
                  </TableCell>
                  <TableCell className="text-center">{property.checkDate}</TableCell>
                  <TableCell className="text-center">{property.registerDate}</TableCell>
                  <TableCell className="text-center">{property.propertyType}</TableCell>
                  <TableCell className="text-center">{property.propertyNumber}</TableCell>
                  <TableCell className="text-center">{property.address}</TableCell>
                  <TableCell className="text-center">{property.area}</TableCell>
                  <TableCell className="text-center">{property.floor}</TableCell>
                  <TableCell className="text-center">{property.price}</TableCell>
                  <TableCell className="text-center">{property.price}</TableCell>
                  <TableCell className="text-center">{property.companyName}</TableCell>
                  <TableCell className="text-center">{property.ownerName}</TableCell>
                  <TableCell className="text-center">{property.useType}</TableCell>
                  <TableCell className="text-center">{property.status}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 w-16 h-7">승인</Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 w-16 h-7">거절</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-center py-3">
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">1</Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">2</Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">4</Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">5</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 