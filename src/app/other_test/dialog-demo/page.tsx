'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DialogDemoPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleSubmit = () => {
    if (username.trim()) {
      toast({
        title: "프로필 업데이트",
        description: `사용자 이름이 '${username}'(으)로 업데이트되었습니다.`,
      });
      setOpen(false);
    } else {
      toast({
        title: "오류",
        description: "사용자 이름을 입력해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    toast({
      title: "삭제 완료",
      description: "항목이 성공적으로 삭제되었습니다.",
      variant: "destructive",
    });
    setDeleteConfirmOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">다이얼로그/모달 데모</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 다이얼로그</CardTitle>
            <CardDescription>기본 다이얼로그 창 예제</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>기본 다이얼로그 열기</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>안내</DialogTitle>
                  <DialogDescription>
                    간단한 안내 메시지를 표시하는 다이얼로그입니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>모달 창을 통해 중요한 정보를 사용자에게 전달할 수 있습니다.</p>
                </div>
                <DialogFooter>
                  <Button type="submit">확인</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>입력 다이얼로그</CardTitle>
            <CardDescription>사용자 입력을 받는 다이얼로그 예제</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">프로필 수정</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>프로필 수정</DialogTitle>
                  <DialogDescription>
                    변경하려는 정보를 입력한 후 저장 버튼을 클릭하세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      이름
                    </Label>
                    <Input
                      id="name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      이메일
                    </Label>
                    <Input
                      id="email"
                      defaultValue="user@example.com"
                      className="col-span-3"
                      disabled
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmit}>저장</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>확인 다이얼로그</CardTitle>
            <CardDescription>중요한 작업 전 확인을 요청하는 다이얼로그</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">항목 삭제</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                  <DialogDescription>
                    이 작업은 되돌릴 수 없습니다. 선택한 항목이 시스템에서 영구적으로 삭제됩니다.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex space-x-2 justify-end">
                  <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                    취소
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    삭제
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 