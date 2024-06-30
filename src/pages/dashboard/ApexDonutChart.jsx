import { useLocalStorage } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

const initialChartData = {
  series: [],
  options: {
    chart: {
      type: "donut",
    },
    labels: [],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      fontSize: "14px",
      offsetX: 0,
      offsetY: 0,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        width: 12,
        height: 12,
      },
      itemMargin: {
        vertical: 5,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 700,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            floating: false,
            fontSize: "14px",
            offsetX: 0,
            offsetY: 0,
            labels: {
              useSeriesColors: true,
            },
            markers: {
              width: 12,
              height: 12,
            },
            itemMargin: {
              vertical: 5,
            },
          },
        },
      },
    ],
  },
};

const ApexChart = () => {
  const [selectedAccount] = useLocalStorage({
    key: "selectedAccount",
  });

  const [fromDate] = useLocalStorage({
    key: "fromDate",
  });

  const [toDate] = useLocalStorage({
    key: "toDate",
  });

  const [chartData, setChartData] = useState(initialChartData);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/category/chart/donut", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          account: selectedAccount === "1" ? null : selectedAccount,
          fromDate: fromDate,
          toDate: toDate,
        },
      });

      const data = response.data.data;

      setChartData((prevChartData) => ({
        ...prevChartData,
        series: data.values,
        options: {
          ...prevChartData.options,
          labels: data.labels,
        },
      }));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedAccount, fromDate, toDate]);

  return (
    <div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="donut"
      />
    </div>
  );
};

export default ApexChart;
