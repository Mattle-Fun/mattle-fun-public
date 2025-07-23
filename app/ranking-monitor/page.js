"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { hasValue } from "@/app/helpers";
import { usePrivy } from "@privy-io/react-auth";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { StyledTable } from "@/app/ranking/Ranking";
import LoadingTable from "@/app/_components/LoadingTable";
import {
  ENERGY_PACKAGES,
  GAME_PASS_MIN_AMOUNT,
  MULTIPLY_PACKAGES,
  RankTypes,
} from "@/app/constants";
import { getRanking } from "@/app/ranking/server";
import { Button, DatePicker } from "antd";
import { ENERGY_URLS, POINT_URLS } from "@/app/shop/page";
const { RangePicker } = DatePicker;
dayjs.extend(utc);

const Ranking = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const [dates, setDates] = useState([dayjs().subtract(24, "hour"), dayjs()]);
  const { data, isFetching } = useQuery({
    queryKey: [
      "ranking-monitor",
      dates[0]?.toISOString(),
      dates[1]?.toISOString(),
    ],
    queryFn: () =>
      getRanking(RankTypes.Gaming, dates[0]?.toDate(), dates[1]?.toDate(), 100),
  });

  return (
    <div className={"flex flex-col"}>
      <div
        className={
          "flex flex-col items-center pt-[40px] gap-[12px] border-b border-[#493B0C]"
        }
      >
        <RangePicker
          value={dates}
          onChange={(values) => {
            setDates(values);
          }}
          allowClear={false}
          showTime
          format="YYYY-MM-DD"
          disabledDate={(current) => current && current > dayjs().endOf("day")}
        />
        <div className={"flex flex-row gap-[10px]"}>
          <Button
            onClick={() => setDates([dayjs().subtract(24, "hour"), dayjs()])}
          >
            Past 24H
          </Button>
          <Button onClick={() => setDates([null, null])}>All time</Button>
        </div>
      </div>
      <div className={"py-[24px] w-full flex-1 flex flex-col items-center"}>
        <div className={"w-full max-w-[920px]"}>
          <StyledTable className="w-full">
            <colgroup>
              <col width="76" />
              <col />
              <col width="100" />
              <col width="166" />
            </colgroup>
            <thead>
              <tr className="text-left text-[#F0E9CF7A]">
                <td>
                  <div>Rank</div>
                </td>
                <td className="bg-[#1d1b16] text-left">Wallet</td>
                <td className="bg-[#1d1b16] text-center min-w-[100px]">
                  Perks
                </td>
                <td>
                  <div className="text-right">Total Points</div>
                </td>
              </tr>
            </thead>
          </StyledTable>
          <div className={"flex-1"}>
            {isFetching ? (
              <LoadingTable
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
                      <col width="166" />
                    </colgroup>
                    <tbody>
                      <tr className={"h-[5px]"} />
                      {data?.map((asset, index) => (
                        <tr
                          key={index}
                          className={`${index === 0 ? "text-[#00FF97]" : index === 1 ? "text-[#F1C315]" : index === 2 ? "text-[#FF924F]" : "text-[#F0E9CF]"} ${asset.walletAddress === walletAddress ? "active" : ""} ${asset.walletAddress === walletAddress && index > 3 ? "color-active" : ""}`}
                        >
                          <td
                            className={`text-left ${index > 2 && asset.walletAddress !== walletAddress ? "text-[#F0E9CF7A]" : ""}`}
                          >
                            <div>{index + 1}</div>
                          </td>
                          <td
                            className={`text-left ${index > 2 && asset.walletAddress !== walletAddress ? "text-[#F0E9CF7A]" : ""}`}
                          >
                            {asset.walletAddress === walletAddress
                              ? "You"
                              : asset.walletAddress}
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
                                        ENERGY_URLS[
                                          asset.packageInfo.energyTier
                                        ]?.icon
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
                            <div>{asset.total}</div>
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
    </div>
  );
};

export default React.memo(Ranking);
