'use client';

import { Card } from "@/components/card";
import { Plane, Ship, Truck, Warehouse, Building, Package } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";

export default function DivisionPage() {
  const divisionData = [
    {
      id: 'air',
      name: '항공',
      icon: Plane,
      revenue: 75,
      growth: -29,
      profit: -2.4,
      color: 'bg-blue-50/80 border-blue-200',
      textColor: 'text-blue-900',
      borderColor: 'border-l-blue-500'
    },
    {
      id: 'sea',
      name: '해상',
      icon: Ship,
      revenue: 33,
      growth: 1,
      profit: 0.1,
      color: 'bg-slate-50/80 border-slate-200',
      textColor: 'text-slate-700',
      borderColor: 'border-l-slate-500'
    },
    {
      id: 'transport',
      name: '운송',
      icon: Truck,
      revenue: 26,
      growth: -4,
      profit: 0.5,
      color: 'bg-amber-50/80 border-amber-200',
      textColor: 'text-amber-800',
      borderColor: 'border-l-amber-500'
    },
    {
      id: 'warehouse',
      name: '창고',
      icon: Warehouse,
      revenue: 16,
      growth: 3,
      profit: -1.7,
      color: 'bg-green-50/80 border-green-200',
      textColor: 'text-green-800',
      borderColor: 'border-l-green-500'
    },
    {
      id: 'construction',
      name: '도급',
      icon: Building,
      revenue: 20,
      growth: 5,
      profit: 0.6,
      color: 'bg-purple-50/80 border-purple-200',
      textColor: 'text-purple-800',
      borderColor: 'border-l-purple-500'
    },
    {
      id: 'other',
      name: '기타',
      icon: Package,
      revenue: 17,
      growth: 59,
      profit: 3.0,
      color: 'bg-orange-50/80 border-orange-200',
      textColor: 'text-orange-800',
      borderColor: 'border-l-orange-500'
    }
  ];

  // 월별 상세 데이터
  const monthlyData = [
    {
      division: '항공',
      jan: 64, feb: 56, mar: 68, apr: 104, may: 75,
      total: 367, growth: '▼29%', growthColor: 'text-blue-600'
    },
    {
      division: '해상',
      jan: 41, feb: 40, mar: 56, apr: 33, may: 33,
      total: 203, growth: '▲1%', growthColor: 'text-red-500'
    },
    {
      division: '운송',
      jan: 26, feb: 27, mar: 27, apr: 28, may: 26,
      total: 134, growth: '▼4%', growthColor: 'text-blue-600'
    },
    {
      division: '창고',
      jan: 16, feb: 16, mar: 16, apr: 16, may: 16,
      total: 81, growth: '▲3%', growthColor: 'text-red-500'
    },
    {
      division: '도급',
      jan: 18, feb: 17, mar: 19, apr: 19, may: 20,
      total: 93, growth: '▲5%', growthColor: 'text-red-500'
    },
    {
      division: '기타',
      jan: 9, feb: 10, mar: 9, apr: 11, may: 17,
      total: 56, growth: '▲59%', growthColor: 'text-red-500'
    }
  ];

  // 영업이익 데이터
  const profitData = [
    { division: '항공', jan: -3.3, feb: -3.1, mar: -1.9, apr: -3.0, may: -2.4, total: -13.7, growth: '▲18%' },
    { division: '해상', jan: -0.7, feb: -1.0, mar: 0.9, apr: 0.2, may: 0.1, total: -0.4, growth: '▼40%' },
    { division: '운송', jan: 0.9, feb: 0.5, mar: 0.9, apr: 0.7, may: 0.5, total: 3.4, growth: '▼37%' },
    { division: '창고', jan: -3.4, feb: -3.3, mar: -3.4, apr: -4.2, may: -1.7, total: -16.1, growth: '▲59%' },
    { division: '도급', jan: 0.3, feb: 0.6, mar: 0.6, apr: 0.7, may: 0.6, total: 2.8, growth: '▼17%' },
    { division: '기타', jan: 3.2, feb: 3.2, mar: 2.9, apr: 2.9, may: 3.0, total: 15.3, growth: '▲3%' }
  ];

  const totalRevenue = divisionData.reduce((sum, item) => sum + item.revenue, 0);

  function DivisionPageContent() {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden flex items-center justify-center">
        {/* 배경 효과 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg className="absolute top-0 left-0 w-[28rem] h-[28rem] opacity-25 animate-spin-slow" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="180" stroke="#2563eb" strokeWidth="40" strokeDasharray="40 40" />
            <text
              x="200"
              y="235"
              textAnchor="middle"
              fontSize="72"
              fontWeight="bold"
              fill="white"
              opacity="0.25"
              style={{ letterSpacing: 18 }}
            >
              HTNS
            </text>
          </svg>
          <svg className="absolute bottom-0 right-0 w-[32rem] h-[32rem] opacity-50 animate-pulse-slow" viewBox="0 0 512 512" fill="none">
            <text
              x="256"
              y="320"
              textAnchor="middle"
              fontSize="110"
              fontWeight="900"
              fill="#3b82f6"
              opacity="0.5"
              style={{ letterSpacing: 32 }}
            >
              HTNS
            </text>
          </svg>
        </div>

        <div className="relative z-10 p-6 w-full">
          <div className="grid grid-cols-12 gap-6 h-[calc(90vh-5.4rem)] w-[90%] mx-auto">
            {/* 좌측 - 부문별 카드 테이블 형태 */}
            <div className="col-span-3">
              <Card className="p-7 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm h-full">
                {/* 헤더 */}
                <div className="grid grid-cols-12 gap-3 mb-5 px-3">
                  <div className="col-span-2 text-lg font-semibold text-slate-600">부문</div>
                  <div className="col-span-3 text-center text-lg font-semibold text-slate-600">매출</div>
                  <div className="col-span-4 text-center text-lg font-semibold text-slate-600">매출 전월 比</div>
                  <div className="col-span-3 text-center text-lg font-semibold text-slate-600">영업이익</div>
                </div>

                <div className="space-y-3">
                  {divisionData.map((division) => (
                    <Card key={division.id} className={`${division.color} border-l-4 ${division.borderColor} overflow-hidden backdrop-blur-sm`}>
                      <div className="p-4">
                        <div className="grid grid-cols-12 gap-3 items-center">
                          {/* 부문 */}
                          <div className="col-span-2 flex items-center gap-2">
                            <division.icon className={`w-5 h-5 ${division.textColor}`} />
                            <span className={`text-base font-semibold ${division.textColor}`}>
                              {division.name}
                            </span>
                          </div>
                          
                          {/* 매출 */}
                          <div className="col-span-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className={`text-2xl font-bold ${division.textColor}`}>
                                {division.revenue}
                              </span>
                              <span className="text-sm text-slate-500">억원</span>
                            </div>
                          </div>
                          
                          {/* 매출 전월 比 */}
                          <div className="col-span-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className={`text-base font-semibold ${division.growth >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                                {division.growth >= 0 ? '▲' : '▼'}
                              </span>
                              <span className={`text-base font-semibold ${division.growth >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                                {Math.abs(division.growth)}%
                              </span>
                            </div>
                          </div>
                          
                          {/* 영업이익 */}
                          <div className="col-span-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className={`text-base font-semibold ${division.profit >= 0 ? 'text-slate-700' : 'text-red-600'}`}>
                                {division.profit > 0 ? '+' : ''}{division.profit}
                              </span>
                              <span className="text-sm text-slate-500">억원</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* 합계 카드 */}
                <Card className="bg-slate-600 text-white mt-4 border-0 backdrop-blur-sm">
                  <div className="p-4">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-2">
                        <span className="text-base font-semibold">합 계</span>
                      </div>
                      <div className="col-span-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-2xl font-bold">{totalRevenue}</span>
                          <span className="text-sm">억원</span>
                        </div>
                      </div>
                      <div className="col-span-4 text-center">
                        <span className="text-base text-blue-300">▼11%</span>
                      </div>
                      <div className="col-span-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-base font-semibold">0.0</span>
                          <span className="text-sm">억원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Card>
            </div>

            {/* 우측 - 부문별 실적 테이블 */}
            <div className="col-span-9">
              <Card className="p-7 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm h-full">
                <div className="overflow-x-auto h-full">
                  <table className="w-full h-full border-collapse">
                    <thead>
                      <tr className="text-lg border-b-2 border-slate-200">
                        <th className="py-4 px-3 text-center font-bold text-slate-700 bg-slate-100 border-r-2 border-slate-200">구분</th>
                        <th colSpan={7} className="py-2 px-2 text-center text-4xl font-bold tracking-[1em] text-blue-700 bg-blue-50/30 border-r-2 border-slate-200">매 출</th>
                        <th colSpan={7} className="py-2 px-2 text-center text-4xl font-bold tracking-[1em] text-green-700 bg-green-50/30">영 업 이 익</th>
                      </tr>
                      <tr className="text-base border-b-2 border-slate-200">
                        <th className="py-4 px-3 text-center font-bold text-slate-600 bg-slate-100 border-r-2 border-slate-200">부문</th>
                        {/* 매출 헤더 */}
                        <th className="py-4 px-3 text-center font-bold text-blue-600 bg-blue-50/30">1월</th>
                        <th className="py-4 px-3 text-center font-bold text-blue-600">2월</th>
                        <th className="py-4 px-3 text-center font-bold text-blue-600 bg-blue-50/30">3월</th>
                        <th className="py-4 px-3 text-center font-bold text-blue-600">4월</th>
                        <th className="py-4 px-3 text-center font-bold text-blue-600 bg-blue-50/30 border-x-2 border-t-2 border-red-400">5월</th>
                        <th className="py-4 px-3 text-center font-bold text-blue-600">누계</th>
                        <th className="py-4 px-3 text-center font-bold text-blue-600 bg-blue-50/30 border-r-2 border-slate-200">전월비</th>
                        {/* 영업이익 헤더 */}
                        <th className="py-4 px-3 text-center font-bold text-green-600 bg-green-50/30">1월</th>
                        <th className="py-4 px-3 text-center font-bold text-green-600">2월</th>
                        <th className="py-4 px-3 text-center font-bold text-green-600 bg-green-50/30">3월</th>
                        <th className="py-4 px-3 text-center font-bold text-green-600">4월</th>
                        <th className="py-4 px-3 text-center font-bold text-green-600 bg-green-50/30 border-x-2 border-t-2 border-red-400">5월</th>
                        <th className="py-4 px-3 text-center font-bold text-green-600">누계</th>
                        <th className="py-4 px-3 text-center font-bold text-green-600 bg-green-50/30">전월비</th>
                      </tr>
                    </thead>
                    <tbody className="text-base">
                      {/* 수출 */}
                      <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                        <td className="py-4 px-3 text-center font-medium text-slate-700 border-r-2 border-slate-200">수출</td>
                        {/* 매출 데이터 */}
                        <td className="py-4 px-3 text-center bg-blue-50/30">123</td>
                        <td className="py-4 px-3 text-center">123</td>
                        <td className="py-4 px-3 text-center bg-blue-50/30">123</td>
                        <td className="py-4 px-3 text-center">123</td>
                        <td className="py-4 px-3 text-center font-medium bg-blue-50/30 border-x-2 border-red-400">123</td>
                        <td className="py-4 px-3 text-center font-medium">615</td>
                        <td className="py-4 px-3 text-center border-r-2 border-slate-200">0%</td>
                        {/* 영업이익 데이터 */}
                        <td className="py-4 px-3 text-center bg-green-50/30">12</td>
                        <td className="py-4 px-3 text-center">12</td>
                        <td className="py-4 px-3 text-center bg-green-50/30">12</td>
                        <td className="py-4 px-3 text-center">12</td>
                        <td className="py-4 px-3 text-center font-medium bg-green-50/30 border-x-2 border-red-400">12</td>
                        <td className="py-4 px-3 text-center font-medium">60</td>
                        <td className="py-4 px-3 text-center bg-green-50/30">0%</td>
                      </tr>
                      {/* 해상 */}
                      <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                        <td className="py-4 px-3 text-center font-medium text-slate-700 border-r-2 border-slate-200">해상</td>
                        {/* 매출 데이터 */}
                        <td className="py-4 px-3 text-center bg-blue-50/30">41</td>
                        <td className="py-4 px-3 text-center">40</td>
                        <td className="py-4 px-3 text-center bg-blue-50/30">56</td>
                        <td className="py-4 px-3 text-center">33</td>
                        <td className="py-4 px-3 text-center font-medium bg-blue-50/30 border-x-2 border-red-400">33</td>
                        <td className="py-4 px-3 text-center font-medium">203</td>
                        <td className="py-4 px-3 text-center text-red-600 border-r-2 border-slate-200">▲1%</td>
                        {/* 영업이익 데이터 */}
                        <td className="py-4 px-3 text-center text-red-600 bg-green-50/30">-0.7</td>
                        <td className="py-4 px-3 text-center text-red-600">-1.0</td>
                        <td className="py-4 px-3 text-center bg-green-50/30">0.9</td>
                        <td className="py-4 px-3 text-center">0.2</td>
                        <td className="py-4 px-3 text-center font-medium bg-green-50/30 border-x-2 border-red-400">0.1</td>
                        <td className="py-4 px-3 text-center text-red-600">-0.4</td>
                        <td className="py-4 px-3 text-center text-blue-600 bg-green-50/30">▼40%</td>
                      </tr>
                      {/* 운송 */}
                      <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                        <td className="py-4 px-3 text-center font-medium text-slate-700 border-r-2 border-slate-200">운송</td>
                        {/* 매출 데이터 */}
                        <td className="py-4 px-3 text-center bg-blue-50/30">26</td>
                        <td className="py-4 px-3 text-center">27</td>
                        <td className="py-4 px-3 text-center bg-blue-50/30">27</td>
                        <td className="py-4 px-3 text-center">28</td>
                        <td className="py-4 px-3 text-center font-medium bg-blue-50/30 border-x-2 border-red-400">26</td>
                        <td className="py-4 px-3 text-center font-medium">134</td>
                        <td className="py-4 px-3 text-center text-blue-600 border-r-2 border-slate-200">▼4%</td>
                        {/* 영업이익 데이터 */}
                        <td className="py-4 px-3 text-center bg-green-50/30">0.9</td>
                        <td className="py-4 px-3 text-center">0.5</td>
                        <td className="py-4 px-3 text-center bg-green-50/30">0.9</td>
                        <td className="py-4 px-3 text-center">0.7</td>
                        <td className="py-4 px-3 text-center font-medium bg-green-50/30 border-x-2 border-red-400">0.5</td>
                        <td className="py-4 px-3 text-center">3.4</td>
                        <td className="py-4 px-3 text-center text-blue-600 bg-green-50/30">▼37%</td>
                      </tr>
                      {/* 창고 */}
                      <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                        <td className="py-4 px-3 text-center font-medium text-slate-700 border-r-2 border-slate-200">창고</td>
                        {/* 매출 데이터 */}
                        <td className="py-4 px-3 text-center bg-blue-50/30">16</td>
                        <td className="py-4 px-3 text-center">16</td>
                        <td className="py-4 px-3 text-center bg-blue-50/30">16</td>
                        <td className="py-4 px-3 text-center">16</td>
                        <td className="py-4 px-3 text-center font-medium bg-blue-50/30 border-x-2 border-red-400">16</td>
                        <td className="py-4 px-3 text-center font-medium">81</td>
                        <td className="py-4 px-3 text-center text-red-600 border-r-2 border-slate-200">▲3%</td>
                        {/* 영업이익 데이터 */}
                        <td className="py-4 px-3 text-center text-red-600 bg-green-50/30">-3.4</td>
                        <td className="py-4 px-3 text-center text-red-600">-3.3</td>
                        <td className="py-4 px-3 text-center text-red-600 bg-green-50/30">-3.4</td>
                        <td className="py-4 px-3 text-center text-red-600">-4.2</td>
                        <td className="py-4 px-3 text-center font-medium text-red-600 bg-green-50/30 border-x-2 border-red-400">-1.7</td>
                        <td className="py-4 px-3 text-center text-red-600">-16.1</td>
                        <td className="py-4 px-3 text-center text-red-600 bg-green-50/30">▲59%</td>
                      </tr>
                      {/* 도급 */}
                      <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                        <td className="py-4 px-3 text-center font-medium text-slate-700 border-r-2 border-slate-200">도급</td>
                        {/* 매출 데이터 */}
                        <td className="py-4 px-3 text-center bg-blue-50/30">18</td>
                        <td className="py-4 px-3 text-center">17</td>
                        <td className="py-4 px-3 text-center bg-blue-50/30">19</td>
                        <td className="py-4 px-3 text-center">19</td>
                        <td className="py-4 px-3 text-center font-medium bg-blue-50/30 border-x-2 border-red-400">20</td>
                        <td className="py-4 px-3 text-center font-medium">93</td>
                        <td className="py-4 px-3 text-center text-red-600 border-r-2 border-slate-200">▲5%</td>
                        {/* 영업이익 데이터 */}
                        <td className="py-4 px-3 text-center bg-green-50/30">0.3</td>
                        <td className="py-4 px-3 text-center">0.6</td>
                        <td className="py-4 px-3 text-center bg-green-50/30">0.6</td>
                        <td className="py-4 px-3 text-center">0.7</td>
                        <td className="py-4 px-3 text-center font-medium bg-green-50/30 border-x-2 border-red-400">0.6</td>
                        <td className="py-4 px-3 text-center">2.8</td>
                        <td className="py-4 px-3 text-center text-blue-600 bg-green-50/30">▼17%</td>
                      </tr>
                      {/* 기타 */}
                      <tr className="hover:bg-slate-50/50 border-b-2 border-slate-200">
                        <td className="py-4 px-3 text-center font-medium text-slate-700 border-r-2 border-slate-200">기타</td>
                        {/* 매출 데이터 */}
                        <td className="py-4 px-3 text-center bg-blue-50/30">9</td>
                        <td className="py-4 px-3 text-center">10</td>
                        <td className="py-4 px-3 text-center bg-blue-50/30">9</td>
                        <td className="py-4 px-3 text-center">11</td>
                        <td className="py-4 px-3 text-center font-medium bg-blue-50/30 border-x-2 border-red-400">17</td>
                        <td className="py-4 px-3 text-center font-medium">56</td>
                        <td className="py-4 px-3 text-center text-red-600 border-r-2 border-slate-200">▲59%</td>
                        {/* 영업이익 데이터 */}
                        <td className="py-4 px-3 text-center bg-green-50/30">3.2</td>
                        <td className="py-4 px-3 text-center">3.2</td>
                        <td className="py-4 px-3 text-center bg-green-50/30">2.9</td>
                        <td className="py-4 px-3 text-center">2.9</td>
                        <td className="py-4 px-3 text-center font-medium bg-green-50/30 border-x-2 border-red-400">3.0</td>
                        <td className="py-4 px-3 text-center">15.3</td>
                        <td className="py-4 px-3 text-center text-red-600 bg-green-50/30">▲3%</td>
                      </tr>
                      {/* 소계 */}
                      <tr className="bg-slate-800 text-white">
                        <td className="py-4 px-3 text-center font-medium border-r-2 border-slate-700">소계</td>
                        {/* 매출 데이터 */}
                        <td className="py-4 px-3 text-center">175</td>
                        <td className="py-4 px-3 text-center">165</td>
                        <td className="py-4 px-3 text-center">195</td>
                        <td className="py-4 px-3 text-center">211</td>
                        <td className="py-4 px-3 text-center font-medium bg-red-600">188</td>
                        <td className="py-4 px-3 text-center font-medium">934</td>
                        <td className="py-4 px-3 text-center border-r-2 border-slate-700">▼11%</td>
                        {/* 영업이익 데이터 */}
                        <td className="py-4 px-3 text-center text-red-300">-3.0</td>
                        <td className="py-4 px-3 text-center text-red-300">-3.2</td>
                        <td className="py-4 px-3 text-center">0.1</td>
                        <td className="py-4 px-3 text-center text-red-300">-2.6</td>
                        <td className="py-4 px-3 text-center font-medium bg-red-600">0.0</td>
                        <td className="py-4 px-3 text-center text-red-300">-8.6</td>
                        <td className="py-4 px-3 text-center">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <DivisionPageContent />
    </AuthGuard>
  );
} 