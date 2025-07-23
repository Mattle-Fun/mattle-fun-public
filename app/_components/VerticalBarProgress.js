"use client";
import React, { useEffect, useRef, useState } from "react";

const barWidth = 5;
const barGap = 4;
const barFullWidth = barWidth + barGap;

const VerticalBarProgress = ({ percentage }) => {
  const containerRef = useRef(null);
  const [totalBars, setTotalBars] = useState(0);

  useEffect(() => {
    const calculateBars = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const newTotalBars = Math.ceil(width / barFullWidth);
        setTotalBars(newTotalBars);
      }
    };

    calculateBars();

    const resizeObserver = new ResizeObserver(calculateBars);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);
  const activeBars = Math.ceil((percentage / 100) * totalBars);

  return (
    <div className="flex flex-col gap-[6px]">
      <div className="text-[#f0e9cf7a] text-[10px] leading-[14px]">
        {percentage}%
      </div>

      <div
        ref={containerRef}
        className={`flex-1 flex gap-[${barGap}px] overflow-hidden`}
      >
        {Array.from({ length: totalBars }).map((_, i) => (
          <div
            key={i}
            className={`h-[18px] w-[${barWidth}px] ${
              i < activeBars ? "bg-[#F1C315]" : "bg-[#f0e9cf1a]"
            }`}
            style={{ width: barWidth }}
          />
        ))}
      </div>
    </div>
  );
};

export default VerticalBarProgress;
