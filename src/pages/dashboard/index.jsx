import React from "react";
import StatisticsCard from "../../components/StatisticsCard";
import { Row, Col } from "antd";
import { TbPigMoney } from "react-icons/tb";
import { PiChartLineUpBold , PiChartLineDownBold} from "react-icons/pi";

const stats = [
  {
    title: "Remaining",
    value: "71,897",
    icon: <TbPigMoney />,
    iconBg: "#e1e1fe",
    iconColor: "#168ff9",
  },
  {
    title: "Income",
    value: "71,897",
    icon: <PiChartLineUpBold />,
    iconBg: "#e2fee1",
    iconColor: "#16f956",
  },
  {
    title: "Expense",
    value: "12,897",
    icon: <PiChartLineDownBold />,
    iconBg: "#fee1e1",
    iconColor: "#f95216",
  },
];

export default function index() {
  return (
    <Row gutter={16}>
      {stats.map((item) => (
        <Col xs={24} sm={24} md={8} lg={8} key={item.title} className="mb-4">
          <StatisticsCard
            title={item.title}
            value={item.value}
            icon={item.icon}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
          />
        </Col>
      ))}
    </Row>
  );
}
