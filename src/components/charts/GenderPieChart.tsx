import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export function GenderPieChart() {
  const data = {
    labels: ['남성', '여성'],
    datasets: [
      {
        data: [72, 48],
        backgroundColor: ['#3b82f6', '#f472b6'],
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
          <UserPlus className="h-4 w-4 mr-2 text-purple-500" />
          성별 분포
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px]">
          <Pie data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
} 