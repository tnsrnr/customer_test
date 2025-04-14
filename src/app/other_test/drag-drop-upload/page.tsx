'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, Image, Upload, X, Check, File, Trash2 } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { cn } from '@/lib/utils';

// 파일 타입 정의
interface FileWithPreview extends File {
  id: string;
  preview?: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export default function DragDropUploadDemo() {
  // 파일 목록 상태
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  // 드래그 오버 상태
  const [isDragging, setIsDragging] = useState(false);
  // 파일 입력 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 드래그 이벤트 처리
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // 파일 처리 함수
  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: FileWithPreview[] = Array.from(fileList).map(file => {
      // 고유 ID 생성
      const id = `${file.name}-${Date.now()}`;
      
      // 파일 객체 확장
      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id,
        progress: 0,
        status: 'uploading'
      });
      
      // 이미지 파일인 경우 미리보기 URL 생성
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      
      return fileWithPreview;
    });

    // 파일 상태 업데이트
    setFiles(prev => [...prev, ...newFiles]);
    
    // 모의 업로드 시작
    newFiles.forEach(file => simulateUpload(file.id));
  }, []);

  // 파일 드롭 처리
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const { files } = e.dataTransfer;
    processFiles(files);
  }, [processFiles]);

  // 파일 입력 변경 처리
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    processFiles(files);
    // 파일 입력 초기화 (같은 파일 재선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  // 파일 삭제 처리
  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => {
      // 파일 객체에서 미리보기 URL 해제
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      
      return prev.filter(file => file.id !== id);
    });
  }, []);

  // 파일 업로드 시뮬레이션 (실제로는 API 호출로 대체)
  const simulateUpload = useCallback((id: string) => {
    let progress = 0;
    // 타이머 ID 저장
    const timer = setInterval(() => {
      progress += 5;
      
      if (progress >= 100) {
        clearInterval(timer);
        setFiles(prev => 
          prev.map(file => 
            file.id === id 
              ? { ...file, progress: 100, status: 'success' } 
              : file
          )
        );
      } else {
        setFiles(prev => 
          prev.map(file => 
            file.id === id 
              ? { ...file, progress } 
              : file
          )
        );
      }
    }, 200);
    
    // 오류 시뮬레이션 (약 10% 확률로 업로드 실패)
    if (Math.random() < 0.1) {
      setTimeout(() => {
        clearInterval(timer);
        setFiles(prev => 
          prev.map(file => 
            file.id === id 
              ? { 
                  ...file, 
                  progress: 0, 
                  status: 'error', 
                  errorMessage: '업로드 중 오류가 발생했습니다.' 
                } 
              : file
          )
        );
      }, 2000);
    }
  }, []);

  // 모든 파일 지우기
  const handleClearAll = useCallback(() => {
    // 모든 미리보기 URL 해제
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    setFiles([]);
  }, [files]);

  // 드롭존 클릭 처리
  const handleDropzoneClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // 업로드 상태 요약
  const uploadSummary = useMemo(() => {
    const total = files.length;
    const successCount = files.filter(file => file.status === 'success').length;
    const errorCount = files.filter(file => file.status === 'error').length;
    const pendingCount = total - successCount - errorCount;
    
    return { total, successCount, errorCount, pendingCount };
  }, [files]);

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
          <h1 className="text-3xl font-bold">드래그 앤 드롭 업로드</h1>
          <p className="text-muted-foreground mt-1">파일을 끌어다 놓거나 클릭하여 선택할 수 있는 UI</p>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>파일 업로드</CardTitle>
          <CardDescription>
            파일을 아래 영역에 끌어다 놓거나 클릭하여 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 드롭존 */}
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer text-center",
              isDragging 
                ? "border-primary bg-primary/5" 
                : "border-gray-300 hover:border-primary hover:bg-gray-50 dark:border-gray-700 dark:hover:border-primary"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleDropzoneClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                파일을 여기에 끌어다 놓거나
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                PNG, JPG, GIF, PDF 및 기타 파일 형식 지원
              </p>
              <Button type="button" size="sm">
                파일 선택하기
              </Button>
            </div>
          </div>

          {/* 업로드 상태 표시 */}
          {files.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted p-4 flex items-center justify-between">
                <div className="text-sm">
                  총 {uploadSummary.total}개 파일 
                  {uploadSummary.successCount > 0 && (
                    <span className="text-green-500 ml-2">
                      (완료: {uploadSummary.successCount})
                    </span>
                  )}
                  {uploadSummary.errorCount > 0 && (
                    <span className="text-red-500 ml-2">
                      (실패: {uploadSummary.errorCount})
                    </span>
                  )}
                  {uploadSummary.pendingCount > 0 && (
                    <span className="text-yellow-500 ml-2">
                      (진행 중: {uploadSummary.pendingCount})
                    </span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearAll}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  모두 지우기
                </Button>
              </div>
              
              <div className="divide-y">
                {files.map(file => (
                  <div key={file.id} className="p-4 flex items-center">
                    <div className="mr-4 flex-shrink-0">
                      {file.preview ? (
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <img 
                            src={file.preview} 
                            alt={file.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : file.type.includes('image') ? (
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground mr-2">
                            {formatBytes(file.size)}
                          </span>
                          <Button
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleRemoveFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {file.status === 'uploading' ? (
                          <>
                            <Progress 
                              value={file.progress} 
                              className="h-2 flex-1 mr-2" 
                            />
                            <span className="text-xs text-muted-foreground">
                              {file.progress}%
                            </span>
                          </>
                        ) : file.status === 'success' ? (
                          <div className="flex items-center text-xs text-green-500">
                            <Check className="h-4 w-4 mr-1" />
                            업로드 완료
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-red-500">
                            <X className="h-4 w-4 mr-1" />
                            {file.errorMessage || '업로드 실패'}
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-6 px-2 text-xs"
                              onClick={() => simulateUpload(file.id)}
                            >
                              재시도
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between bg-muted/50 border-t">
          <p className="text-sm text-muted-foreground">최대 10MB까지 업로드 가능합니다.</p>
          <Button disabled={files.length === 0} variant="outline">
            업로드 완료
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 