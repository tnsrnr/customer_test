import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function SalesTrendChart() {
  const data = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'],
    datasets: [
      {
        label: '매출',
        data: [12.5, 13.2, 14.5, 15.8, 16.2, 15.5, 16.8, 17.2, 16.5, 18.0],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: '매입',
        data: [8.2, 8.5, 9.0, 9.5, 10.0, 9.8, 10.2, 10.5, 10.0, 10.8],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: '이익률',
        data: [34.2, 35.6, 37.9, 39.2, 38.2, 36.8, 39.3, 38.9, 39.2, 40.0],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        borderDash: [5, 5],
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label;
            const value = context.raw;
            const unit = label === '이익률' ? '%' : '억원';
            return `${label}: ${value}${unit}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            return `${value}억원`;
          }
        }
      },
      y1: {
        position: 'right' as const,
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            return `${value}%`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-sm font-medium flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
          월별 매출/이익 추이
        </h3>
        <Badge className="bg-slate-100 text-slate-700 px-1.5 text-xs">최근 10개월</Badge>
      </div>
      <div className="p-4">
        <div className="h-[300px]">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
} 