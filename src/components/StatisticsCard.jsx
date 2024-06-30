import React from "react";
import { useLocalStorage } from "@mantine/hooks";
import dayjs from "dayjs";
import CountUp from "react-countup";

export default function StatisticsCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}) {
  const [fromDate] = useLocalStorage({
    key: "fromDate",
  });

  const [toDate] = useLocalStorage({
    key: "toDate",
  });

  // Create a formatter for rupees
  const rupeeFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return (
    <div
      key={title}
      className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
    >
      <div className="flex w-full justify-between">
        <div>
          <dt className="truncate text-lg font-medium text-gray-800">
            {title}
          </dt>
          <span className="font-normal text-sm text-gray-400">
            {dayjs(fromDate).format("DD MMM YYYY")} -{" "}
            {dayjs(toDate).format("DD MMM YYYY")}
          </span>
          <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            <CountUp
              start={0}
              end={parseFloat(value)}
              duration={2}
              formattingFn={rupeeFormatter.format}
            />
          </dd>
        </div>
        <div>
          <div
            style={{
              background: iconBg,
              color: iconColor,
              borderRadius: "0.4em",
              fontSize: "1.8em",
              padding: "0.3em",
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
