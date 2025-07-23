"use client";

import React, { useEffect, useState } from "react";
import { getEnergyAndPoint } from "./server";
import { usePrivy } from "@privy-io/react-auth";
import styled from "styled-components";
import LightningIcon from "@/app/assets/images/LightningIcon.svg";
import TrophyIcon from "@/app/assets/images/TrophyIcon.svg";
import { QuestTypes } from "@/app/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { hasValue } from "@/app/helpers";
import Loading from "@/app/loading";
import { SubLogin } from "@/app/_login/LoginPage";
import DailyQuest from "./DailyQuest";
import { useSearchParams } from "next/navigation";
import Referral from "@/app/quest/Referral";
import Holder from "@/app/quest/Holder";
import RetweetIcon from "@/app/assets/images/RetweetIcon.svg";
import { IconWrapper } from "@/app/_components/Button";
import { queryClient } from "@/lib/react-query/providers";
import { calcPnL } from "@/app/dashboard/server";
import { GoToShop } from "@/app/shop/page";
import { checkGamePassPurchased } from "@/app/shop/server";

export const IconBox = styled.div`
  border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 38 38' fill='none'%3E%3Cpath d='M30.5 1.5V4.5H33.5V7.5H36.5V30.5H33.5V33.5H30.5V36.5H7.5V33.5H4.5V30.5H1.5V7.5H4.5V4.5H7.5V1.5H30.5Z' fill='%23282001' stroke='%23${(
    props,
  ) =>
    props.$colorBorder
      ? props.$colorBorder
      : "6B5409"}' stroke-width='3'/%3E%3C/svg%3E");
  border-style: solid;
  border-width: 12px;
  border-image-slice: 12 fill;
  border-image-repeat: stretch;
  color: #f0e9cf;
  box-sizing: border-box;
`;

export default function DailyQuestPage() {
  const searchParams = useSearchParams();
  const { user, ready, authenticated } = usePrivy();
  const wallet = user?.wallet;
  const [tab, setTab] = useState(QuestTypes.Daily);

  const { data } = useQuery({
    queryKey: ["energyAndPoint", wallet?.address],
    enabled: !!wallet?.address,
    queryFn: () => getEnergyAndPoint(wallet?.address),
  });
  const { data: isGamePassPurchased, isFetching } = useQuery({
    queryKey: ["checkGamePassPurchased", wallet?.address],
    enabled: !!wallet?.address,
    queryFn: async () => {
      try {
        const bool = await checkGamePassPurchased(wallet?.address);
        return bool;
      } catch (e) {
        return false;
      }
    },
  });
  const calcPnLMutation = useMutation({
    mutationFn: () => calcPnL(wallet?.address),
    onSuccess: () => {
      queryClient.invalidateQueries(["holder", wallet?.address]);
    },
  });
  const onTab = (value) => {
    setTab(value);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };
  useEffect(() => {
    const input = searchParams.get("tab");
    if (input && Object.values(QuestTypes).includes(input)) setTab(input);
  }, [searchParams]);
  if (!ready || isFetching) return <Loading />;
  if (ready && !authenticated) return <SubLogin />;
  if (isGamePassPurchased !== true)
    return (
      <GoToShop description={"Claim your Game Pass to unlock Quest Hub"} />
    );
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
        <div
          className={
            "text-[#F0E9CF] text-[56px] leading-[60px] mt-[8px] mb-[24px]"
          }
        >
          Quest Hub
        </div>
        <div className={"flex flex-row gap-[10px]"}>
          <div className={"flex flex-row items-center"}>
            <IconBox className={"z-[1]"}>
              <LightningIcon className={"m-[-1px]"} />
            </IconBox>
            <IconBox
              $colorBorder={"493B0C"}
              className={
                "ml-[-46px] pl-[47px] pr-[3px] text-[#F0E9CF] text-[16px] leading-[20px] tracking-[0.64px] min-w-[124px]"
              }
            >
              <div className={"my-[-2px]"}>
                {hasValue(data?.remainEnergy) ? data?.remainEnergy : "--"}
                <span className={"text-[#f0e9cf7a]"}>
                  /{hasValue(data?.totalEnergy) ? data?.totalEnergy : "--"}
                </span>
              </div>
            </IconBox>
          </div>
          <div className={"flex flex-row items-center"}>
            <IconBox className={"z-[1]"}>
              <TrophyIcon className={"m-[-1px]"} />
            </IconBox>
            <IconBox
              $colorBorder={"493B0C"}
              className={
                "ml-[-46px] pl-[47px] pr-[3px] text-[#F0E9CF] text-[16px] leading-[20px] tracking-[0.64px] min-w-[124px]"
              }
            >
              <div className={"my-[-2px]"}>
                {hasValue(data?.totalPoint) ? data?.totalPoint : "--"}
              </div>
            </IconBox>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between flex-row px-[48px] border-t border-b border-[#493B0C] text-[#F0E9CF7A] font-[400] text-[16px] leading-[20px] ">
        <div className="flex items-center flex-row">
          {Object.keys(QuestTypes).map((type, index) => (
            <div
              key={index}
              className={`py-[12px] px-[16px] cursor-pointer ${tab === type && "text-[#F1C315]"}`}
              onClick={() => onTab(type)}
            >
              {type}
            </div>
          ))}
        </div>
        {tab === QuestTypes.Holder && (
          <IconWrapper
            className="text-[#F0E9CF] hover:text-[#f1c315] flex items-center flex-row gap-[8px] cursor-pointer px-[22px] py-[8px]"
            onClick={calcPnLMutation.mutate}
          >
            <RetweetIcon />
            <div>Refresh</div>
          </IconWrapper>
        )}
      </div>
      {tab === QuestTypes.Daily && <DailyQuest />}
      {tab === QuestTypes.Referral && <Referral />}
      {tab === QuestTypes.Holder && <Holder />}
      {[QuestTypes.Social].includes(tab) && (
        <div
          className={
            "text-center text-[var(--color-text-gentle)] text-[18px] leading-[24px] pt-[30px]"
          }
        >
          Coming soon...
        </div>
      )}
    </div>
  );
}
