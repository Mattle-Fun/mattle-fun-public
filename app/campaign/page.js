"use client";
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/app/campaign/server";
import LoadingTable from "@/app/_components/LoadingTable";
import PixelBorderBox, { PixelPillBox } from "@/app/_components/PixelBorderBox";
import { hashString } from "@/app/_components/TokenLogo";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/app/constants";
dayjs.extend(utc);

const BannerImage = ({ imageHref }) => {
  const idSuffix = hashString(imageHref);
  const patternId = `pattern_${idSuffix}`;
  const imageId = `image_${idSuffix}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="auto"
      height="auto"
      viewBox="0 0 249 140"
      fill="none"
    >
      <path
        d="M241.5 1.5V4.5H244.5V7.5H247.5V132.5H244.5V135.5H241.5V138.5H7.5V135.5H4.5V132.5H1.5V7.5H4.5V4.5H7.5V1.5H241.5Z"
        fill="#282001"
      />
      <path
        d="M241.5 1.5V4.5H244.5V7.5H247.5V132.5H244.5V135.5H241.5V138.5H7.5V135.5H4.5V132.5H1.5V7.5H4.5V4.5H7.5V1.5H241.5Z"
        fill={`url(#${patternId})`}
      />
      <path
        d="M241.5 1.5V4.5H244.5V7.5H247.5V132.5H244.5V135.5H241.5V138.5H7.5V135.5H4.5V132.5H1.5V7.5H4.5V4.5H7.5V1.5H241.5Z"
        stroke="#6B5409"
        stroke-width="3"
      />
      <defs>
        <pattern
          id={patternId}
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            href={`#${imageId}`}
            transform="matrix(0.000520833 0 0 0.000944496 0 -0.010028)"
          />
        </pattern>
        <image
          id={imageId}
          width="1920"
          height="1080"
          preserveAspectRatio="none"
          href={imageHref}
        />
      </defs>
    </svg>
  );
};
const Campaign = () => {
  const [tab, setTab] = useState("Live");
  const { data, isFetching } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents(),
  });
  const events = useMemo(() => {
    if (data?.length > 0)
      return data.filter(
        (e) =>
          (tab === "Live" && new Date(e.endDate) >= new Date()) ||
          (tab === "Ended" && new Date(e.endDate) < new Date()),
      );
    return [];
  }, [tab, data]);
  return (
    <div className={"flex flex-col"}>
      <div
        className={"flex flex-col px-[64px] py-[40px] box-border"}
        style={{
          background: `linear-gradient(rgba(16, 13, 8, 0.75) 0%, rgba(16, 13, 8, 0) 15%, rgba(16, 13, 8, 0) 85%, rgba(16, 13, 8, 0.75) 100%), linear-gradient(90deg, rgba(16, 13, 8, 0.75) 0%, rgba(16, 13, 8, 0) 5%, rgba(16, 13, 8, 0) 95%, rgba(16, 13, 8, 0.75) 100%), linear-gradient(232deg, rgb(64 51 0 / 40%) -24.75%, rgba(16, 13, 8, 0) 73.72%), linear-gradient(130deg, rgb(64 51 0 / 25%) -18.9%, rgba(16, 13, 8, 0) 74.83%), radial-gradient(66% 200% at 43.27% -98.03%, rgb(235 215 185 / 20%) 7.8%, rgba(16, 13, 8, 0) 100%)`,
        }}
      >
        <div className={"text-[#f0e9cf7a] text-[16px] leading-[20px]"}>
          Welcome to
        </div>
        <div className={"text-[#F0E9CF] text-[56px] leading-[60px] mt-[8px]"}>
          Campaign
        </div>
      </div>
      <div className="flex items-center justify-between flex-row px-[48px] border-t border-b border-[#493B0C] text-[#F0E9CF7A] font-[400] text-[16px] leading-[20px] ">
        <div className="flex items-center flex-row">
          {["Live", "Ended"].map((type, index) => (
            <div
              key={index}
              className={`py-[12px] px-[16px] cursor-pointer ${tab === type && "text-[#F1C315]"}`}
              onClick={() => setTab(type)}
            >
              {type}
            </div>
          ))}
        </div>
      </div>
      <div className={"px-[64px] py-[24px] w-full"}>
        {isFetching ? (
          <LoadingTable
            className={"mt-[15px]"}
            title={false}
            active
            paragraph={{ rows: 5 }}
          />
        ) : events.length > 0 ? (
          <div
            className={
              "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]"
            }
          >
            {events.map((event, i) => (
              <a
                className={"z-[1] hover:scale-[102%]"}
                key={i}
                target="_blank"
                href={event.link}
              >
                <PixelBorderBox color={"1D1B16"} className={"py-[3px]"}>
                  <div className={"mx-[-1px]"}>
                    <div className={"mx-[-14px] mt-[-16px]"}>
                      <BannerImage imageHref={event.imageUrl} />
                    </div>
                    <div
                      className={
                        "mt-[12px] text-[var(--color-text-subtle)] text-[12px] leading-[16px] flex flex-row items-center justify-between"
                      }
                    >
                      {`${dayjs.utc(event.startDate).format(DATE_FORMAT)} - ${dayjs.utc(event.endDate).format(DATE_FORMAT)}`}
                      <PixelPillBox
                        $color={
                          new Date() > dayjs.utc(event.endDate)
                            ? "f0e9cf1a"
                            : "FF6200"
                        }
                      >
                        <div
                          className={`my-[-6px] text-[10px] leading-[14px] ${new Date() > dayjs.utc(event.endDate) ? "text-[#f0e9cf7a]" : "text-[#fafafa]"}`}
                        >
                          {new Date() > dayjs.utc(event.endDate)
                            ? "Ended"
                            : "Live"}
                        </div>
                      </PixelPillBox>
                    </div>
                    <div
                      className={
                        "text-[var(--color-text-normal)] text-[16px] leading-[22px] my-[8px] h-[44px]"
                      }
                    >
                      {event.description}
                    </div>
                    <div
                      className={
                        "pt-[8px] mb-[2px] flex flex-row items-center gap-[4px]"
                      }
                    >
                      <div
                        className={"text-[#00FF97] text-[16px] leading-[20px]"}
                      >
                        ${event.amount}
                      </div>
                      <div
                        className={
                          "text-[var(--color-text-subtle)] text-[12px] leading-[16px]"
                        }
                      >
                        Prize pool
                      </div>
                    </div>
                  </div>
                </PixelBorderBox>
              </a>
            ))}
          </div>
        ) : (
          <div className={"text-center"}>No Data</div>
        )}
      </div>
    </div>
  );
};

export default Campaign;
