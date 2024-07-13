// dashboard.jsx
import React, { useEffect, useState } from "react";
import StatisticsCard from "../../components/StatisticsCard";
import { Row, Col, Card } from "antd";
import { TbPigMoney } from "react-icons/tb";
import { PiChartLineUpBold, PiChartLineDownBold } from "react-icons/pi";
import toast from "react-hot-toast";
import { useLocalStorage } from "@mantine/hooks";
import axiosInstance from "../../api/axiosInstance";
import ApexAreaChart from "./ApexAreaChart";
import ApexDonutChart from "./ApexDonutChart";
import { FaCalendarAlt } from "react-icons/fa";
import dayjs from "dayjs";
import DateTimeCard from "../../components/DateTimeCard";

const renderStatCards = () => {
  const [selectedAccount] = useLocalStorage({
    key: "selectedAccount",
  });

  const [fromDate] = useLocalStorage({
    key: "fromDate",
  });

  const [toDate] = useLocalStorage({
    key: "toDate",
  });

  const [stats, setStats] = useState([
    {
      title: "Remaining",
      value: "0",
      icon: <TbPigMoney />,
      iconBg: "#e1e1fe",
      iconColor: "#168ff9",
    },
    {
      title: "Income",
      value: "0",
      icon: <PiChartLineUpBold />,
      iconBg: "#e2fee1",
      iconColor: "#00d73d",
    },
    {
      title: "Expense",
      value: "0",
      icon: <PiChartLineDownBold />,
      iconBg: "#fee1e1",
      iconColor: "#f95216",
    },
  ]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/transaction/info-cards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...(selectedAccount !== "1" && { account: selectedAccount }),
          fromDate: fromDate,
          toDate: toDate,
        },
      });

      setStats([
        {
          title: "Remaining",
          value: response.data.data.remaining,
          icon: <TbPigMoney />,
          iconBg: "#e1e1fe",
          iconColor: "#168ff9",
        },
        {
          title: "Income",
          value: response.data.data.income,
          icon: <PiChartLineUpBold />,
          iconBg: "#e2fee1",
          iconColor: "#00d73d",
        },
        {
          title: "Expense",
          value: response.data.data.expense,
          icon: <PiChartLineDownBold />,
          iconBg: "#fee1e1",
          iconColor: "#f95216",
        },
      ]);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedAccount, fromDate, toDate]);

  return stats.map((item) => (
    <Col xs={24} sm={24} md={8} lg={8} key={item.title} className="mb-4">
      <StatisticsCard
        title={item.title}
        value={item.value}
        icon={item.icon}
        iconBg={item.iconBg}
        iconColor={item.iconColor}
      />
    </Col>
  ));
};

export default function Index() {
  return (
    <>
      <div>
        <Row gutter={16}>{renderStatCards()}</Row>
      </div>
      <div>
        <Row gutter={16}>
          <Col lg={16} md={24} xs={24}>
            <Card className="w-full shadow">
              <div>
                <h1 className="text-2xl font-semibold">Transactions</h1>
                <br />
                <ApexAreaChart />
              </div>
            </Card>
          </Col>
          <Col
            lg={8}
            md={24}
            xs={24}
            className="md:mt-2 flex justify-between flex-col"
          >
            <Card className="h-[70%] w-full shadow">
              <div>
                <h1 className="text-2xl font-semibold">Categories</h1>
                <br />
                <ApexDonutChart />
              </div>
            </Card>
            <DateTimeCard />
          </Col>
        </Row>
      </div>
    </>
  );
}
