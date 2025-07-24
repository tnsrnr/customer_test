"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Ship, 
  Warehouse,
  Briefcase,
  Globe,
  BarChart3
} from "lucide-react";

interface User {
  id: string;
  name: string;
  jsessionId?: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // localStorage에서 사용자 정보 확인
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (e) {
        console.error('사용자 정보 파싱 오류:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const menuItems = [
    {
      title: "회사 성과",
      description: "회사 전반적인 성과 지표",
      icon: Building2,
      href: "/a01-company-performance",
      color: "bg-blue-500"
    },
    {
      title: "인사 관리",
      description: "직원 정보 및 인사 현황",
      icon: Users,
      href: "/a02-personnel",
      color: "bg-green-500"
    },
    {
      title: "본사 성과",
      description: "본사별 성과 분석",
      icon: TrendingUp,
      href: "/a03-hq-performance",
      color: "bg-purple-500"
    },
    {
      title: "재무 현황",
      description: "재무 데이터 및 분석",
      icon: DollarSign,
      href: "/a04-finance",
      color: "bg-yellow-500"
    },
    {
      title: "사업부별 현황",
      description: "각 사업부별 성과",
      icon: BarChart3,
      href: "/a05-division",
      color: "bg-red-500"
    },
    {
      title: "주요 고객사",
      description: "주요 고객사 현황",
      icon: Building2,
      href: "/a06-top-clients",
      color: "bg-indigo-500"
    },
    {
      title: "항공 운송",
      description: "항공 운송 현황",
      icon: Ship,
      href: "/a07-air",
      color: "bg-pink-500"
    },
    {
      title: "해상 운송",
      description: "해상 운송 현황",
      icon: Ship,
      href: "/a08-sea",
      color: "bg-cyan-500"
    },
    {
      title: "창고 관리",
      description: "창고 및 재고 관리",
      icon: Warehouse,
      href: "/a09-warehouse",
      color: "bg-orange-500"
    },
    {
      title: "외주 관리",
      description: "외주 업체 관리",
      icon: Briefcase,
      href: "/a10-outsourcing",
      color: "bg-teal-500"
    },
    {
      title: "국내 자회사",
      description: "국내 자회사 현황",
      icon: Building2,
      href: "/a11-domestic-subsidiaries",
      color: "bg-emerald-500"
    },
    {
      title: "해외 자회사",
      description: "해외 자회사 현황",
      icon: Globe,
      href: "/a12-overseas-subsidiaries",
      color: "bg-violet-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            비즈니스 인사이트
          </h2>
          <p className="text-gray-600">
            HTNS의 모든 비즈니스 데이터를 한눈에 확인하세요
          </p>
        </div>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(item.href)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}