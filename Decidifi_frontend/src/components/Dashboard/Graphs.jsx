import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const perDaySalesData = {
  labels: ["Positive Decisions", "Negative Decisions"],
  datasets: [
    {
      label: "Average Decisions",
      data: [560, 430],
      backgroundColor: ["#1b0760", "#346de7"],
      borderWidth: 0,
    },
  ],
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
    datalabels: {
      formatter: (value, context) => {
        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        const percentage = ((value / total) * 100).toFixed(1) + "%";
        return percentage;
      },
      color: "#fff",
      font: {
        size: 16,
      },
    },
  },
};


const totalOrdersData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Total Decisions",
      data: [400, 300, 500, 200, 800, 600],
      backgroundColor: "#36a2eb",
      borderColor: "#36a2eb",
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
  },
};

const Graphs = () => {
  return (
    <div className="py-4 mb-4 text-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-80 shadow-lg w-full border border-gray-100 bg-white p-5">
          <Bar data={totalOrdersData} options={options} />
        </div>
        <div className="h-80 shadow-lg border flex bg-white w-full flex-row justify-center items-center py-4 border-gray-100">
          <Pie data={perDaySalesData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default Graphs;