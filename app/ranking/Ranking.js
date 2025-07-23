"use client";
import React, { useState } from "react";
import { Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getPnlRanking, getRanking, getScoreRanking } from "./server";
import styled from "styled-components";
import { hasValue, roundToDecimals, shortAddress } from "@/app/helpers";
import {
  DATE_FORMAT,
  ENERGY_PACKAGES,
  GAME_PASS_MIN_AMOUNT,
  MULTIPLY_PACKAGES,
  RankTypes,
} from "@/app/constants";
import { usePrivy } from "@privy-io/react-auth";
import DownIcon from "@/app/assets/images/DownIcon.svg";
import dayjs from "dayjs";
import StyledPopover from "@/app/_components/StyledPopover";
import utc from "dayjs/plugin/utc";
import { ENERGY_URLS, POINT_URLS } from "@/app/shop/page";
dayjs.extend(utc);

const Loading = styled(Skeleton)`
  & .ant-skeleton-title,
  & .ant-skeleton-paragraph li {
    background-image: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    ) !important;
  }
`;

export const StyledTable = styled.table`
  td {
    margin: 0;
    padding: 0;
  }
  thead {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 128.571% */
    td:first-child {
      div {
        border-style: solid;
        border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%231D1B16'/%3E%3C/svg%3E");
        border-width: 9px;
        border-right: 0;
        border-image-slice: 9 fill;
        border-image-repeat: stretch;
        padding: 3px 0 3px 7px;
      }
    }
    td:last-child {
      div {
        border-style: solid;
        border-width: 9px;
        border-left: 0;
        border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%231D1B16'/%3E%3C/svg%3E");
        border-image-slice: 9 fill;
        border-image-repeat: stretch;
        padding: 3px 7px 3px 0;
      }
    }
  }
  tbody {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 125% */
    letter-spacing: 0.64px;
    td {
      box-sizing: border-box;
      height: 40px;
      align-items: center;
    }
    td:first-child div {
      padding-left: 16px;
    }
    td:last-child div {
      padding-right: 16px;
    }
    tr.active {
      td:first-child {
        div {
          padding: 1px 0 1px 7px;
          display: flex;
          border-style: solid;
          border-width: 9px;
          border-right: 0;
          border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%23F0E9CF1A'/%3E%3C/svg%3E");
          border-image-slice: 9 fill;
          border-image-repeat: stretch;
          height: 40px;
        }
      }

      td:last-child {
        div {
          padding: 1px 7px 1px 0;
          border-style: solid;
          border-width: 9px;
          border-left: 0;
          border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%23F0E9CF1A'/%3E%3C/svg%3E");
          border-image-slice: 9 fill;
          border-image-repeat: stretch;
          height: 40px;
        }
      }
      td:not(:first-child):not(:last-child) {
        background: #f0e9cf1a;
      }
    }
    tr.color-active {
      td {
        color: #f0e9cf;
      }
    }
  }
`;

