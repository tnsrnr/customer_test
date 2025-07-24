'use client';

import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Building2, Factory, Globe2 } from "lucide-react";

export default function PersonnelPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-5 space-y-3">
      {/* 통합된 상단 카드 섹션 */}
      <Card className="bg-gradient-to-br from-slate-100 to-white rounded-lg shadow-md overflow-hidden border border-slate-200">
        <div className="p-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-none">HTNS그룹 인력 현황</h2>
              <p className="text-xs text-slate-500 mt-0.5">HTNS Group Manpower Status 2025.May</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm border border-slate-200">
              <span className="text-2xl font-bold text-slate-900 leading-none">1,824</span>
              <span className="text-base text-slate-600">명</span>
              <span className="text-sm font-medium text-emerald-600 ml-1.5">▲ 8명</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3 mt-3">
            <div className="relative bg-white/60 rounded-lg p-2 shadow-sm border border-slate-200">
              <div className="absolute -top-2 left-0 w-full h-0.5 bg-blue-500/70 rounded-full"></div>
              <div>
                <div className="text-sm font-medium text-slate-600 leading-none mb-1">본사</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-900 leading-none">163</span>
                  <span className="text-sm text-slate-600">명</span>
                  <span className="text-xs font-medium text-emerald-600 ml-1">▲ 2명</span>
                </div>
              </div>
            </div>

            <div className="relative bg-white/60 rounded-lg p-2 shadow-sm border border-slate-200">
              <div className="absolute -top-2 left-0 w-full h-0.5 bg-indigo-500/70 rounded-full"></div>
              <div>
                <div className="text-sm font-medium text-slate-600 leading-none mb-1">국내자회사</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-900 leading-none">743</span>
                  <span className="text-sm text-slate-600">명</span>
                  <span className="text-xs font-medium text-emerald-600 ml-1">▲ 4명</span>
                </div>
              </div>
            </div>

            <div className="relative bg-white/60 rounded-lg p-2 shadow-sm border border-slate-200">
              <div className="absolute -top-2 left-0 w-full h-0.5 bg-violet-500/70 rounded-full"></div>
              <div>
                <div className="text-sm font-medium text-slate-600 leading-none mb-1">해외자회사</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-900 leading-none">918</span>
                  <span className="text-sm text-slate-600">명</span>
                  <span className="text-xs font-medium text-emerald-600 ml-1">▲ 2명</span>
                </div>
              </div>
            </div>

            <div className="relative bg-white/60 rounded-lg p-2 shadow-sm border border-slate-200">
              <div className="absolute -top-2 left-0 w-full h-0.5 bg-slate-400/70 rounded-full"></div>
              <div>
                <div className="text-sm font-medium text-slate-600 leading-none mb-1">해외 현지인 비율</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-900 leading-none">50.3</span>
                  <span className="text-sm text-slate-600">%</span>
                  <span className="text-xs text-slate-500 ml-1">918명 중 494명</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 테이블 섹션 */}
      <Card className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4">
          <table className="w-full border-collapse border border-slate-200">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2 px-3 text-left font-semibold text-gray-600 bg-blue-100/50 border-r border-slate-200" rowSpan={3}>구분</th>
                <th className="py-2 px-3 text-left font-semibold text-gray-600 bg-blue-100/50 border-r border-slate-200" rowSpan={3}>법인명</th>
                <th className="py-2 px-3 text-center font-semibold text-gray-800 bg-blue-100/50 border-r border-slate-200" colSpan={8}>2024년</th>
                <th className="py-2 px-3 text-center font-semibold text-gray-800 bg-emerald-100/50 border-r border-slate-200" colSpan={2}>2025년 현재</th>
                <th className="py-2 px-3 text-center font-semibold text-gray-800 bg-violet-100/50 border-r border-slate-200" colSpan={2}>현황</th>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap" colSpan={2}>1분기</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap" colSpan={2}>2분기</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap" colSpan={2}>3분기</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap" colSpan={2}>4분기</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-emerald-100/50 border-r border-slate-200 whitespace-nowrap" rowSpan={2}>현지인</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-emerald-100/50 border-r border-slate-200 whitespace-nowrap" rowSpan={2}>한국인</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-violet-100/50 border-r border-slate-200 whitespace-nowrap" rowSpan={2}>소계</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-violet-100/50 border-r border-slate-200 whitespace-nowrap" rowSpan={2}>전월 대비</th>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap">현지인</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap">한국인</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap">현지인</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap">한국인</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap">현지인</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap">한국인</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap">현지인</th>
                <th className="py-2 px-4 text-center font-medium text-gray-600 bg-blue-100/50 border-r border-slate-200 whitespace-nowrap">한국인</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* 국내 섹션 */}
              <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                <td className="py-2 px-3 font-semibold text-slate-700 bg-blue-50/30 border-r border-slate-200" rowSpan={6}>국내</td>
                <td className="py-2 px-3 whitespace-nowrap border-r border-slate-200">하나로TNS</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">150</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">35</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">140</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">34</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">145</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">33</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">142</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">33</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">0</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">0</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">163</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200 text-red-500">▲ 2</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50/50">
                <td className="py-2.5 px-3 font-medium text-gray-700">하나로S</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-l-2 border-gray-200">180</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30">45</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30">175</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30">45</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30">140</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30">37</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30">138</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r-2 border-gray-200">35</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30">0</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30 border-r-2 border-gray-200">105</td>
                <td className="py-2.5 px-3 text-right bg-violet-50/30">105</td>
                <td className="py-2.5 px-3 text-right bg-violet-50/30 text-red-600">▲ 8</td>
              </tr>
              <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                <td className="py-2 px-3 whitespace-nowrap border-r border-slate-200">하나로넷</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">420</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">102</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">420</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">102</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">423</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">102</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">423</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">102</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">0</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">509</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">509</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200 text-blue-500">▼ 1</td>
              </tr>
              <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                <td className="py-2 px-3 whitespace-nowrap border-r border-slate-200">하나로에이치</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">95</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">22</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">98</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">22</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">97</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">22</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">99</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">22</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">0</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">129</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">129</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200 text-blue-500">▼ 2</td>
              </tr>
              <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                <td className="py-2 px-3 whitespace-nowrap border-r border-slate-200">하나로인터내셔널</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">2</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">1</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">2</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">1</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">1</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">1</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">1</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">1</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">0</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">0</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">0</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200 text-blue-500">▼ 1</td>
              </tr>
              <tr className="border-b-2 border-gray-200 bg-gray-50/50">
                <td className="py-2.5 px-3 font-bold text-gray-800">소계</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-l-2 border-gray-200 font-bold text-gray-800">847</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 font-bold text-gray-800">205</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 font-bold text-gray-800">835</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 font-bold text-gray-800">204</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 font-bold text-gray-800">806</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 font-bold text-gray-800">195</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 font-bold text-gray-800">803</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r-2 border-gray-200 font-bold text-gray-800">193</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30 font-bold text-gray-800">0</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30 border-r-2 border-gray-200 font-bold text-gray-800">906</td>
                <td className="py-2.5 px-3 text-right bg-violet-50/30 font-bold text-gray-800">906</td>
                <td className="py-2.5 px-3 text-right bg-violet-50/30 font-bold text-red-600">▲ 6</td>
              </tr>

              {/* 해외 섹션 */}
              <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                <td className="py-2 px-3 font-semibold text-slate-700 bg-emerald-50/30 border-r border-slate-200" rowSpan={5}>해외</td>
                <td className="py-2 px-3 whitespace-nowrap border-r border-slate-200">중국</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">350</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">20</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">351</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">20</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">357</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">20</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">345</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">20</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">349</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">349</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">361</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">0</td>
              </tr>
              <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                <td className="py-2 px-3 whitespace-nowrap border-r border-slate-200">유럽</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">158</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">10</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">153</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">10</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">151</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">10</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">158</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">10</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">116</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">171</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">171</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200 text-red-600">▲ 2</td>
              </tr>
              <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                <td className="py-2 px-3 whitespace-nowrap border-r border-slate-200">아시아</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">387</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">20</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">380</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">20</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">366</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">20</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">358</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">20</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">27</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">363</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">363</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200 text-red-600">▲ 1</td>
              </tr>
              <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                <td className="py-2 px-3 whitespace-nowrap border-r border-slate-200">기타 (중동+미국)</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">25</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">3</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">24</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">3</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">23</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">3</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">23</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">3</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">2</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">23</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200">23</td>
                <td className="py-2 px-4 text-right whitespace-nowrap border-r border-slate-200 text-blue-600">▼ 1</td>
              </tr>
              <tr className="border-b-2 border-slate-200 bg-gray-50/50">
                <td className="py-2.5 px-3 font-bold text-gray-800 border-r border-slate-200">소계</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">920</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">53</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">908</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">53</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">897</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">53</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">884</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">53</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30 border-r border-slate-200 font-bold text-gray-800">494</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30 border-r border-slate-200 font-bold text-gray-800">918</td>
                <td className="py-2.5 px-3 text-right bg-violet-50/30 border-r border-slate-200 font-bold text-gray-800">918</td>
                <td className="py-2.5 px-3 text-right bg-violet-50/30 border-r border-slate-200 font-bold text-red-600">▲ 2</td>
              </tr>

              {/* 총계 */}
              <tr className="bg-gray-50/50">
                <td className="py-2.5 px-3 font-bold text-gray-800 border-r border-slate-200" colSpan={2}>총계</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">1,767</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">258</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">1,743</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">257</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">1,703</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">248</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">1,687</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r border-slate-200 font-bold text-gray-800">246</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30 border-r border-slate-200 font-bold text-gray-800">494</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30 border-r border-slate-200 font-bold text-gray-800">494</td>
                <td className="py-2.5 px-3 text-right bg-violet-50/30 border-r border-slate-200 font-bold text-gray-800">1,824</td>
                <td className="py-2.5 px-3 text-right bg-violet-50/30 border-r border-slate-200 font-bold text-red-600">▲ 8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 