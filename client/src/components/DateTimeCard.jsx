import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FaCalendarAlt } from "react-icons/fa";

export default function DateTimeCard() {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="h-[27%] bg-white rounded-lg p-5 shadow w-full">
      <div className="flex items-center gap-3 mb-2">
        <FaCalendarAlt />
        <h3 className="text-xl font-semibold  text-left">Date & Time</h3>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-gray-400">
          Asia/Kolkata
          <br />
          {currentTime.format("dddd")}, {currentTime.format("MMMM")} ,{" "}
          {currentTime.format("YYYY")}
        </span>
        <div className="text-3xl text-gray-800 font-bold">
          {currentTime.format("HH:mm:ss")}
        </div>
      </div>
    </div>
  );
}
