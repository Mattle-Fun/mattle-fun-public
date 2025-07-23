"use client";
import LoadingTable from "@/app/_components/LoadingTable";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import StatusIcon from "@/app/quest/StatusIcon";
import LightningIcon from "@/app/assets/images/LightningIcon.svg";
import TrophyIcon from "@/app/assets/images/TrophyIcon.svg";
import VerticalBarProgress from "@/app/_components/VerticalBarProgress";
import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { claimQuestReward, getDailyQuests } from "@/app/quest/server";
import { message } from "antd";
import { queryClient } from "@/lib/react-query/providers";

const DailyQuest = () => {
  const [activeQuestId, setActiveQuestId] = useState(null);
  const { user, ready, authenticated } = usePrivy();
  const wallet = user?.wallet;
  const { data: dailyQuests = [], isFetching: questLoading } = useQuery({
    queryKey: ["dailyQuests", wallet?.address],
    enabled: !!wallet?.address,
    queryFn: async () => {
      const result = await getDailyQuests(wallet.address);
      if (!result.success) throw new Error(result.message);
      return result.quests;
    },
    onError: (error) => {
      message.error(error.message || "Failed to fetch daily quests");
    },
  });

  const claimQuestMutation = useMutation({
    mutationFn: async (questId) => {
      if (!wallet?.address) throw new Error("Please connect your wallet first");
      const result = await claimQuestReward(wallet.address, questId);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: (messageText) => {
      message.success(messageText);
      queryClient.invalidateQueries(["dailyQuests", wallet?.address]);
      queryClient.invalidateQueries(["energyAndPoint", wallet?.address]);
    },
    onError: (error) => {
      message.error(error.message || "Failed to claim quest reward");
    },
  });
  const handleClaimQuest = (questId) => {
    setActiveQuestId(questId);
    claimQuestMutation.mutate(questId, {
      onSettled: () => setActiveQuestId(null),
    });
  };

  return (
    <div className={"flex-1"}>
      {questLoading ? (
        <LoadingTable
          className={"mt-[15px] px-[64px]"}
          title={false}
          active
          paragraph={{ rows: 5 }}
        />
      ) : (
        <div>
          <div className={"py-[24px] px-[64px] grid grid-cols-4 gap-[16px]"}>
            {dailyQuests?.length > 0 &&
              dailyQuests.map((quest, index) => (
                <PixelBorderBox
                  key={index}
                  color={"1D1B16"}
                  className={"py-[3px] z-[1]"}
                >
                  <div className={"px-[4px]"}>
                    <div className={"mx-[-1px]"}>
                      <StatusIcon
                        color={
                          quest?.claimed
                            ? "#00FF97"
                            : quest?.completed
                              ? "#F1C315"
                              : "#f0e9cf7a"
                        }
                      />
                    </div>
                    <div
                      className={
                        "text-[#F0E9CF] text-[16px] leading-[20px] mt-[8px] h-[40px]"
                      }
                      dangerouslySetInnerHTML={{
                        __html: quest?.description?.replace(
                          /\d+/g,
                          (match) =>
                            `<span style="color: #F1C315">${match}</span>`,
                        ),
                      }}
                    />
                  </div>
                  <div
                    className={
                      "text-[#f0e9cfb8] flex flex-row gap-[8px] border-y border-[#f0e9cf14] my-[12px] py-[12px]"
                    }
                  >
                    <div
                      className={
                        "flex flex-row items-center gap-[4px] px-[4px]"
                      }
                    >
                      <LightningIcon
                        className={"m-[-6px]"}
                        style={{ transform: "scale(0.666666667)" }}
                      />
                      <div className={"text-[14px] leading-[18px]"}>
                        +{quest?.rewards?.energy}
                      </div>
                    </div>
                    <div
                      className={
                        "flex flex-row items-center gap-[4px] px-[4px]"
                      }
                    >
                      <TrophyIcon
                        className={"m-[-6px]"}
                        style={{ transform: "scale(0.666666667)" }}
                      />
                      <div className={"text-[14px] leading-[18px]"}>
                        +{quest?.rewards?.point}
                      </div>
                    </div>
                  </div>
                  {quest?.claimed ? (
                    <PixelBorderBox
                      as={"button"}
                      color={"F0E9CF0A"}
                      className={`w-full`}
                      disabled={true}
                    >
                      <div
                        className={
                          "text-[#F0E9CF3D] text-[16px] leading-[20px] my-[-2px]"
                        }
                      >
                        Claimed
                      </div>
                    </PixelBorderBox>
                  ) : quest?.completed ? (
                    <PixelBorderBox
                      as={"button"}
                      hoverColor={"F0D469"}
                      color={"F1C315"}
                      className={`w-full`}
                      disabled={
                        activeQuestId === quest.id &&
                        claimQuestMutation.isPending
                      }
                      onClick={() => handleClaimQuest(quest.id)}
                    >
                      <div
                        className={
                          "text-[#100D08E5] text-[16px] leading-[20px] my-[-2px]"
                        }
                      >
                        {activeQuestId === quest.id &&
                        claimQuestMutation.isPending
                          ? "Claiming"
                          : "Claim"}
                      </div>
                    </PixelBorderBox>
                  ) : (
                    <div className={"pl-[4px] pb-[4px]"}>
                      <VerticalBarProgress
                        percentage={Math.ceil(quest.progress || 0)}
                      />
                    </div>
                  )}
                </PixelBorderBox>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyQuest;
