'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export default function ToastDemoPage() {
  const { toast } = useToast();

  const showDefaultToast = () => {
    toast({
      title: "알림",
      description: "기본 토스트 메시지입니다.",
    });
  };

  const showDestructiveToast = () => {
    toast({
      title: "오류",
      description: "문제가 발생했습니다.",
      variant: "destructive",
    });
  };

  const showActionToast = () => {
    toast({
      title: "새 메시지",
      description: "새로운 메시지가 도착했습니다.",
      action: (
        <ToastAction altText="확인" onClick={() => console.log("Action clicked")}>
          확인
        </ToastAction>
      ),
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">토스트 메시지 데모</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 토스트</CardTitle>
            <CardDescription>일반적인 알림용 토스트 메시지</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={showDefaultToast}>기본 토스트 표시</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>오류 토스트</CardTitle>
            <CardDescription>오류를 표시하는 토스트 메시지</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={showDestructiveToast} variant="destructive">오류 토스트 표시</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>액션 토스트</CardTitle>
            <CardDescription>사용자 액션이 가능한 토스트 메시지</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={showActionToast} variant="outline">액션 토스트 표시</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 