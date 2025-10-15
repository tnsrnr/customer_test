# 📋 Menu 디렉토리 구조

이 디렉토리는 HTNS 대시보드의 모든 메뉴 페이지를 통합 관리합니다.

## 📁 파일 구조

```
src/app/menu/
├── README.md                           # 이 파일
├── management_performance/             # 경영실적 카테고리
│   ├── company_performance/            # 전사실적
│   ├── personnel/                      # 인원현황
│   ├── hq_performance/                 # 본사실적
│   ├── finance/                        # 재무현황
│   ├── division/                       # 부문별실적
│   ├── top_clients/                    # 상위거래처
│   └── domestic_subsidiaries/          # 국내자회사
├── performance_management/             # 실적관리 카테고리
│   ├── air/                           # 항공실적
│   ├── sea/                           # 해상실적
│   ├── warehouse/                     # 창고실적
│   ├── outsourcing/                   # 도급실적
│   ├── overseas_subsidiaries/         # 해외자회사
│   ├── domestic/                      # 국내
│   ├── test3/                         # 사업부
│   ├── test4/                         # 테4
│   ├── test5/                         # 테5
│   ├── test6/                         # 테6
│   └── performance/                   # 테7 (전체물동량현황)
└── sales_analysis_group/               # 영업실적분석 카테고리
    ├── company_visit_analysis/         # 업체방문분석
    └── company_visit_calendar/         # 업체방문캘린더
```

## 🎯 주요 기능

### 1. **중앙화된 메뉴 관리** (`menu-config.ts`)
- 모든 메뉴 항목의 중앙 집중식 관리
- 카테고리별 그룹화
- 아이콘 및 메타데이터 관리
- 경로 매핑 및 리다이렉트 설정

### 2. **카테고리별 구조화**
- **경영실적 (management_performance)**: 전사실적, 인원현황, 본사실적, 재무현황, 부문별실적, 상위거래처, 국내자회사
- **실적관리 (performance_management)**: 항공실적, 해상실적, 창고실적, 도급실적, 해외자회사, 국내, 사업부, 테4, 테5, 테6, 테7
- **영업실적분석 (sales_analysis_group)**: 업체방문분석, 업체방문캘린더

### 3. **자동 리다이렉트**
- 기존 경로(`/a01-company-performance`)에서 새 경로(`/menu/company-performance`)로 자동 리다이렉트
- 하위 호환성 보장

## 🔧 사용법

### 메뉴 항목 추가
```typescript
// src/app/menu/menu-config.ts
export const menuItems: MenuItem[] = [
  // 기존 항목들...
  { 
    name: '새로운 메뉴', 
    path: '/menu/new-menu', 
    icon: NewIcon,
    description: '새로운 메뉴 설명',
    category: 'new-category'
  }
];
```

### 메뉴 조회
```typescript
import { menuItems, getMenuByCategory, getMenuByPath } from '@/app/menu/menu-config';

// 모든 메뉴 가져오기
const allMenus = menuItems;

// 카테고리별 메뉴 가져오기
const performanceMenus = getMenuByCategory('performance');

// 경로로 메뉴 찾기
const menu = getMenuByPath('/menu/finance');
```

### 컴포넌트에서 사용
```typescript
import { menuItems } from '@/app/menu/menu-config';

export function NavigationMenu() {
  return (
    <nav>
      {menuItems.map((item) => (
        <Link key={item.path} href={item.path}>
          {item.icon && <item.icon />}
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
```

## 🛠️ 개발 가이드라인

### 1. **새 메뉴 페이지 추가**
1. `src/app/menu/` 하위에 새 디렉토리 생성
2. `page.tsx` 파일 생성
3. `menu-config.ts`에 메뉴 항목 추가
4. 필요한 경우 API 파일 추가

### 2. **메뉴 구조 변경**
- `menu-config.ts`에서 카테고리 및 순서 조정
- 아이콘 변경 시 Lucide React 아이콘 사용
- 경로 변경 시 리다이렉트 설정 확인

### 3. **권한 관리**
- 메뉴별 권한 설정은 각 페이지 컴포넌트에서 처리
- 사용자 역할에 따른 메뉴 표시/숨김 로직 구현

## 🔄 마이그레이션 히스토리

### 기존 구조 → 새 구조
```
# 경영실적 카테고리
/a01-company-performance → /menu/management_performance/company_performance
/a02-personnel → /menu/management_performance/personnel
/a03-hq-performance → /menu/management_performance/hq_performance
/a04-finance → /menu/management_performance/finance
/a05-division → /menu/management_performance/division
/a06-top-clients → /menu/management_performance/top_clients
/a11-domestic-subsidiaries → /menu/management_performance/domestic_subsidiaries

# 실적관리 카테고리
/a07-air → /menu/performance_management/air
/a08-sea → /menu/performance_management/sea
/a09-warehouse → /menu/performance_management/warehouse
/a10-outsourcing → /menu/performance_management/outsourcing
/a12-overseas-subsidiaries → /menu/performance_management/overseas_subsidiaries
/a15-domestic → /menu/performance_management/domestic
/a18-test3 → /menu/performance_management/test3
/a19-test4 → /menu/performance_management/test4
/a20-test5 → /menu/performance_management/test5
/a21-test6 → /menu/performance_management/test6
/a13-performance → /menu/performance_management/performance

# 영업실적분석 카테고리
/sales-analysis → /menu/sales_analysis_group/company_visit_analysis
/sales-calendar → /menu/sales_analysis_group/company_visit_calendar
```

## 📊 장점

1. **일관된 구조**: 모든 메뉴가 동일한 레벨에서 관리
2. **중앙화된 관리**: 메뉴 구조 변경 시 한 곳에서만 수정
3. **확장성**: 새로운 메뉴 추가가 용이
4. **유지보수성**: 코드 구조가 명확하고 이해하기 쉬움
5. **하위 호환성**: 기존 링크가 자동으로 새 경로로 리다이렉트

## 🎨 UI/UX 고려사항

- 모든 메뉴 페이지는 일관된 레이아웃 사용
- 반응형 디자인 적용
- 로딩 상태 및 에러 처리 구현
- 접근성 가이드라인 준수

이 구조를 통해 메뉴 관리가 훨씬 체계적이고 효율적으로 이루어집니다. 