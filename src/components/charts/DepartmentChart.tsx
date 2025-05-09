import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export function DepartmentChart() {
  const data = {
    labels: ['영업부', '기술부', '연구개발', '경영지원', '인사부', '기타'],
    datasets: [
      {
        data: [42, 23, 18, 15, 10, 12],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#8b5cf6',
          '#f59e0b',
          '#ef4444',
          '#6b7280'
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label: string, i: number) => {
              const value = datasets[0].data[i];
              const percentage = Math.round((value / 120) * 100);
              return {
                text: `${label} (${value}명, ${percentage}%)`,
                fillStyle: datasets[0].backgroundColor[i],
                hidden: false,
                lineCap: 'butt',
                lineDash: [],
                lineDashOffset: 0,
                lineJoin: 'miter',
                lineWidth: 1,
                strokeStyle: datasets[0].backgroundColor[i],
                pointStyle: 'circle',
                rotation: 0
              };
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = Math.round((value / 120) * 100);
            return `${value}명 (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
        <CardTitle className="text-sm font-medium flex items-center">
          <Users className="h-4 w-4 mr-2 text-blue-500" />
          부서별 인원 분포
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px]">
          <Doughnut data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
} 