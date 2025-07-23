"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getRanking } from "./server";
import { hasValue, shortAddress } from "@/app/helpers";
import { usePrivy } from "@privy-io/react-auth";
import Link16Icon from "@/app/assets/images/Link16Icon.svg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { PixelTextBox } from "@/app/_components/PixelBorderBox";
import { IconWrapper } from "@/app/_components/Button";
import Image from "next/image";
import { StyledTable } from "@/app/ranking/Ranking";
import LoadingTable from "@/app/_components/LoadingTable";
import StyledPopover from "@/app/_components/StyledPopover";
import DetailIcon from "@/app/assets/images/DetailIcon.svg";
import styled from "styled-components";
import { UserRoles } from "@/app/constants";
dayjs.extend(utc);

const EventButton = styled.div`
  cursor: pointer;
  &:hover {
    div {
      color: #f1c315 !important;
    }
    path {
      fill: #f1c315;
      fill-opacity: 1;
    }
  }
`;

const Ranking = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  const { data, isFetching } = useQuery({
    queryKey: ["monke-ranking"],
    queryFn: () =>
      getRanking(
        UserRoles.userMonke,
        dayjs.utc("2025-06-24").startOf("day").toDate(),
        dayjs.utc("2025-07-10").endOf("day").toDate(),
      ),
  });

  return (
    <div className={"flex flex-col"}>
      <div
        className={
          "flex flex-col items-center pt-[40px] gap-[12px] border-b border-[#493B0C]"
        }
      >
        <EventButton
          as={"a"}
          href={"https://x.com/mattlefun/status/1937402889577857382"}
          target={"_blank"}
        >
          <PixelTextBox
            $borderColor={"493B0C"}
            $color={"282001"}
            className={
              "pl-[8px] pr-[7px] text-[var(--color-text-normal)] text-[14px] leading-[18px] mb-[-3px]"
            }
            style={{
              paintOrder: "stroke",
              WebkitTextStrokeWidth: "4px",
              WebkitTextStrokeColor: "#493B0C",
            }}
          >
            <div className={"my-[-1px] flex items-center flex-row gap-[8px]"}>
              Special Events <Link16Icon />
            </div>
          </PixelTextBox>
        </EventButton>
        <div className="relative inline-block text-[72px] leading-[86.4px]">
          <span
            className="absolute inset-0"
            style={{
              textShadow: `-3px -3px 0 #493B0C,
              3px -3px 0 #493B0C,
              -3px 3px 0 #493B0C,
              3px 3px 0 #493B0C,
              -3px 0px 0 #493B0C,
              3px 0px 0 #493B0C,
              0px -3px 0 #493B0C,
              0px 3px 0 #493B0C,
              0px 6px 0 #282001,
              3px 6px 0 #282001,
              -3px 6px 0 #282001`,
            }}
          >
            MONKE BATTLE
          </span>

          {/* Layer 2: gradient */}
          <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-[#F0E9CF] to-[#F1C315]">
            MONKE BATTLE
          </span>
        </div>
        <div
          className={
            "text-[var(--color-text-gentle)] text-[16px] leading-[20px]"
          }
        >
          Earn Points: Play Game - Complete Quests - Buy Perks
        </div>
        <div className={"flex flex-row gap-[20px] mt-[12px] mb-[40px]"}>
          <div className={"flex flex-col gap-[6px]"}>
            <div
              className={
                "text-[var(--color-text-subtle)] text-[16px] leading-[20px]"
              }
            >
              Total Monkes
            </div>
            <div
              className={
                "text-[var(--color-text-brand)] text-[24px] leading-[28px] tracking-[0.96px] text-center"
              }
            >
              {hasValue(data?.length) ? data?.length : "--"}
            </div>
          </div>
          <div
            className={"w-[2px] h-inherit bg-[var(--color-border-subtle)]"}
          ></div>
          <div className={"flex flex-col gap-[6px]"}>
            <div
              className={
                "text-[var(--color-text-subtle)] text-[16px] leading-[20px] flex flex-row gap-[4px] items-center"
              }
            >
              Reward Pool
              <StyledPopover
                content={
                  <div
                    className={
                      "text-[#f0e9cf7a] text-[10px] leading-[14px] px-[4px] my-[-2px] text-center"
                    }
                  >
                    Pool starts at{" "}
                    <span className={"text-[#F1C315]"}>$100</span>, grows{" "}
                    <span className={"text-[#F1C315]"}>+$5</span> per Monke
                  </div>
                }
              >
                <IconWrapper>
                  <DetailIcon />
                </IconWrapper>
              </StyledPopover>
            </div>
            <div
              className={
                "text-[var(--color-text-brand)] text-[24px] leading-[28px] tracking-[0.96px] text-center"
              }
            >
              {hasValue(data?.length) ? `$${100 + data.length * 5}` : "--"}
            </div>
          </div>
        </div>
        <div className={"flex flex-row gap-[16px]"}>
          {new Array(12).fill(0).map((_, index) => (
            <Image
              key={index}
              src={`/images/monke${index}.png`}
              alt={"Monke"}
              width={64}
              height={64}
            />
          ))}
        </div>
      </div>
      <div className={"py-[24px] w-full flex-1 flex flex-col items-center"}>
        <div className={"w-full max-w-[920px]"}>
          <StyledTable className="w-full">
            <colgroup>
              <col width="76" />
              <col />
              <col width="150" />
            </colgroup>
            <thead>
              <tr className="text-left text-[#F0E9CF7A]">
                <td>
                  <div>Rank</div>
                </td>
                <td className="bg-[#1d1b16] text-left">Wallet</td>
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
                              : shortAddress(asset.walletAddress, 5, "right")}
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
