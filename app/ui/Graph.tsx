"use client";

import { hourly } from "../lib/definitions";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Plugin,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export default function Graph({ hourly }: { hourly: hourly }) {
  // console.log(hourly);
  const slicedHourly = hourly.slice(0, 25);
  const tempertures: number[] = slicedHourly.map((h) => h.temp - 273.15);
  const icons = slicedHourly.map(
    (h) => `https://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`
  );

  const data = {
    labels: slicedHourly.map((h) => new Date(h.dt * 1000).getHours() + " 시"),
    datasets: [
      {
        label: "온도",
        data: tempertures,
        fill: true, // 영역 채우기
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0, // 곡선의 부드러움
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 0, // 위쪽 여백을 20px로 설정
        right: 0,
        bottom: 40,
        left: 0,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // x축 라벨 색상 변경
          weight: "bold", // x축 라벨 글꼴 두께 변경
        },
      },
      y: {
        ticks: {
          weight: "bold", // x축 라벨 글꼴 두께 변경
          color: "white",
        },
        min: Math.floor(Math.min(...tempertures) - 5),
        max: Math.ceil(Math.max(...tempertures) + 5),
      },
    },
    datalabels: {
      color: "white", // 데이터 값 색상 변경
      anchor: "end",
      align: "end",
    },
    plugins: {
      tooltip: {
        enabled: true, // 마우스 오버 시 툴팁 활성화
      },
      legend: {
        labels: {
          color: "white", // 범례 라벨 색상 변경
        },
        position: "top" as const,
      },
    },
  };

  const imageLabelPlugin: Plugin<"line"> = {
    id: "imageLabelPlugin",
    afterDraw: (chart: ChartJS) => {
      const ctx = chart.ctx;
      const labels = chart.config.data.labels as string[]; // labels의 타입을 string[]로 지정
      const labelImages = slicedHourly.map(
        (h) => `https://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`
      );

      labels.forEach((label: string, index: number) => {
        const meta = chart.getDatasetMeta(0);
        const x = meta.data[index].x;
        const y = chart.chartArea.bottom + 20; // x축 아래쪽에 이미지와 텍스트를 표시

        // 이미지 추가
        const img = new Image();
        img.src = labelImages[index];
        img.onload = () => {
          ctx.drawImage(img, x - 10, y, 30, 30); // 이미지 크기 설정
        };

        // // 텍스트 추가
        // ctx.font = "12px Arial";
        // ctx.fillStyle = "#000";
        // ctx.fillText(label, x - 10, y + 30); // 텍스트 위치 설정
      });
    },
  };

  return (
    <div className="w-full h-[400px] ">
      <Line data={data} options={options} plugins={[imageLabelPlugin]} />
    </div>
  );
}
