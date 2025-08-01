'use client';

import { Card } from "@/components/card";
import { AuthGuard } from "@/components/auth-guard";
import { Users, TrendingUp, Building2, Factory, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

function PersonnelPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 고급스러운 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 h-[calc(100vh-64px)] p-4 space-y-4 overflow-hidden">
        {/* 통합된 상단 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 w-full mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center h-full">
              <div className="p-2.5 bg-white/10 rounded-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium text-blue-100">본사</span>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-white">163</span>
                    <span className="text-lg font-medium text-white ml-1">명</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-emerald-400 bg-emerald-800/20 px-3 py-1.5 rounded-full border border-emerald-600/20">▲ 2명</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center h-full">
              <div className="p-2.5 bg-white/10 rounded-lg">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium text-blue-100">국내자회사</span>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-white">743</span>
                    <span className="text-lg font-medium text-white ml-1">명</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-emerald-400 bg-emerald-800/20 px-3 py-1.5 rounded-full border border-emerald-600/20">▲ 4명</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center h-full">
              <div className="p-2.5 bg-white/10 rounded-lg">
                <Globe2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium text-blue-100">해외자회사</span>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-white">918</span>
                    <span className="text-lg font-medium text-white ml-1">명</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-emerald-400 bg-emerald-800/20 px-3 py-1.5 rounded-full border border-emerald-600/20">▲ 2명</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center h-full">
              <div className="p-2.5 bg-white/10 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium text-blue-100">해외 현지인 비율</span>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-white">50.3</span>
                    <span className="text-lg font-medium text-white ml-1">%</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-slate-300 bg-slate-700/20 px-3 py-1.5 rounded-full border border-slate-500/20">494명</span>
            </div>
          </motion.div>
        </div>

        {/* 테이블 섹션 */}
        <Card className="p-4 shadow-lg rounded-xl bg-white/5 backdrop-blur-md border border-white/10 h-[calc(100vh-18rem)]">
          <div className="overflow-x-auto overflow-y-auto h-full">
            <table className="w-full border-collapse border border-white/20">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-white/20">
                  <th className="py-2 px-3 text-left font-semibold text-white bg-white/15 border-r border-white/20" rowSpan={3}>구분</th>
                  <th className="py-2 px-3 text-left font-semibold text-white bg-white/15 border-r border-white/20" rowSpan={3}>법인명</th>
                  <th className="py-2 px-3 text-center font-semibold text-white bg-blue-500/40 border-r border-white/20" colSpan={8}>2024년</th>
                  <th className="py-2 px-3 text-center font-semibold text-white bg-emerald-500/40 border-r border-white/20" colSpan={2}>2025년 현재</th>
                  <th className="py-2 px-3 text-center font-semibold text-white bg-violet-500/40 border-r border-white/20" colSpan={2}>현황</th>
                </tr>
                <tr className="border-b border-white/20">
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap" colSpan={2}>1분기</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap" colSpan={2}>2분기</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap" colSpan={2}>3분기</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap" colSpan={2}>4분기</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap" rowSpan={2}>현지인</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap" rowSpan={2}>한국인</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap" rowSpan={2}>소계</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap" rowSpan={2}>전월 대비</th>
                </tr>
                <tr className="border-b border-white/20">
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap">현지인</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap">한국인</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap">현지인</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap">한국인</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap">현지인</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap">한국인</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap">현지인</th>
                  <th className="py-2 px-4 text-center font-medium text-white bg-white/15 border-r border-white/20 whitespace-nowrap">한국인</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {/* 국내 섹션 */}
                <tr className="hover:bg-white/5 border-b border-white/20">
                  <td className="py-2 px-3 font-semibold text-white bg-blue-500/25 border-r border-white/20" rowSpan={6}>국내</td>
                  <td className="py-2 px-3 whitespace-nowrap border-r border-white/20 text-white">하나로TNS</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">150</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">35</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">140</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">34</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">145</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">33</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">142</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">33</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">0</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">0</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">163</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-emerald-400">▲ 2</td>
                </tr>
                <tr className="border-b border-white/20 hover:bg-white/5">
                  <td className="py-2.5 px-3 font-medium text-white">하나로S</td>
                  <td className="py-2.5 px-3 text-right border-l-2 border-white/20 text-white">180</td>
                  <td className="py-2.5 px-3 text-right text-white">45</td>
                  <td className="py-2.5 px-3 text-right text-white">175</td>
                  <td className="py-2.5 px-3 text-right text-white">45</td>
                  <td className="py-2.5 px-3 text-right text-white">140</td>
                  <td className="py-2.5 px-3 text-right text-white">37</td>
                  <td className="py-2.5 px-3 text-right text-white">138</td>
                  <td className="py-2.5 px-3 text-right border-r-2 border-white/20 text-white">35</td>
                  <td className="py-2.5 px-3 text-right text-white">0</td>
                  <td className="py-2.5 px-3 text-right border-r-2 border-white/20 text-white">105</td>
                  <td className="py-2.5 px-3 text-right text-white">105</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">▲ 8</td>
                </tr>
                <tr className="hover:bg-white/5 border-b border-white/20">
                  <td className="py-2 px-3 whitespace-nowrap border-r border-white/20 text-white">하나로넷</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">420</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">102</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">420</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">102</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">423</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">102</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">423</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">102</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">0</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">509</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">509</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-blue-400">▼ 1</td>
                </tr>
                <tr className="hover:bg-white/5 border-b border-white/20">
                  <td className="py-2 px-3 whitespace-nowrap border-r border-white/20 text-white">하나로에이치</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">95</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">22</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">98</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">22</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">97</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">22</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">99</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">22</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">0</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">129</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">129</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-blue-400">▼ 2</td>
                </tr>
                <tr className="hover:bg-white/5 border-b border-white/20">
                  <td className="py-2 px-3 whitespace-nowrap border-r border-white/20 text-white">하나로인터내셔널</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">2</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">1</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">2</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">1</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">1</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">1</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">1</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">1</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">0</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">0</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">0</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-blue-400">▼ 1</td>
                </tr>
                <tr className="border-b-2 border-white/20 bg-white/5">
                  <td className="py-2.5 px-3 font-bold text-white border-r border-white/20">소계</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 border-l-2 border-white/20 font-bold text-white">847</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 font-bold text-white">205</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 font-bold text-white">835</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 font-bold text-white">204</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 font-bold text-white">806</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 font-bold text-white">195</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 font-bold text-white">803</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 border-r-2 border-white/20 font-bold text-white">193</td>
                  <td className="py-2.5 px-3 text-right bg-emerald-500/10 font-bold text-white">0</td>
                  <td className="py-2.5 px-3 text-right bg-emerald-500/10 border-r-2 border-white/20 font-bold text-white">906</td>
                  <td className="py-2.5 px-3 text-right bg-violet-500/10 font-bold text-white">906</td>
                  <td className="py-2.5 px-3 text-right bg-violet-500/10 font-bold text-emerald-400">▲ 6</td>
                </tr>

                {/* 해외 섹션 */}
                <tr className="hover:bg-white/5 border-b border-white/20">
                  <td className="py-2 px-3 font-semibold text-white bg-emerald-500/25 border-r border-white/20" rowSpan={5}>해외</td>
                  <td className="py-2 px-3 whitespace-nowrap border-r border-white/20 text-white">중국</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">350</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">20</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">351</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">20</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">357</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">20</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">345</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">20</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">349</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">349</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">361</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">0</td>
                </tr>
                <tr className="hover:bg-white/5 border-b border-white/20">
                  <td className="py-2 px-3 whitespace-nowrap border-r border-white/20 text-white">유럽</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">158</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">10</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">153</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">10</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">151</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">10</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">158</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">10</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">116</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">171</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">171</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-emerald-400">▲ 2</td>
                </tr>
                <tr className="hover:bg-white/5 border-b border-white/20">
                  <td className="py-2 px-3 whitespace-nowrap border-r border-white/20 text-white">아시아</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">387</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">20</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">380</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">20</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">366</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">20</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">358</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">20</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">27</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">363</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">363</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-emerald-400">▲ 1</td>
                </tr>
                <tr className="hover:bg-white/5 border-b border-white/20">
                  <td className="py-2 px-3 whitespace-nowrap border-r border-white/20 text-white">기타 (중동+미국)</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">25</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">3</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">24</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">3</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">23</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">3</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">23</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">3</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">2</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">23</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-white">23</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap border-r border-white/20 text-blue-400">▼ 1</td>
                </tr>
                <tr className="border-b-2 border-white/20 bg-white/5">
                  <td className="py-2.5 px-3 font-bold text-white border-r border-white/20">소계</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 border-r border-white/20 font-bold text-white">920</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 border-r border-white/20 font-bold text-white">53</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 border-r border-white/20 font-bold text-white">908</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 border-r border-white/20 font-bold text-white">53</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 border-r border-white/20 font-bold text-white">897</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 border-r border-white/20 font-bold text-white">53</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 border-r border-white/20 font-bold text-white">884</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/10 border-r border-white/20 font-bold text-white">53</td>
                  <td className="py-2.5 px-3 text-right bg-emerald-500/10 border-r border-white/20 font-bold text-white">494</td>
                  <td className="py-2.5 px-3 text-right bg-emerald-500/10 border-r border-white/20 font-bold text-white">918</td>
                  <td className="py-2.5 px-3 text-right bg-violet-500/10 border-r border-white/20 font-bold text-white">918</td>
                  <td className="py-2.5 px-3 text-right bg-violet-500/10 border-r border-white/20 font-bold text-emerald-400">▲ 2</td>
                </tr>

                {/* 총계 */}
                <tr className="bg-white/20 border-t-2 border-white/30">
                  <td className="py-2.5 px-3 font-bold text-white border-r border-white/20" colSpan={2}>총계</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/25 border-r border-white/20 font-bold text-white">1,767</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/25 border-r border-white/20 font-bold text-white">258</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/25 border-r border-white/20 font-bold text-white">1,743</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/25 border-r border-white/20 font-bold text-white">257</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/25 border-r border-white/20 font-bold text-white">1,703</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/25 border-r border-white/20 font-bold text-white">248</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/25 border-r border-white/20 font-bold text-white">1,687</td>
                  <td className="py-2.5 px-3 text-right bg-blue-500/25 border-r border-white/20 font-bold text-white">246</td>
                  <td className="py-2.5 px-3 text-right bg-emerald-500/25 border-r border-white/20 font-bold text-white">494</td>
                  <td className="py-2.5 px-3 text-right bg-emerald-500/25 border-r border-white/20 font-bold text-white">494</td>
                  <td className="py-2.5 px-3 text-right bg-violet-500/25 border-r border-white/20 font-bold text-white">1,824</td>
                  <td className="py-2.5 px-3 text-right bg-violet-500/25 border-r border-white/20 font-bold text-emerald-400">▲ 8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function PersonnelPage() {
  return (
    <AuthGuard>
      <PersonnelPageContent />
    </AuthGuard>
  );
} 