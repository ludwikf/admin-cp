import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export function GeneralData() {
  const [visitors, setVisitors] = useState<any>("");
  const [pageviews, setPageviews] = useState<any>("");
  const [bounceRate, setBounceRate] = useState<any>("");
  const fetchVisitors = async () => {
    try {
      const res = await fetch(
        "https://plausible.io/api/v1/stats/aggregate?site_id=ludwikfaron.com&period=12mo&metrics=visitors",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PLAUSIBLE}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Plausible response error");
      }

      const data = await res.json();
      setVisitors(data.results.visitors.value);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const fetchPageviews = async () => {
    try {
      const res = await fetch(
        "https://plausible.io/api/v1/stats/aggregate?site_id=ludwikfaron.com&period=12mo&metrics=pageviews",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PLAUSIBLE}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Plausible response error");
      }

      const data = await res.json();
      setPageviews(data.results.pageviews.value);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const fetchBR = async () => {
    try {
      const res = await fetch(
        "https://plausible.io/api/v1/stats/aggregate?site_id=ludwikfaron.com&period=12mo&metrics=bounce_rate",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PLAUSIBLE}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Plausible response error");
      }

      const data = await res.json();
      setBounceRate(data.results.bounce_rate.value);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
    fetchPageviews();
    fetchBR();
  }, []);

  return (
    <div>
      <div>
        <div className="mb-5">
          <p className="text-[#eee]">UNIQUE VISITORS</p>
          <span className="text-mainTheme text-3xl"> {visitors}</span>
        </div>
        <div className="mb-5">
          <p className="text-[#eee]">TOTAL PAGEVIEWS</p>
          <span className="text-mainTheme text-3xl"> {pageviews}</span>
        </div>
        <div className="mb-5">
          <p className="text-[#eee]">BOUNCE RATE</p>
          <span className="text-mainTheme text-3xl"> {bounceRate}%</span>
        </div>
      </div>
    </div>
  );
}

export function ChartVisitor() {
  const [chartData, setChartData] = useState<any[]>([]);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Visitors",
        color: "#aaa",
        font: {
          size: 15,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
        },
      },
    },
  };

  const formatDate = (dateString: any) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const dates = chartData.map((c) => formatDate(c.date));
  const visitors = chartData.map((entry) => entry.visitors);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Visitors",
        data: visitors,
        borderColor: "rgb(226,107,17)",
        backgroundColor: "rgba(226,107,17, 0.5)",
      },
    ],
  };

  const fetchDevices = async () => {
    try {
      const res = await fetch(
        "https://plausible.io/api/v1/stats/timeseries?site_id=ludwikfaron.com&period=7d",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PLAUSIBLE}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Plausible response error");
      }

      const data = await res.json();
      setChartData(data.results);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
}

export function ChartCountry() {
  const [chartData, setChartData] = useState<any[]>([]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Countries",
        color: "#aaa",
        font: {
          size: 15,
        },
      },
    },
  };

  const data = {
    labels: chartData.map((c) => c.country),
    datasets: [
      {
        label: " Visitors",
        data: chartData.map((c) => c.visitors),
        backgroundColor: [
          "rgb(226,107,17, 0.5)",
          "rgba(255, 50, 50, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgb(226,107,17, 1)",
          "rgba(255, 50, 50, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const fetchDevices = async () => {
    try {
      const res = await fetch(
        "https://plausible.io/api/v1/stats/breakdown?site_id=ludwikfaron.com&period=12mo&property=visit:country&metrics=visitors&limit=5",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PLAUSIBLE}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Plausible response error");
      }

      const data = await res.json();
      setChartData(data.results);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDevices();
  }, []);
  return (
    <div>
      <Pie data={data} options={options} />
    </div>
  );
}

export function ChartDevice() {
  const [chartData, setChartData] = useState<any[]>([]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Devices",
        color: "#aaa",
        font: {
          size: 15,
        },
      },
    },
  };

  const data = {
    labels: chartData.map((c) => c.device),
    datasets: [
      {
        label: " Visitors",
        data: chartData.map((c) => c.visitors),
        backgroundColor: [
          "rgb(226,107,17, 0.5)",
          "rgba(255, 50, 50, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgb(226,107,17, 1)",
          "rgba(255, 50, 50, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const fetchDevices = async () => {
    try {
      const res = await fetch(
        "https://plausible.io/api/v1/stats/breakdown?site_id=ludwikfaron.com&period=12mo&property=visit:device&metrics=visitors,bounce_rate&limit=5",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PLAUSIBLE}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Plausible response error");
      }

      const data = await res.json();
      setChartData(data.results);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDevices();
  }, []);
  return (
    <div>
      <Pie data={data} options={options} />
    </div>
  );
}

export function ChartPage() {
  const [chartData, setChartData] = useState<any[]>([]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Top Pages",
        color: "#aaa",
        font: {
          size: 15,
        },
      },
    },
  };

  const data = {
    labels: chartData.map((c) => c.page),
    datasets: [
      {
        label: " Visitors",
        data: chartData.map((c) => c.visitors),
        backgroundColor: [
          "rgb(226,107,17, 0.5)",
          "rgba(255, 50, 50, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgb(226,107,17, 1)",
          "rgba(255, 50, 50, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const fetchDevices = async () => {
    try {
      const res = await fetch(
        "https://plausible.io/api/v1/stats/breakdown?site_id=ludwikfaron.com&period=6mo&property=event:page&limit=5",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PLAUSIBLE}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Plausible response error");
      }

      const data = await res.json();
      setChartData(data.results);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDevices();
  }, []);
  return (
    <div>
      <Pie data={data} options={options} />
    </div>
  );
}
