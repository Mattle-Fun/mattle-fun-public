import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { claimReward, getHoldingList } from "@/app/holding/server";
import { message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import { TokenLogo20 } from "@/app/_components/TokenLogo";
import StatusIcon from "@/app/quest/StatusIcon";
import { BONUS_HOLDING_LEVELS } from "@/app/constants";
import LightningIcon from "@/app/assets/images/LightningIcon.svg";
import TrophyIcon from "@/app/assets/images/TrophyIcon.svg";
import { queryClient } from "@/lib/react-query/providers";
import LoadingTable from "@/app/_components/LoadingTable";

const Card = ({ value, contract }) => {
  const { user, authenticated, ready } = usePrivy();
  const walletAddress = user?.wallet?.address;

  const availableLevels = value.levels
    .filter((i) => i.metCondition && !i.claimed)
    .map((i) => i.level);
  const activeLevel = value.levels
    .slice()
    .reverse()
    .find((x) => Boolean(x.metCondition));
  const threshold = activeLevel
    ? activeLevel.claimed
      ? BONUS_HOLDING_LEVELS[
          Math.min(activeLevel.level, value.levels.length - 1)
        ].threshold
      : BONUS_HOLDING_LEVELS[activeLevel.level - 1].threshold
    : BONUS_HOLDING_LEVELS[0].threshold;

  const claimMutation = useMutation({
    mutationFn: async (questId) => {
      if (!walletAddress) throw new Error("Please connect your wallet first");
      const result = await Promise.all(
        availableLevels.map((level) =>
          claimReward(walletAddress, contract, level),
        ),
      );
      if (result.some((i) => !i.success))
        throw new Error("Failed to claim reward");
    },
    onSuccess: (messageText) => {
      message.success("Reward claimed successfully");
      queryClient.invalidateQueries(["holder", walletAddress]);
      queryClient.invalidateQueries(["energyAndPoint", walletAddress]);
    },
    onError: (error) => {
      message.error(error.message || "Failed to claim reward");
    },
  });
  return (
    <PixelBorderBox
      color={"1D1B16"}
      className={"py-[3px] flex flex-col gap-[12px]"}
    >
      <div className={"flex flex-col gap-[8px] my-[-1px] px-[4px]"}>
        <div
          className={
            "flex flex-row gap-[8px] items-center text-[var(--color-text-subtle)] text-[12px] leading-[16px]"
          }
        >
          <TokenLogo20 imageHref={value.logoURI} />
          {value.name}
        </div>
        <div
          className={
            "h-[40px] text-[var(--color-text-normal)] text-[16px] leading-[20px]"
          }
        >
          Hold{" "}
          <span className={"text-[var(--color-text-brand)]"}>{`>$${
            threshold
          }`}</span>{" "}
          {value.symbol}
        </div>
      </div>
      <div className={"h-[1px] bg-[var(--color-border-subtle)]"} />
      <div className={"flex flex-col px-[4px]"}>
        <div className={"flex flex-row items-center justify-between"}>
          <div
            className={
              "flex flex-row items-center gap-[8px] text-[var(--color-text-subtle)] text-[14px] leading-[18px]"
            }
          >
            <StatusIcon
              color={
                value.levels[0].metCondition && value.levels[0].claimed
                  ? "#00FF97"
                  : value.levels[0].metCondition
                    ? "#F1C315"
                    : "#f0e9cf7a"
              }
            />
            <div>${BONUS_HOLDING_LEVELS[0].threshold}</div>
          </div>
          {value.levels[0].metCondition && value.levels[0].claimed ? (
            <div
              className={
                "text-[var(--color-text-disabled)] text-[14px] leading-[18px]"
              }
            >
              Claimed
            </div>
          ) : (
            <div
              className={
                "flex flex-row items-center text-[var(--color-text-gentle)] text-[14px] leading-[18px]"
              }
            >
              <LightningIcon
                className={"m-[-6px]"}
                style={{ transform: "scale(0.666666667)" }}
              />
              <div className={"ml-[4px] mr-[8px]"}>
                +{BONUS_HOLDING_LEVELS[0].energy}
              </div>
              <TrophyIcon
                className={"m-[-6px]"}
                style={{ transform: "scale(0.666666667)" }}
              />
              <div className={"ml-[4px]"}>
                +{BONUS_HOLDING_LEVELS[0].points}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            backgroundColor:
              value.levels[0].metCondition && value.levels[0].claimed
                ? "#00FF97"
                : value.levels[0].metCondition
                  ? "#F1C315"
                  : "#827E6F",
          }}
          className={`h-[15px] w-[1px] mb-[1px] mx-[7.5px]`}
        />
        <div className={"flex flex-row items-center justify-between"}>
          <div
            className={
              "flex flex-row items-center gap-[8px] text-[var(--color-text-subtle)] text-[14px] leading-[18px]"
            }
          >
            <StatusIcon
              color={
                value.levels[1].metCondition && value.levels[1].claimed
                  ? "#00FF97"
                  : value.levels[1].metCondition
                    ? "#F1C315"
                    : "#f0e9cf7a"
              }
            />
            <div>${BONUS_HOLDING_LEVELS[1].threshold}</div>
          </div>
          {value.levels[1].metCondition && value.levels[1].claimed ? (
            <div
              className={
                "text-[var(--color-text-disabled)] text-[14px] leading-[18px]"
              }
            >
              Claimed
            </div>
          ) : (
            <div
              className={
                "flex flex-row items-center text-[var(--color-text-gentle)] text-[14px] leading-[18px]"
              }
            >
              <LightningIcon
                className={"m-[-6px]"}
                style={{ transform: "scale(0.666666667)" }}
              />
              <div className={"ml-[4px] mr-[8px]"}>
                +{BONUS_HOLDING_LEVELS[1].energy}
              </div>
              <TrophyIcon
                className={"m-[-6px]"}
                style={{ transform: "scale(0.666666667)" }}
              />
              <div className={"ml-[4px]"}>
                +{BONUS_HOLDING_LEVELS[1].points}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            backgroundColor:
              value.levels[1].metCondition && value.levels[1].claimed
                ? "#00FF97"
                : value.levels[2].metCondition
                  ? "#F1C315"
                  : "#827E6F",
          }}
          className={"h-[15px] w-[1px] mb-[1px] mx-[7.5px]"}
        />
        <div className={"flex flex-row items-center justify-between"}>
          <div
            className={
              "flex flex-row items-center gap-[8px] text-[var(--color-text-subtle)] text-[14px] leading-[18px]"
            }
          >
            <StatusIcon
              color={
                value.levels[2].metCondition && value.levels[2].claimed
                  ? "#00FF97"
                  : value.levels[2].metCondition
                    ? "#F1C315"
                    : "#f0e9cf7a"
              }
            />
            <div>${BONUS_HOLDING_LEVELS[2].threshold}</div>
          </div>
          {value.levels[2].metCondition && value.levels[2].claimed ? (
            <div
              className={
                "text-[var(--color-text-disabled)] text-[14px] leading-[18px]"
              }
            >
              Claimed
            </div>
          ) : (
            <div
              className={
                "flex flex-row items-center text-[var(--color-text-gentle)] text-[14px] leading-[18px]"
              }
            >
              <LightningIcon
                className={"m-[-6px]"}
                style={{ transform: "scale(0.666666667)" }}
              />
              <div className={"ml-[4px] mr-[8px]"}>
                +{BONUS_HOLDING_LEVELS[2].energy}
              </div>
              <TrophyIcon
                className={"m-[-6px]"}
                style={{ transform: "scale(0.666666667)" }}
              />
              <div className={"ml-[4px]"}>
                +{BONUS_HOLDING_LEVELS[2].points}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={"h-[1px] bg-[var(--color-border-subtle)]"} />
      {availableLevels.length > 0 ? (
        <PixelBorderBox
          as={"button"}
          hoverColor={"F0D469"}
          color={"F1C315"}
          className={`w-full`}
          disabled={claimMutation.isPending}
          onClick={claimMutation.mutate}
        >
          <div
            className={
              "text-center flex justify-center items-center text-[#100D08E5] text-[16px] leading-[20px] my-[-2px]"
            }
          >
            {claimMutation.isPending ? (
              <div className="size-[20px] mx-[7px] border-2 border-[#F0E9CF] border-t-transparent rounded-full animate-spin" />
            ) : availableLevels.length > 1 ? (
              "Claim All"
            ) : (
              "Claim"
            )}
          </div>
        </PixelBorderBox>
      ) : (
        <PixelBorderBox
          as={"button"}
          color={"F0E9CF0A"}
          className={`w-full`}
          disabled={true}
        >
          <div
            className={"text-[#F0E9CF3D] text-[16px] leading-[20px] my-[-2px]"}
          >
            {activeLevel ? "Claimed" : "Claim"}
          </div>
        </PixelBorderBox>
      )}
    </PixelBorderBox>
  );
};
const Holder = ({ isPending }) => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data = {}, isFetching } = useQuery({
    queryKey: ["holder", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      const data = await getHoldingList(walletAddress);
      if (!data.success) throw new Error("Failed to fetch holding data");
      return data?.holdingData;
    },
  });

  return (
    <div className={"px-[64px] pt-[24px] w-full"}>
      {isFetching || isPending ? (
        <LoadingTable
          className={"mt-[15px]"}
          title={false}
          active
          paragraph={{ rows: 5 }}
        />
      ) : Object.keys(data).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
          {Object.entries(data).map(([key, value]) => (
            <Card value={value} key={key} contract={key} />
          ))}
        </div>
      ) : (
        "No Data"
      )}
    </div>
  );
};

export default React.memo(Holder);
