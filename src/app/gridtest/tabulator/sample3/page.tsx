'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import "tabulator-tables/dist/css/tabulator.min.css";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  lastUpdated: string;
}

export default function TabulatorEditingExample() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'lastUpdated'>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    rating: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 샘플 데이터
  const [data, setData] = useState<Product[]>([
    { id: 1, name: "스마트폰", category: "전자기기", price: 1200000, stock: 45, rating: 4.7, lastUpdated: "2023-09-15" },
    { id: 2, name: "무선 이어폰", category: "전자기기", price: 220000, stock: 78, rating: 4.5, lastUpdated: "2023-10-20" },
    { id: 3, name: "스마트워치", category: "전자기기", price: 350000, stock: 32, rating: 4.2, lastUpdated: "2023-08-05" },
    { id: 4, name: "노트북", category: "전자기기", price: 1850000, stock: 18, rating: 4.8, lastUpdated: "2023-07-12" },
    { id: 5, name: "블루투스 스피커", category: "전자기기", price: 85000, stock: 53, rating: 4.3, lastUpdated: "2023-11-01" },
    { id: 6, name: "커피머신", category: "주방가전", price: 450000, stock: 22, rating: 4.6, lastUpdated: "2023-10-05" },
    { id: 7, name: "에어프라이어", category: "주방가전", price: 130000, stock: 67, rating: 4.4, lastUpdated: "2023-09-25" },
    { id: 8, name: "전기밥솥", category: "주방가전", price: 95000, stock: 41, rating: 4.2, lastUpdated: "2023-11-10" },
    { id: 9, name: "청소기", category: "가전제품", price: 320000, stock: 29, rating: 4.5, lastUpdated: "2023-08-18" },
    { id: 10, name: "공기청정기", category: "가전제품", price: 380000, stock: 34, rating: 4.7, lastUpdated: "2023-07-30" },
  ]);

  useEffect(() => {
    if (tableRef.current) {
      // 테이블 초기화
      const table = new Tabulator(tableRef.current, {
        data: data,
        layout: "fitColumns",
        pagination: true,
        paginationSize: 5,
        selectable: true,
        selectableRangeMode: "click",
        columns: [
          { title: "ID", field: "id", sorter: "number", width: 70, headerSort: true },
          { 
            title: "상품명", 
            field: "name", 
            editor: "input",
            validator: ["required", "string"],
            sorter: "string",
            headerFilter: "input",
            headerFilterLiveFilter: true
          },
          { 
            title: "카테고리", 
            field: "category", 
            editor: "list",
            editorParams: {
              values: ["전자기기", "주방가전", "가전제품", "컴퓨터", "기타"]
            },
            headerFilter: "list",
            headerFilterParams: {
              values: ["전자기기", "주방가전", "가전제품", "컴퓨터", "기타"]
            }
          },
          { 
            title: "가격", 
            field: "price", 
            editor: "number",
            validator: ["required", "min:0"],
            sorter: "number",
            formatter: "money",
            formatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            },
          },
          { 
            title: "재고", 
            field: "stock", 
            editor: "number",
            validator: ["required", "integer", "min:0"],
            sorter: "number",
          },
          { 
            title: "평점", 
            field: "rating", 
            editor: "number",
            editorParams: {
              min: 0,
              max: 5,
              step: 0.1
            },
            formatter: "star",
            formatterParams: {
              stars: 5
            },
            sorter: "number",
          },
          { 
            title: "최종 수정일", 
            field: "lastUpdated", 
            sorter: "date"
          },
        ],
        cellEdited: function(cell) {
          // 셀 편집 시 최종 수정일 업데이트
          const row = cell.getRow();
          const rowData = row.getData();
          
          const today = new Date();
          const formattedDate = today.toISOString().split('T')[0];
          
          row.update({lastUpdated: formattedDate});
          
          // 데이터 상태 업데이트
          setData(prev => {
            const newData = [...prev];
            const index = newData.findIndex(item => item.id === rowData.id);
            if (index !== -1) {
              newData[index] = {...rowData, lastUpdated: formattedDate};
            }
            return newData;
          });
          
          toast.success("데이터가 업데이트 되었습니다.");
        },
        rowSelectionChanged: function(data, rows) {
          setSelectedRows(data);
        }
      });
      
      setTabulator(table);
    }
    
    return () => {
      tabulator?.destroy();
    };
  }, [data]);

  // 데이터 저장 처리
  const handleSave = () => {
    toast.success("모든 변경사항이 저장되었습니다.");
    console.log("현재 데이터:", data);
  };

  // 행 추가 처리
  const handleAddRow = () => {
    // 폼 유효성 검사
    if (!newProduct.name) {
      toast.error("상품명은 필수입니다.");
      return;
    }
    
    if (newProduct.price < 0) {
      toast.error("가격은 0 이상이어야 합니다.");
      return;
    }
    
    if (newProduct.stock < 0) {
      toast.error("재고는 0 이상이어야 합니다.");
      return;
    }
    
    if (newProduct.rating < 0 || newProduct.rating > 5) {
      toast.error("평점은 0에서 5 사이여야 합니다.");
      return;
    }
    
    // 신규 ID 생성 (기존 최대 ID + 1)
    const newId = Math.max(...data.map(item => item.id), 0) + 1;
    
    // 현재 날짜
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // 새 상품 객체 생성
    const newItem: Product = {
      id: newId,
      ...newProduct,
      lastUpdated: formattedDate
    };
    
    // 데이터 추가
    setData(prev => [...prev, newItem]);
    
    // 입력 폼 초기화
    setNewProduct({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      rating: 0,
    });
    
    // 다이얼로그 닫기
    setIsDialogOpen(false);
    
    toast.success("새 상품이 추가되었습니다.");
  };

  // 선택된 행 삭제 처리
  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      toast.error("삭제할 항목을 선택해주세요.");
      return;
    }
    
    const selectedIds = selectedRows.map(row => row.id);
    
    // 데이터에서 선택된 행 제거
    setData(prev => prev.filter(item => !selectedIds.includes(item.id)));
    
    // 선택 상태 초기화
    setSelectedRows([]);
    
    toast.success(`${selectedRows.length}개 항목이 삭제되었습니다.`);
  };

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 숫자 필드는 숫자로 변환
    if (name === 'price' || name === 'stock' || name === 'rating') {
      setNewProduct(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">편집 가능한 테이블</h1>
          <p className="text-gray-500 mt-1">셀 편집 및 행 추가/삭제 기능을 갖춘 Tabulator 예제입니다.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    상품 추가
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>새 상품 추가</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid w-full items-center gap-2">
                      <Label htmlFor="name">상품명</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={newProduct.name} 
                        onChange={handleInputChange} 
                        placeholder="상품명 입력" 
                      />
                    </div>
                    <div className="grid w-full items-center gap-2">
                      <Label htmlFor="category">카테고리</Label>
                      <Input 
                        id="category" 
                        name="category" 
                        value={newProduct.category} 
                        onChange={handleInputChange} 
                        placeholder="카테고리 입력" 
                      />
                    </div>
                    <div className="grid w-full items-center gap-2">
                      <Label htmlFor="price">가격</Label>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        value={newProduct.price} 
                        onChange={handleInputChange} 
                        min="0" 
                      />
                    </div>
                    <div className="grid w-full items-center gap-2">
                      <Label htmlFor="stock">재고</Label>
                      <Input 
                        id="stock" 
                        name="stock" 
                        type="number" 
                        value={newProduct.stock} 
                        onChange={handleInputChange} 
                        min="0" 
                      />
                    </div>
                    <div className="grid w-full items-center gap-2">
                      <Label htmlFor="rating">평점 (0-5)</Label>
                      <Input 
                        id="rating" 
                        name="rating" 
                        type="number" 
                        value={newProduct.rating} 
                        onChange={handleInputChange} 
                        min="0" 
                        max="5" 
                        step="0.1" 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">취소</Button>
                    </DialogClose>
                    <Button onClick={handleAddRow}>추가</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="destructive" onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
                <Trash2 className="h-4 w-4 mr-2" />
                선택 삭제 ({selectedRows.length})
              </Button>
            </div>
            
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              변경사항 저장
            </Button>
          </div>
          
          <div ref={tableRef} className="w-full"></div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>* 셀을 더블 클릭하여 직접 편집할 수 있습니다.</p>
            <p>* 여러 행을 선택하려면 Ctrl 또는 Shift 키를 누른 상태에서 클릭하세요.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 