"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

function formatCountdown(fromDate, toDate) {
  const diffMs = dayjs(toDate).diff(dayjs(fromDate));
  if (diffMs <= 0) return "0D:00H:00M";

  const dur = dayjs.duration(diffMs);
  const days = String(Math.floor(dur.asDays()));
  const hours = String(dur.hours()).padStart(2, "0");
  const minutes = String(dur.minutes()).padStart(2, "0");

  return `${days}D:${hours}H:${minutes}M`;
}

const Countdown = ({ targetDate }) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!targetDate || !dayjs(targetDate).isValid()) {
      setCountdown("0D:00H:00M");
      return;
    }

    const updateCountdown = () => {
      setCountdown(formatCountdown(dayjs(), targetDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return <div>{countdown}</div>;
};

export default React.memo(Countdown);
