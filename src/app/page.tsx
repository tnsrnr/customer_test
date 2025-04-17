import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Clock,
  DollarSign,
  FileText,
  Settings,
  Users,
  ArrowUp,
  ChevronRight,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="py-1 px-3">
            오늘: {new Date().toLocaleDateString('ko-KR', {year: 'numeric', month: 'long', day: 'numeric'})}
          </Badge>
          <Button variant="outline" size="sm" className="gap-1">
            <Activity className="h-4 w-4" />
            실시간 업데이트
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 직원 수</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">120</div>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                <ArrowUp className="h-3 w-3 mr-1" />
                5%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">지난 달 대비</span>
            </div>
            <Progress value={75} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">부서 수</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                <ArrowUp className="h-3 w-3 mr-1" />
                1
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">지난 달 대비</span>
            </div>
            <Progress value={60} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">출근률</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">95%</div>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                <ArrowUp className="h-3 w-3 mr-1" />
                2%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">지난 주 대비</span>
            </div>
            <Progress value={95} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 급여</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₩450,000,000</div>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                <ArrowUp className="h-3 w-3 mr-1" />
                3%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">지난 달 대비</span>
            </div>
            <Progress value={85} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">공통 코드</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                <ArrowUp className="h-3 w-3 mr-1" />
                2
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">지난 달 대비</span>
            </div>
            <Progress value={65} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">시스템 설정</CardTitle>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                <ArrowUp className="h-3 w-3 mr-1" />
                1
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">지난 달 대비</span>
            </div>
            <Progress value={50} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-slate-500" />
              부서별 인원 현황
            </CardTitle>
            <CardDescription>2024년 현재 부서별 인원 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-600 mr-2"></div>
                    <span className="text-sm font-medium">개발팀</span>
                  </div>
                  <span className="text-sm">42명</span>
                </div>
                <Progress value={35} className="h-2 bg-slate-100" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-500 mr-2"></div>
                    <span className="text-sm font-medium">마케팅팀</span>
                  </div>
                  <span className="text-sm">28명</span>
                </div>
                <Progress value={23} className="h-2 bg-slate-100" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-400 mr-2"></div>
                    <span className="text-sm font-medium">디자인팀</span>
                  </div>
                  <span className="text-sm">24명</span>
                </div>
                <Progress value={20} className="h-2 bg-slate-100" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-300 mr-2"></div>
                    <span className="text-sm font-medium">인사팀</span>
                  </div>
                  <span className="text-sm">18명</span>
                </div>
                <Progress value={15} className="h-2 bg-slate-100" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-200 mr-2"></div>
                    <span className="text-sm font-medium">기타</span>
                  </div>
                  <span className="text-sm">8명</span>
                </div>
                <Progress value={7} className="h-2 bg-slate-100" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-slate-500" />
              최근 활동
            </CardTitle>
            <CardDescription>최근 시스템 활동 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="김철수" />
                  <AvatarFallback>김</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">김철수가 휴가를 신청했습니다</p>
                  <p className="text-xs text-muted-foreground">10분 전</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/02.png" alt="이영희" />
                  <AvatarFallback>이</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">이영희가 새 프로젝트를 생성했습니다</p>
                  <p className="text-xs text-muted-foreground">25분 전</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/03.png" alt="박준호" />
                  <AvatarFallback>박</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">박준호가 근태 보고서를 업데이트했습니다</p>
                  <p className="text-xs text-muted-foreground">1시간 전</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/04.png" alt="최다인" />
                  <AvatarFallback>최</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">최다인이 인사 정보를 수정했습니다</p>
                  <p className="text-xs text-muted-foreground">2시간 전</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">빠른 링크</span>
          <Badge variant="outline" className="text-xs font-normal">바로가기</Badge>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-all border-l-4 border-l-slate-400">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-700">
                관리자 관리
                <ChevronRight className="ml-auto h-5 w-5 text-slate-400" />
              </CardTitle>
              <CardDescription>시스템 관리자 관련 기능</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin">관리자 관리 바로가기</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all border-l-4 border-l-slate-400">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-700">
                공통 관리
                <ChevronRight className="ml-auto h-5 w-5 text-slate-400" />
              </CardTitle>
              <CardDescription>공통 코드 및 설정 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/com">공통 관리 바로가기</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all border-l-4 border-l-slate-400">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-700">
                인사 관리
                <ChevronRight className="ml-auto h-5 w-5 text-slate-400" />
              </CardTitle>
              <CardDescription>인사 관련 기능</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/hrs">인사 관리 바로가기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 