const HeaderBox = styled.div`
  border-image-source: url("data:image/svg+xml,%3Csvg width='38' height='38' viewBox='0 0 38 38' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30.5 1.5V4.5H33.5V7.5H36.5V30.5H33.5V33.5H30.5V36.5H7.5V33.5H4.5V30.5H1.5V7.5H4.5V4.5H7.5V1.5H30.5Z' fill='%23F1C315' stroke='%236B5409' stroke-width='3'/%3E%3Crect x='11' y='11' width='3' height='3' fill='%236B5409'/%3E%3Crect x='11' y='9' width='3' height='2' fill='%236B5409'/%3E%3Crect x='11' y='11' width='3' height='2' transform='rotate(90 11 11)' fill='%236B5409'/%3E%3Crect x='14' y='16' width='3' height='2' transform='rotate(-180 14 16)' fill='%236B5409'/%3E%3Crect x='14' y='14' width='3' height='2' transform='rotate(-90 14 14)' fill='%236B5409'/%3E%3Crect x='24' y='11' width='3' height='3' fill='%236B5409'/%3E%3Crect x='24' y='9' width='3' height='2' fill='%236B5409'/%3E%3Crect x='24' y='11' width='3' height='2' transform='rotate(90 24 11)' fill='%236B5409'/%3E%3Crect x='27' y='16' width='3' height='2' transform='rotate(-180 27 16)' fill='%236B5409'/%3E%3Crect x='27' y='14' width='3' height='2' transform='rotate(-90 27 14)' fill='%236B5409'/%3E%3Crect x='24' y='24' width='3' height='3' fill='%236B5409'/%3E%3Crect x='24' y='22' width='3' height='2' fill='%236B5409'/%3E%3Crect x='24' y='24' width='3' height='2' transform='rotate(90 24 24)' fill='%236B5409'/%3E%3Crect x='27' y='29' width='3' height='2' transform='rotate(-180 27 29)' fill='%236B5409'/%3E%3Crect x='27' y='27' width='3' height='2' transform='rotate(-90 27 27)' fill='%236B5409'/%3E%3Crect x='11' y='24' width='3' height='3' fill='%236B5409'/%3E%3Crect x='11' y='22' width='3' height='2' fill='%236B5409'/%3E%3Crect x='11' y='24' width='3' height='2' transform='rotate(90 11 24)' fill='%236B5409'/%3E%3Crect x='14' y='29' width='3' height='2' transform='rotate(-180 14 29)' fill='%236B5409'/%3E%3Crect x='14' y='27' width='3' height='2' transform='rotate(-90 14 27)' fill='%236B5409'/%3E%3C/svg%3E%0A");
  border-style: solid;
  border-width: 16px;
  border-image-slice: 16 fill;
  border-image-repeat: stretch;
  color: #f0e9cf;
  text-shadow: 0px 5px 0px #282001;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #493b0c;
  font-size: 56px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 2px 18px;
  z-index: 1;
`;
const ContentBox = styled.div`
  border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 38 38' fill='none'%3E%3Cpath d='M30.5 1.5V4.5H33.5V7.5H36.5V30.5H33.5V33.5H30.5V36.5H7.5V33.5H4.5V30.5H1.5V7.5H4.5V4.5H7.5V1.5H30.5Z' fill='%23282001' stroke='%23493B0C' stroke-width='3'/%3E%3C/svg%3E");
  border-style: solid;
  border-width: 12px;
  border-image-slice: 12 fill;
  border-image-repeat: stretch;
  margin-top: -12px;
  color: #f0e9cf;
  padding: 16px 11px 4px 11px;
  width: 366px;
  box-sizing: border-box;
`;

const FilterBox = styled.div`
  color: #f0e9cf;
  &:hover {
    color: #f1c315;
    path {
      fill: #f1c315;
      fill-opacity: 1;
    }
  }
`;

