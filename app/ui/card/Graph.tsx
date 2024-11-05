import { hourly } from "../../lib/definitions";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useData } from "../../lib/store/store";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function Graph() {
  const { infos } = useData();
  const slicedHourly = infos?.weather.hourly.slice(0, 25);
  const tempertures: number[] | undefined = slicedHourly?.map(
    (h) => h.temp - 273.15
  );

  if (!tempertures) return null;

  const data = {
    labels: slicedHourly?.map((h) => new Date(h.dt * 1000).getHours() + " 시"),
    datasets: [
      {
        label: "현재부터 24시간 날씨",
        data: tempertures,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 0,
        right: 0,
        bottom: 40,
        left: 0,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
          weight: "bold",
        },
      },
      y: {
        ticks: {
          color: "white",
          weight: "bold",
        },
        min: Math.floor(Math.min(...tempertures) - 5),
        max: Math.ceil(Math.max(...tempertures) + 5),
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        labels: {
          color: "white",
        },
        position: "top" as const,
      },
      datalabels: {
        color: "white",
        align: "end" as const, // align 속성 수정
        anchor: "end" as const, // anchor 속성 수정
        formatter: (value: number) => value.toFixed(1) + "°C",
      },
    },
  };

  const imageLabelPlugin: Plugin<"line"> = {
    id: "imageLabelPlugin",
    afterDraw: (chart: ChartJS) => {
      const ctx = chart.ctx;
      const labels = chart.config.data.labels as string[];
      const labelImages = slicedHourly?.map(
        (h) => `https://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`
      );
      if (!labelImages) return;
      labels.forEach((label: string, index: number) => {
        const meta = chart.getDatasetMeta(0);
        const x = meta.data[index].x;
        const y = chart.chartArea.bottom + 20;

        const img = new Image();
        img.src = labelImages[index];
        img.onload = () => {
          ctx.drawImage(img, x - 10, y, 30, 30);
        };
      });
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line
        data={data}
        options={options}
        plugins={[ChartDataLabels, imageLabelPlugin]}
      />
    </div>
  );
}
