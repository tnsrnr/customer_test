'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  comments: number;
  likes: number;
}

// 더미 데이터
const dummyProducts: Product[] = [
  {
    id: 1,
    name: "프리미엄 노트북",
    description: "고성능 프로세서와 넉넉한 메모리의 프리미엄 노트북입니다.",
    price: 1200000,
    category: "전자기기",
    imageUrl: "https://placehold.co/80",
    stock: 15
  },
  {
    id: 2,
    name: "무선 이어폰",
    description: "고음질 무선 이어폰으로 자유로운 음악 감상이 가능합니다.",
    price: 150000,
    category: "전자기기",
    imageUrl: "https://placehold.co/80",
    stock: 42
  },
  {
    id: 3,
    name: "스마트 워치",
    description: "건강 관리와 알림 확인이 가능한 스마트 워치입니다.",
    price: 250000,
    category: "전자기기",
    imageUrl: "https://placehold.co/80",
    stock: 28
  },
  {
    id: 4,
    name: "블루투스 스피커",
    description: "풍부한 사운드와 휴대성을 갖춘 블루투스 스피커입니다.",
    price: 80000,
    category: "전자기기",
    imageUrl: "https://placehold.co/80",
    stock: 37
  }
];

const dummyPosts: Post[] = [
  {
    id: 1,
    title: "Next.js 14 릴리즈 소식",
    content: "Next.js 14가 출시되었습니다. 주요 기능 변경 사항과 개선점을 살펴봅니다.",
    author: {
      name: "김개발",
      avatar: "K"
    },
    date: "2023-04-15",
    comments: 24,
    likes: 108
  },
  {
    id: 2,
    title: "React 상태 관리의 현재와 미래",
    content: "React 생태계에서 사용되는 다양한 상태 관리 라이브러리들을 비교 분석합니다.",
    author: {
      name: "이프론트",
      avatar: "L"
    },
    date: "2023-04-12",
    comments: 18,
    likes: 87
  },
  {
    id: 3,
    title: "Tailwind CSS 실전 활용 팁",
    content: "Tailwind CSS를 효율적으로 사용하는 방법과 실전에서 유용한 팁을 소개합니다.",
    author: {
      name: "박디자인",
      avatar: "P"
    },
    date: "2023-04-10",
    comments: 31,
    likes: 125
  }
];

export default function SkeletonDemoPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    
    // 일부러 지연시간을 줘서 로딩 상태를 보여줌
    setTimeout(() => {
      setProducts(dummyProducts);
      setPosts(dummyPosts);
      setLoading(false);
    }, 1500);
  };

  const handleRefresh = () => {
    loadData();
    toast({
      title: "새로고침",
      description: "데이터를 다시 불러오는 중입니다.",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">로딩 상태 및 스켈레톤 UI 데모</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">
          로딩 상태를 시각적으로 표현하는 스켈레톤 UI 예제입니다.
        </p>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          새로고침
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="products">제품 목록</TabsTrigger>
          <TabsTrigger value="posts">게시글</TabsTrigger>
          <TabsTrigger value="cards">카드 UI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          {loading ? (
            // 제품 목록 스켈레톤 UI
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 border rounded-lg p-4">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <div className="flex items-center justify-between mt-4">
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-8 w-[70px] rounded-md" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            // 실제 제품 목록
            products.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 border rounded-lg p-4">
                <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="max-h-16 max-w-16"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="font-bold">{product.price.toLocaleString()}원</div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={product.stock > 10 ? "outline" : "destructive"}>
                        재고: {product.stock}
                      </Badge>
                      <Button size="sm">장바구니</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="posts" className="space-y-4">
          {loading ? (
            // 게시글 스켈레톤 UI
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                      <Skeleton className="h-6 w-[300px]" />
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-4 w-[120px]" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <div className="flex space-x-4">
                    <Skeleton className="h-5 w-[70px]" />
                    <Skeleton className="h-5 w-[70px]" />
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            // 실제 게시글 목록
            posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback>{post.author.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-500">{post.author.name}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{post.content}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span>댓글 {post.comments}</span>
                    </div>
                    <div className="flex items-center">
                      <span>좋아요 {post.likes}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="cards" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            // 카드 스켈레톤 UI
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader className="p-4 pb-2">
                  <Skeleton className="h-6 w-[140px] mb-1" />
                  <Skeleton className="h-4 w-[100px]" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-9 w-full rounded-md" />
                </CardFooter>
              </Card>
            ))
          ) : (
            // 다양한 크기와 내용의 카드 UI
            <>
              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-200" />
                <CardHeader>
                  <CardTitle>분석 대시보드</CardTitle>
                  <CardDescription>사용자 활동 요약</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">지난 30일간의 사용자 활동 데이터를 분석하고 인사이트를 얻으세요.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">대시보드 열기</Button>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-800 text-white flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-bold">프리미엄 구독</h3>
                    <p className="text-gray-300">월 29,000원</p>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>비즈니스 플랜</CardTitle>
                  <CardDescription>전문가용 기능 이용</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">고급 분석, 무제한 저장공간, 우선 지원 등 모든 기능을 활용하세요.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">자세히 알아보기</Button>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">🎉 이벤트</h3>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>봄맞이 프로모션</CardTitle>
                  <CardDescription>30% 할인 혜택</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">4월 한 달간 모든 신규 가입 고객에게 30% 할인 혜택을 드립니다.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                    지금 시작하기
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <RefreshCw className="h-16 w-16 text-gray-400" />
                </div>
                <CardHeader>
                  <CardTitle>시스템 업데이트</CardTitle>
                  <CardDescription>버전 2.5.0</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">새로운 기능과 성능 개선이 포함된 최신 업데이트가 준비되었습니다.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">업데이트 노트</Button>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="h-48 bg-green-50 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-5xl">📊</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>월간 보고서</CardTitle>
                  <CardDescription>4월 성과 요약</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">지난 달 성과 지표와 다음 달 예상 목표를 확인하세요.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">보고서 다운로드</Button>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="h-48 bg-yellow-50 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-5xl">🎓</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>온라인 강좌</CardTitle>
                  <CardDescription>UI/UX 디자인 마스터</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">전문가와 함께하는 4주 과정으로 실무 디자인 능력을 향상시키세요.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">수강 신청</Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 