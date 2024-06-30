import React from "react";
import StatisticsCard from "../../components/StatisticsCard";
import { Row, Col } from "antd";
import { TbPigMoney } from "react-icons/tb";
import { PiChartLineUpBold, PiChartLineDownBold } from "react-icons/pi";

const renderStatCards = () => {
  let stats = [
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
  ];

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

export default function index() {
  return (
    <div>
      <Row gutter={16}>{renderStatCards()}</Row>
    </div>
  );
}
