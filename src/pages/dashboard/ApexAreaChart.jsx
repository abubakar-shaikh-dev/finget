import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axiosInstance from "../../api/axiosInstance";
import dayjs from "dayjs";
import { useLocalStorage } from "@mantine/hooks";

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

  const [series, setSeries] = useState([
    { name: "Income", data: [] },
    { name: "Expense", data: [] },
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: "area",
      height: 350,
      stacked: true,
      events: {
        selection: function (chart, e) {
          console.log(dayjs(e.xaxis.min).format());
        },
      },
    },
    colors: ["#4cff91", "#ff4e4e"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    xaxis: {
      type: "datetime",
    },
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/transaction/chart/area", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          account: selectedAccount === "1" ? null : selectedAccount,
          fromDate: fromDate,
          toDate: toDate,
        },
      });

      const { income, expense } = response.data.data;
      setSeries([
        { name: "Income", data: income },
        { name: "Expense", data: expense },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedAccount, fromDate, toDate]);

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default ApexChart;
