"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Search } from "lucide-react";
import Link from "next/link";

// 출결 이슈 인터페이스
interface AttendanceIssue {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  date: string;
  issueType: "지각" | "조퇴" | "결근";
  status: "처리 대기" | "처리 완료" | "승인됨" | "반려됨";
  reason?: string;
  note?: string;
}

export default function AttendanceIssuesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("전체");
  const [filterIssueType, setFilterIssueType] = useState<string>("전체");

  // 더미 데이터
  const dummyIssues: AttendanceIssue[] = [
    { id: "1", employeeId: "E001", name: "김철수", department: "개발팀", position: "사원", date: "2023-06-01", issueType: "지각", status: "처리 대기", reason: "교통 혼잡", note: "" },
    { id: "2", employeeId: "E002", name: "이영희", department: "인사팀", position: "주임", date: "2023-06-01", issueType: "조퇴", status: "처리 완료", reason: "병원 방문", note: "정기 검진" },
    { id: "3", employeeId: "E003", name: "박민수", department: "마케팅팀", position: "대리", date: "2023-06-02", issueType: "결근", status: "승인됨", reason: "개인 사유", note: "승인 완료" },
    { id: "4", employeeId: "E004", name: "정수진", department: "개발팀", position: "과장", date: "2023-06-03", issueType: "지각", status: "반려됨", reason: "알람 미작동", note: "반복적인 지각" },
    { id: "5", employeeId: "E005", name: "홍길동", department: "영업팀", position: "차장", date: "2023-06-04", issueType: "조퇴", status: "처리 대기", reason: "가족 행사", note: "" },
  ];

  // 필터링된 데이터
  const filteredIssues = dummyIssues.filter(issue => {
    // 검색어 필터링
    const matchesSearch = searchTerm === "" || 
      issue.name.includes(searchTerm) || 
      issue.employeeId.includes(searchTerm);
    
    // 상태 필터링
    const matchesStatus = filterStatus === "전체" || issue.status === filterStatus;
    
    // 이슈 유형 필터링
    const matchesIssueType = filterIssueType === "전체" || issue.issueType === filterIssueType;
    
    return matchesSearch && matchesStatus && matchesIssueType;
  });

  // 상태에 따른 배지 스타일
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "처리 대기": return "outline";
      case "처리 완료": return "secondary";
      case "승인됨": return "default";
      case "반려됨": return "destructive";
      default: return "outline";
    }
  };

  // 이슈 유형에 따른 배지 스타일
  const getIssueTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "지각": return "warning";
      case "조퇴": return "secondary";
      case "결근": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hrs/attendance">
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">지각/조퇴/결근 처리</h1>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>출결 이슈 목록</CardTitle>
          <div className="flex flex-wrap gap-4 mt-4 justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="이름 또는 사번 검색..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">상태:</span>
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="처리 대기">처리 대기</SelectItem>
                  <SelectItem value="처리 완료">처리 완료</SelectItem>
                  <SelectItem value="승인됨">승인됨</SelectItem>
                  <SelectItem value="반려됨">반려됨</SelectItem>
                </SelectContent>
              </Select>
              
              <span className="text-sm font-medium ml-2">유형:</span>
              <Select
                value={filterIssueType}
                onValueChange={setFilterIssueType}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="지각">지각</SelectItem>
                  <SelectItem value="조퇴">조퇴</SelectItem>
                  <SelectItem value="결근">결근</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직원</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서/직급</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사유</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">비고</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{issue.name}</div>
                          <div className="text-sm text-gray-500">{issue.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{issue.department}</div>
                      <div className="text-sm text-gray-500">{issue.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{issue.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getIssueTypeBadgeVariant(issue.issueType) as any}>
                        {issue.issueType}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{issue.reason || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(issue.status) as any}>
                        {issue.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{issue.note || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm">처리</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          변경사항 저장
        </Button>
      </div>
    </div>
  );
} 