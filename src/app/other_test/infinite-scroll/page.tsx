'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChevronDown, MessageSquare, Heart, Share2 } from 'lucide-react';

// 포스트 타입 정의
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  userName: string;
  userAvatar: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
}

export default function InfiniteScrollDemo() {
  // 포스트 목록 상태
  const [posts, setPosts] = useState<Post[]>([]);
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  // 현재 페이지
  const [page, setPage] = useState(1);
  // 다음 페이지가 있는지 여부
  const [hasMore, setHasMore] = useState(true);
  // 관찰 대상 요소 참조
  const observerRef = useRef<IntersectionObserver | null>(null);
  // 감시할 마지막 요소
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  // 이름 목록 (더미 데이터 생성용)
  const koreanNames = ['김민준', '이지우', '박서연', '정도윤', '최예은', '강지훈', '윤서현', '임하준', '한소율', '송민서'];
  
  // 랜덤 태그 목록 (더미 데이터 생성용)
  const tags = ['개발', '디자인', '여행', '음식', '운동', '영화', '음악', '독서', '게임', '취미'];

  // 포스트 데이터 생성 (실제로는 API에서 가져옴)
  const generatePosts = useCallback((page: number, limit: number = 5): Post[] => {
    const startIndex = (page - 1) * limit + 1;
    
    return Array.from({ length: limit }, (_, i) => {
      const id = startIndex + i;
      const userId = (id % 10) + 1;
      const randomName = koreanNames[userId - 1];
      const randomTags = Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => tags[Math.floor(Math.random() * tags.length)]
      );
      
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
      
      return {
        id,
        title: `게시물 제목 ${id} - 흥미로운 내용이 가득합니다`,
        body: `이것은 게시물 ${id}의 내용입니다. 실제 서비스에서는 훨씬 더 긴 내용이 들어갑니다. 무한 스크롤 구현의 데모를 위한 임시 콘텐츠입니다. 스크롤을 내리면 자동으로 더 많은 콘텐츠가 로드됩니다.`,
        userId,
        userName: randomName,
        userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomName}`,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        tags: randomTags,
        createdAt: createdDate.toISOString(),
      };
    });
  }, []);

  // 포스트 불러오기 함수
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    
    try {
      // 실제 API 호출 대신 더미 데이터 생성
      // 실제 프로젝트에서는 axios나 fetch를 사용하여 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 마지막 페이지 시뮬레이션 (10페이지 이후 데이터 없음)
      if (page > 10) {
        setHasMore(false);
        return;
      }
      
      const newPosts = generatePosts(page);
      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('포스트를 불러오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  }, [page, generatePosts]);

  // IntersectionObserver 설정
  useEffect(() => {
    // 기존 Observer 해제
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // 새로운 Observer 생성
    observerRef.current = new IntersectionObserver((entries) => {
      // 관찰 대상이 화면에 보이는지 확인
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchPosts();
      }
    }, {
      rootMargin: '200px', // 뷰포트 하단에서 100px 위에서 트리거
      threshold: 0.1
    });
    
    // 마지막 포스트 요소 관찰 시작
    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }
    
    // 컴포넌트 언마운트 시 Observer 해제
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, fetchPosts]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchPosts();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // 스켈레톤 UI
  const PostSkeleton = () => (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-[90%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/other_test">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">무한 스크롤 데모</h1>
          <p className="text-muted-foreground mt-1">스크롤하면 자동으로 콘텐츠를 더 불러오는 인터페이스</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* 포스트 목록 */}
        {posts.map((post, index) => {
          const isLastPost = index === posts.length - 1;
          
          return (
            <div 
              key={post.id} 
              ref={isLastPost ? lastPostRef : null}
            >
              <Card className="mb-6">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar>
                    <AvatarImage src={post.userAvatar} alt={post.userName} />
                    <AvatarFallback>{post.userName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{post.userName}</CardTitle>
                    <CardDescription>{formatDate(post.createdAt)}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <h3 className="font-medium text-lg mb-1">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{post.body}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Heart className="h-4 w-4 mr-2" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="h-4 w-4 mr-2" />
                      공유
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          );
        })}

        {/* 로딩 상태 */}
        {loading && (
          <div className="py-4">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )}

        {/* 더 이상 콘텐츠가 없는 경우 */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>모든 콘텐츠를 불러왔습니다</p>
          </div>
        )}

        {/* 수동으로 더 불러오기 버튼 */}
        {hasMore && posts.length > 0 && !loading && (
          <div className="flex justify-center py-4">
            <Button 
              variant="outline" 
              onClick={fetchPosts}
              className="flex items-center"
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              더 보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 