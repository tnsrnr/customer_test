'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, Users, Building2, LineChart, PieChart, TrendingUp, 
  Plane, Ship, Warehouse, HardHat, Building, Globe 
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  jsessionId?: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('사용자 데이터 파싱 오류:', error);
        localStorage.removeItem('user');
        router.push('/auth');
      }
    } else {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      router.push('/auth');
    }
  }, [router]);

  const menuItems = [
    { name: '전사실적', path: '/menu/company-performance', icon: BarChart3, color: 'bg-blue-500' },
    { name: '인원현황', path: '/menu/personnel', icon: Users, color: 'bg-green-500' },
    { name: '본사실적', path: '/menu/hq-performance', icon: Building2, color: 'bg-purple-500' },
    { name: '재무현황', path: '/menu/finance', icon: LineChart, color: 'bg-orange-500' },
    { name: '부문별실적', path: '/menu/division', icon: PieChart, color: 'bg-pink-500' },
    { name: '상위거래처', path: '/menu/top-clients', icon: TrendingUp, color: 'bg-indigo-500' },
    { name: '항공실적', path: '/menu/air', icon: Plane, color: 'bg-cyan-500' },
    { name: '해상실적', path: '/menu/sea', icon: Ship, color: 'bg-teal-500' },
    { name: '창고실적', path: '/menu/warehouse', icon: Warehouse, color: 'bg-amber-500' },
    { name: '도급실적', path: '/menu/outsourcing', icon: HardHat, color: 'bg-red-500' },
    { name: '국내자회사', path: '/menu/domestic-subsidiaries', icon: Building, color: 'bg-emerald-500' },
    { name: '해외자회사', path: '/menu/overseas-subsidiaries', icon: Globe, color: 'bg-violet-500' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 사용자 정보 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HTNS 대시보드에 오신 것을 환영합니다!
          </h1>
          <p className="text-gray-600">
            안녕하세요, <span className="font-semibold text-blue-600">{user.name}</span>님! 
            아래 메뉴에서 원하는 기능을 선택하세요.
          </p>
        </div>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${item.color} text-white group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.name} 데이터를 확인하세요
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* 추가 메뉴 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/a15-domestic">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-slate-500 text-white group-hover:scale-110 transition-transform">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    회사
                  </h3>
                  <p className="text-sm text-gray-500">
                    회사 정보를 확인하세요
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/a18-test3">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-lime-500 text-white group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    사업부
                  </h3>
                  <p className="text-sm text-gray-500">
                    사업부 정보를 확인하세요
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/a20-test5">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-rose-500 text-white group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    해외권역1
                  </h3>
                  <p className="text-sm text-gray-500">
                    해외권역1 정보를 확인하세요
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}