const Seasons = [
  {
    label: "BONK Season",
    startTime: dayjs.utc("2025-07-21").startOf("day"),
    endTime: dayjs.utc("2025-08-19").endOf("day"),
  },
  {
    label: "Season 3",
    startTime: dayjs.utc("2025-07-01").startOf("day"),
    endTime: dayjs.utc("2025-07-20").endOf("day"),
  },
  {
    label: "Season 2",
    startTime: dayjs.utc("2025-05-29").startOf("day"),
    endTime: dayjs.utc("2025-06-30").endOf("day"),
  },
  {
    label: "Season 1",
    startTime: dayjs.utc("2025-05-01").startOf("day"),
    endTime: dayjs.utc("2025-05-28").endOf("day"),
  },
];
const Ranking = () => {
  const [tab, setTab] = useState(RankTypes.Gaming);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  console.log("StartTime", Seasons[seasonIndex]?.startTime?.format());
  console.log("EndTime", Seasons[seasonIndex]?.endTime?.format());
  const { data, isFetching } = useQuery({
    queryKey: ["ranking", tab, seasonIndex],
    queryFn: () =>
      getRanking(
        tab,
        Seasons[seasonIndex].startTime?.toDate(),
        Seasons[seasonIndex].endTime?.toDate(),
        100,
      ),
  });
  const { data: scoreRanking } = useQuery({
    queryKey: ["score-ranking", walletAddress, seasonIndex],
    queryFn: () =>
      getScoreRanking(
        walletAddress,
        Seasons[seasonIndex].startTime?.toDate(),
        Seasons[seasonIndex].endTime?.toDate(),
      ),
  });
  const { data: pnlRanking } = useQuery({
    queryKey: ["pnl-ranking", walletAddress],
    queryFn: () => getPnlRanking(walletAddress),
  });

  return (
    <div className={"flex flex-col"}>
      <div className={"flex flex-row justify-between items-end px-[64px]"}>
        <div className="flex flex-col py-[40px] w-fit">
          <HeaderBox>HALL OF FAME</HeaderBox>
          <ContentBox>
            <div className={"flex flex-row"}>
              <div
                className={
                  "flex-1 flex flex-col gap-[6px] border-r-[3px] border-[#F0E9CF14] "
                }
              >
                <div className={"text-[#F0E9CF7A] text-[16px] leading-[20px]"}>
                  Gaming Rank:
                </div>
                <div className={"flex flex-row items-baseline"}>
                  {scoreRanking && scoreRanking.rank && (
                    <div
                      className={
                        "text-[#F1C315] text-[16px] leading-[20px] tracking-[0.64px]"
                      }
                    >
                      #
                    </div>
                  )}
                  <div
                    className={
                      "text-[#F1C315] text-[24px] leading-[28px] tracking-[0.96px] mr-[8px]"
                    }
                  >
                    {scoreRanking ? scoreRanking.rank : "--"}
                  </div>
                  <div className={"text-[#F0E9CF] text-[16px] leading-[20px]"}>
                    {scoreRanking ? scoreRanking.total : "--"}
                  </div>
                </div>
              </div>
              <div className={"flex-1 flex flex-col gap-[6px] pl-[20px]"}>
                <div className={"text-[#F0E9CF7A] text-[16px] leading-[20px]"}>
                  Trading Rank:
                </div>
                <div className={"flex flex-row items-baseline"}>
                  {pnlRanking && pnlRanking.total > 0.005 && (
                    <div
                      className={
                        "text-[#F1C315] text-[16px] leading-[20px] tracking-[0.64px]"
                      }
                    >
                      #
                    </div>
                  )}
                  <div
                    className={
                      "text-[#F1C315] text-[24px] leading-[28px] tracking-[0.96px] mr-[8px]"
                    }
                  >
                    {pnlRanking && pnlRanking.total > 0.005
                      ? pnlRanking.rank
                      : "--"}
                  </div>
                  <div className={`text-[#00FF97] text-[16px] leading-[20px]`}>
                    {pnlRanking && pnlRanking.total > 0.005
                      ? `+$${Math.abs(roundToDecimals(pnlRanking.total, 2))}`
                      : "--"}
                  </div>
                </div>
              </div>
            </div>
          </ContentBox>
        </div>
        <img
          src={"/images/ranking_bonk.png"}
          alt={"energy"}
          className={"w-auto h-full max-h-[220px] object-cover block z-[1]"}
        />
      </div>
      <div className="flex items-center justify-between flex-row px-[48px] border-t border-b border-[#493B0C] text-[#F0E9CF7A] font-[400] text-[16px] leading-[20px] ">
        <div className="flex items-center flex-row">
          <div
            className={`py-[12px] px-[16px] cursor-pointer ${tab === RankTypes.Gaming && "text-[#F1C315]"}`}
            onClick={() => setTab(RankTypes.Gaming)}
          >
            Gaming
          </div>
          <div
            className={`py-[12px] px-[16px] cursor-pointer ${tab === RankTypes.Trading && "text-[#F1C315]"}`}
            onClick={() => setTab(RankTypes.Trading)}
          >
            Trading
          </div>
        </div>
        {tab === RankTypes.Gaming && (
          <StyledPopover
            placement="bottomRight"
            content={
              <div className={"py-[4px] px-[8px] flex flex-col gap-[8px]"}>
                {Seasons.map((i, index) => (
                  <div
                    key={index}
                    className={
                      "flex flex-row items-center p-[4px] cursor-pointer text-[16px] leading-[20px] tracking-[0.64px] text-[#F0E9CF] hover:text-[#f1c315]"
                    }
                    onClick={() => setSeasonIndex(index)}
                  >
                    <div>{i.label}</div>
                    {i.startTime && i.endTime && (
                      <div className={"text-[#F0E9CF7A]"}>
                        &nbsp;
                        {`(${i.startTime.format(DATE_FORMAT)} - ${i.endTime.format(DATE_FORMAT)})`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            }
            arrow={false}
          >
            <FilterBox
              className={"flex flex-row items-center gap-[8px] cursor-pointer"}
            >
              <div className={"flex flex-row"}>
                {Seasons[seasonIndex].label}
                {Seasons[seasonIndex].startTime &&
                  Seasons[seasonIndex].endTime && (
                    <div className={"text-[#F0E9CF7A]"}>
                      &nbsp;
                      {`(${Seasons[seasonIndex].startTime.format(DATE_FORMAT)} - ${Seasons[seasonIndex].endTime.format(DATE_FORMAT)})`}
                    </div>
                  )}
              </div>
              <DownIcon />
            </FilterBox>
          </StyledPopover>
        )}
      </div>
      <div className={"py-[24px] px-[48px] flex-1 flex flex-col"}>
        <StyledTable className="w-full">
          <colgroup>
            <col width="76" />
            <col />
            <col width="100" />
            <col width="40%" />
          </colgroup>
          <thead>
            <tr className="text-left text-[#F0E9CF7A]">
              <td className={"min-w-[76px]"}>
                <div>Rank</div>
              </td>
              <td className="bg-[#1d1b16] text-left min-w-[480px]">Wallet</td>
              <td className="bg-[#1d1b16] text-center min-w-[100px]">Perks</td>
              <td>
                <div className="text-right text-nowrap">
                  {tab === RankTypes.Gaming ? "Total Points" : "PnL"}
                </div>
              </td>
            </tr>
          </thead>
        </StyledTable>
        <div className={"flex-1"}>
          {isFetching ? (
            <Loading
              className={"mt-[15px]"}
              title={false}
              active
              paragraph={{ rows: 5 }}
              loading={isFetching}
            />
          ) : (
            <div>
              {data?.length > 0 ? (
                <StyledTable className="w-full">
                  <colgroup>
                    <col width="76" />
                    <col />
                    <col width="100" />
                    <col width="40%" />
                  </colgroup>
                  <tbody>
                    <tr className={"h-[5px]"} />
                    {data?.map((asset, index) => (
                      <tr
                        key={index}
                        className={`${index === 0 ? "text-[#00FF97]" : index === 1 ? "text-[#F1C315]" : index === 2 ? "text-[#FF924F]" : "text-[#F0E9CF]"} ${asset.walletAddress === walletAddress ? "active" : ""} ${asset.walletAddress === walletAddress && index > 3 ? "color-active" : ""}`}
                      >
                        <td
                          className={`text-left min-w-[76px] ${index > 2 && asset.walletAddress !== walletAddress ? "text-[#F0E9CF7A]" : ""}`}
                        >
                          <div>{index + 1}</div>
                        </td>
                        <td
                          className={`text-left ${index > 2 && asset.walletAddress !== walletAddress ? "text-[#F0E9CF7A]" : ""}`}
                        >
                          {asset.walletAddress === walletAddress
                            ? "You"
                            : shortAddress(asset.walletAddress, 5, "right")}
                        </td>
                        <td className="text-center min-w-[100px]">
                          <div
                            className={
                              "flex flex-row gap-[4px] items-center px-[16px]"
                            }
                          >
                            {asset?.packageInfo && (
                              <>
                                {asset.packageInfo.energyBoughtAt &&
                                hasValue(asset.packageInfo.energyTier) &&
                                asset.packageInfo.energyTier < 3 &&
                                dayjs().diff(
                                  dayjs(
                                    new Date(
                                      asset.packageInfo.energyBoughtAt,
                                    ).getTime() +
                                      ENERGY_PACKAGES[
                                        asset.packageInfo.energyTier
                                      ].expiredIn *
                                        24 *
                                        60 *
                                        60 *
                                        1000,
                                  ),
                                ) < 0 ? (
                                  <img
                                    key={1}
                                    src={
                                      ENERGY_URLS[asset.packageInfo.energyTier]
                                        ?.icon
                                    }
                                    alt={"energy"}
                                    className={
                                      "w-auto h-full max-h-[32px] object-cover block z-[1]"
                                    }
                                  />
                                ) : asset.packageInfo?.totalSolSpent >=
                                  GAME_PASS_MIN_AMOUNT ? (
                                  <img
                                    key={1}
                                    src={ENERGY_URLS[0].icon}
                                    alt={"energy"}
                                    className={
                                      "w-auto h-full max-h-[32px] object-cover block z-[1]"
                                    }
                                  />
                                ) : null}
                                {asset.packageInfo.multiplyBoughtAt &&
                                  hasValue(asset.packageInfo.multiplyTier) &&
                                  asset.packageInfo.multiplyTier < 3 &&
                                  dayjs().diff(
                                    dayjs(
                                      new Date(
                                        asset.packageInfo.multiplyBoughtAt,
                                      ).getTime() +
                                        MULTIPLY_PACKAGES[
                                          asset.packageInfo.multiplyTier
                                        ].expiredIn *
                                          24 *
                                          60 *
                                          60 *
                                          1000,
                                    ),
                                  ) < 0 && (
                                    <img
                                      key={2}
                                      src={
                                        POINT_URLS[
                                          asset.packageInfo.multiplyTier
                                        ]?.icon
                                      }
                                      alt={"point"}
                                      className={
                                        "w-auto h-full max-h-[32px] object-cover block z-[1]"
                                      }
                                    />
                                  )}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="text-right">
                          <div>
                            {tab === RankTypes.Gaming
                              ? asset.total
                              : `+$${roundToDecimals(Math.abs(asset.total), 2)}`}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </StyledTable>
              ) : (
                <div
                  className={
                    "m-[20px] text-white text-center font-[400] text-[14px] leading-[18px]"
                  }
                >
                  No Data
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Ranking);
