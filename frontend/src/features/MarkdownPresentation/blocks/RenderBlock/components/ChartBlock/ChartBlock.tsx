import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Scatter,
} from "react-chartjs-2";
import { Box } from "@mui/material";
import { SlideBlock, Theme } from "../../../../../../shared/types";

// Регистрируем все элементы Chart.js
ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title
);

interface ChartBlockProps {
  chart: NonNullable<SlideBlock["chart"]>;
  theme: Theme;
}

const chartComponents = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  radar: Radar,
  polarArea: PolarArea,
  scatter: Scatter,
} as const;

const ChartBlock: React.FC<ChartBlockProps> = ({ chart, theme }) => {
  const { type, labels, values, title, colors } = chart;

  const bgColors = Array.isArray(colors)
    ? colors
    : labels.map(() => colors || theme.colors.heading);

  const data = {
    labels,
    datasets: [
      {
        label: title || "Данные",
        data: values,
        backgroundColor:
          type === "pie" || type === "doughnut" || type === "polarArea"
            ? bgColors
            : bgColors.map((c) => c + "99"),
        borderColor: bgColors,
        borderWidth: 2,
        fill: type === "line" || type === "radar",
        tension: 0.3,
      },
    ],
  };

  const textColor = theme.colors.paragraph;
  const fontFamily = theme.fonts.paragraph;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: textColor,
          font: {
            family: fontFamily,
            size: 14,
            weight: 400,
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        color: theme.colors.heading,
        font: {
          family: theme.fonts.heading,
          size: 18,
          weight: 700,
        },
      },
      tooltip: {
        titleFont: { family: fontFamily, size: 14 },
        bodyFont: { family: fontFamily, size: 12 },
      },
    },
    scales:
      type === "pie" || type === "doughnut" || type === "polarArea"
        ? {}
        : {
            x: {
              ticks: {
                color: textColor,
                font: { family: fontFamily, size: 12, weight: 400 },
              },
              grid: { color: "#e0e0e0" },
            },
            y: {
              ticks: {
                color: textColor,
                font: { family: fontFamily, size: 12, weight: 400 },
              },
              grid: { color: "#e0e0e0" },
            },
          },
  } as const;

  const ChartComponent = chartComponents[type];

  return ChartComponent ? (
    <Box
      sx={{
        fontFamily,
        color: textColor,
        width: "100%",
        maxHeight: 500,
        maxWidth: 500,
        mx: "auto",
        ...(type === "pie" || type === "doughnut" ? { height: 350 } : {}),
      }}
    >
      <ChartComponent data={data} options={options} />
    </Box>
  ) : null;
};

export default ChartBlock;
