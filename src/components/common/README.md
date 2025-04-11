# 공통 컴포넌트

## TabulatorGrid

TabulatorGrid는 [Tabulator](http://tabulator.info/) 라이브러리를 기반으로 한 재사용 가능한 데이터 테이블 컴포넌트입니다. 이 컴포넌트는 셀 선택, 복사, 편집 등 다양한 기능을 제공합니다.

### 설치

TabulatorGrid는 `tabulator-tables` 라이브러리를 사용합니다. 해당 라이브러리가 설치되어 있지 않다면 다음 명령어로 설치하세요:

```bash
npm install tabulator-tables
```

### 기본 사용법

```tsx
import TabulatorGrid, { TabulatorGridRef } from '@/components/common/TabulatorGrid';
import { useRef } from 'react';

export default function MyComponent() {
  const gridRef = useRef<TabulatorGridRef>(null);
  
  const data = [
    { id: 1, name: "김철수", department: "개발팀" },
    { id: 2, name: "이영희", department: "디자인팀" },
    // ...
  ];
  
  const columns = [
    { title: "ID", field: "id", sorter: "number" },
    { title: "이름", field: "name", sorter: "string" },
    { title: "부서", field: "department", sorter: "string" },
  ];
  
  return (
    <div>
      <TabulatorGrid
        data={data}
        columns={columns}
        height="400px"
        pagination={true}
        paginationSize={10}
      />
    </div>
  );
}
```

### Props

TabulatorGrid 컴포넌트는 다음 props를 지원합니다:

#### 필수 Props

| Prop | 타입 | 설명 |
|------|------|------|
| `data` | `any[]` | 테이블에 표시할 데이터 배열 |
| `columns` | `ColumnDefinition[]` | 컬럼 정의 배열 |

#### 선택적 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `height` | `string \| number` | `"500px"` | 테이블 높이 |
| `layout` | `string` | `"fitColumns"` | 컬럼 레이아웃 방식 |
| `pagination` | `boolean` | `false` | 페이지네이션 사용 여부 |
| `paginationSize` | `number` | `10` | 페이지당 행 수 |
| `paginationSizeSelector` | `number[]` | `[5, 10, 20, 50, 100]` | 페이지 크기 선택 옵션 |
| `selectable` | `boolean` | `false` | 셀/행 선택 가능 여부 |
| `selectableRange` | `boolean` | `false` | 범위 선택 가능 여부 |
| `selectableRangeColumns` | `boolean` | `false` | 열 범위 선택 가능 여부 |
| `selectableRangeRows` | `boolean` | `false` | 행 범위 선택 가능 여부 |
| `selectableRangeClearCells` | `boolean` | `true` | 셀 범위 선택 초기화 가능 여부 |
| `enableClipboard` | `boolean` | `false` | 클립보드 기능 활성화 여부 |
| `clipboardCopyStyled` | `boolean` | `false` | 스타일이 포함된 복사 여부 |
| `editable` | `boolean` | `false` | 셀 편집 가능 여부 |
| `showCopyButton` | `boolean` | `false` | 복사 버튼 표시 여부 |
| `showSelectionButtons` | `boolean` | `false` | 선택 버튼 표시 여부 |
| `onCellSelectionChanged` | `(message: string) => void` | - | 셀 선택 변경 시 호출되는 함수 |
| `onClipboardCopied` | `(message: string) => void` | - | 클립보드 복사 시 호출되는 함수 |
| `additionalOptions` | `Record<string, any>` | `{}` | 추가 Tabulator 옵션 |

### Ref API

TabulatorGrid 컴포넌트는 다음 메서드를 포함하는 ref를 제공합니다:

```tsx
export interface TabulatorGridRef {
  getTable: () => Tabulator | null;
  clearSelection: () => void;
  copySelection: () => void;
}
```

| 메서드 | 설명 |
|--------|------|
| `getTable()` | Tabulator 인스턴스 반환 |
| `clearSelection()` | 현재 선택된 셀/행 선택 해제 |
| `copySelection()` | 선택된 영역을 클립보드에 복사 |

### 예제

#### 셀 선택 및 복사 기능이 있는 테이블

```tsx
import { useRef } from 'react';
import TabulatorGrid, { TabulatorGridRef } from '@/components/common/TabulatorGrid';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Example() {
  const gridRef = useRef<TabulatorGridRef>(null);
  const { toast } = useToast();
  
  const handleCellSelectionChanged = (message: string) => {
    toast({
      title: "선택 알림",
      description: message,
    });
  };
  
  const handleClipboardCopied = (message: string) => {
    toast({
      title: "복사 완료",
      description: message,
    });
  };
  
  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button 
          onClick={() => gridRef.current?.copySelection()} 
          size="sm"
        >
          선택 영역 복사
        </Button>
        <Button 
          onClick={() => gridRef.current?.clearSelection()} 
          size="sm" 
          variant="outline"
        >
          선택 초기화
        </Button>
      </div>
      
      <TabulatorGrid
        ref={gridRef}
        data={data}
        columns={columns}
        height="500px"
        pagination={true}
        selectable={true}
        selectableRange={true}
        selectableRangeColumns={true}
        selectableRangeRows={true}
        enableClipboard={true}
        onCellSelectionChanged={handleCellSelectionChanged}
        onClipboardCopied={handleClipboardCopied}
      />
    </div>
  );
} 