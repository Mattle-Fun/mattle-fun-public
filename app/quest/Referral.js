"use client";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import CopyIcon from "@/app/assets/images/PixelCopyIcon.svg";
import LinkCopyIcon from "@/app/assets/images/PixelLinkCopyIcon.svg";
import { usePrivy } from "@privy-io/react-auth";
import { message } from "antd";
import React, { useState } from "react";
import LightningIcon from "@/app/assets/images/LightningIcon.svg";
import UserIcon from "@/app/assets/images/UserIcon.svg";
import SolTokenIcon from "@/app/assets/images/SolTokenIcon.svg";
import TrophyIcon from "@/app/assets/images/TrophyIcon.svg";
import SendIcon from "@/app/assets/images/SendIcon.svg";
import DetailIcon from "@/app/assets/images/DetailIcon.svg";
import SuccessIcon from "@/app/assets/images/SuccessIcon.svg";
import styled from "styled-components";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  claimReward,
  getReferralData,
  submitReferral,
} from "@/app/quest/referralServer";
import { queryClient } from "@/lib/react-query/providers";
import StyledPopover from "@/app/_components/StyledPopover";
import { IconWrapper } from "@/app/_components/Button";
import { hasValue, roundToDecimals, shortAddress } from "@/app/helpers";
import LoadingTable from "@/app/_components/LoadingTable";
import CopyTooltip from "@/app/_components/CopyTooltip";

const SendButton = styled.div`
  &:hover {
    path {
      fill: #f1c315;
      fill-opacity: 1;
    }
  }
`;
const StyledTable = styled.table`
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
        border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%23f0e9cf0f'/%3E%3C/svg%3E");
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
        border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%23f0e9cf0f'/%3E%3C/svg%3E");
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
    color: var(--color-text-subtle);
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
  }
`;
const CopyButtonWrapper = styled.div`
  cursor: pointer;
  &:hover {
    path:not(:first-child) {
      fill: var(--color-text-hover);
      fill-opacity: 1;
    }
  }
`;

const Referral = () => {
  const { user, ready, authenticated } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const [referralCode, setReferralCode] = useState("");
  const { data: referralData = [], isFetching } = useQuery({
    queryKey: ["referral", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => getReferralData(walletAddress),
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const result = await submitReferral(walletAddress, referralCode);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: (messageText) => {
      setReferralCode("");
      message.success(messageText);
      queryClient.invalidateQueries(["referral", walletAddress]);
    },
    onError: (error) =>
      message.error(error.message || "Failed to submit referral"),
  });

  const claimMutation = useMutation({
    mutationFn: async (questId) => {
      const result = await claimReward(walletAddress);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: (messageText) => {
      setReferralCode("");
      message.success(messageText);
      queryClient.invalidateQueries(["referral", walletAddress]);
      queryClient.invalidateQueries(["energyAndPoint", walletAddress]);
    },
    onError: (error) =>
      message.error(error.message || "Failed to claim rewards"),
  });

  return (
    <div className={"px-[64px] pt-[24px]"}>
      <div className={"flex flex-row gap-[16px]"}>
        <PixelBorderBox color={"1d1b16"} className={"flex-1 py-[3px]"}>
          <div className={"mx-[-1px]"}>
            <div
              className={
                "px-[8px] pt-[4px] pb-[15px] flex flex-col gap-[8px] border-b border-[#f0e9cf14] mb-[12px]"
              }
            >
              <div
                className={
                  "text-[var(--color-text-gentle)] text-[16px] leading-[20px]"
                }
              >
                Invite your friends
              </div>
              <div
                className={
                  "flex flex-row items-center gap-[8px] text-[var(--color-text-subtle)] text-[14px] leading-[18px] "
                }
              >
                <div className={"whitespace-nowrap"}>
                  Your ref:{" "}
                  <span className={"text-[#C9A0FF]"}>{walletAddress}</span>
                </div>
                <StyledPopover
                  content={
                    <div
                      className={
                        "px-[4px] my-[-2px] text-[#F0E9CF] text-[10px] leading-[14px]"
                      }
                    >
                      Copy code
                    </div>
                  }
                >
                  <CopyTooltip text={walletAddress}>
                    <CopyButtonWrapper>
                      <CopyIcon />
                    </CopyButtonWrapper>
                  </CopyTooltip>
                </StyledPopover>
                <StyledPopover
                  content={
                    <div
                      className={
                        "px-[4px] my-[-2px] text-[#F0E9CF] text-[10px] leading-[14px]"
                      }
                    >
                      Copy link
                    </div>
                  }
                >
                  <CopyTooltip
                    text={`https://${window.location.host}?ref=${walletAddress}`}
                  >
                    <CopyButtonWrapper>
                      <LinkCopyIcon />
                    </CopyButtonWrapper>
                  </CopyTooltip>
                </StyledPopover>
              </div>
              <div
                className={
                  "flex flex-row text-[#f0e9cf7a] text-[14px] leading-[18px] gap-[4px]"
                }
              >
                Earn
                <div className={"flex flex-row gap-[2px]"}>
                  <span className={"text-[var(--color-text-normal)]"}>+3</span>
                  <LightningIcon
                    className={"m-[-4px]"}
                    style={{ transform: "scale(0.666666667)" }}
                  />
                </div>
                and
                <div className={"flex flex-row gap-[2px]"}>
                  <span className={"text-[var(--color-text-normal)]"}>
                    +1000
                  </span>
                  <TrophyIcon
                    className={"m-[-4px]"}
                    style={{ transform: "scale(0.666666667)" }}
                  />
                </div>
                for each eligible referral
              </div>
            </div>
            <div className={"px-[8px] py-[4px] flex flex-col"}>
              <div className={"text-[#f0e9cfb8] text-[16px] leading-[20px]"}>
                {referralData?.referredBy
                  ? "Your referrer"
                  : "Enter your referral code"}
              </div>
              {referralData?.referredBy ? (
                <div
                  className={
                    "text-[var(--color-text-subtle)] text-[14px] leading-[18px] mt-[8px]"
                  }
                >
                  {shortAddress(referralData?.referredBy, 5, "right")}
                </div>
              ) : (
                <div className={"flex flex-row gap-[8px] mt-[16px]"}>
                  <PixelBorderBox
                    color={"F0E9CF1A"}
                    className={
                      "flex-1 flex flex-row items-center text-[#FAFAFA] font-[400] text-[14px] leading-[18px] gap-[6px] px-[7px]"
                    }
                  >
                    <input
                      className={
                        "border-none bg-transparent outline-none shadow-none text-[#F0E9CF] placeholder-[#f0e9cf7a] w-full my-[-1px]"
                      }
                      placeholder="Enter waller address"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                    />
                  </PixelBorderBox>
                  <SendButton>
                    <PixelBorderBox
                      as={"button"}
                      color={"F0E9CF1A"}
                      hoverColor={"4a463b"}
                      onClick={submitMutation.mutate}
                      disabled={!referralCode || submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        <div className="size-[16px] mx-[7px] border-2 border-[#F0E9CF] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <SendIcon className={"my-[-5px] mx-[3px]"} />
                      )}
                    </PixelBorderBox>
                  </SendButton>
                </div>
              )}
            </div>
          </div>
        </PixelBorderBox>
        <PixelBorderBox
          color={"1d1b16"}
          className={"px-[5px] py-[7px] min-w-[228px]"}
        >
          <div className={"h-full flex flex-col justify-between"}>
            <div className={"flex flex-col gap-[12px]"}>
              <div
                className={
                  "flex flex-row items-center gap-[4px] text-[#f0e9cf7a] text-[14px] leading-[18px]"
                }
              >
                Reward
                <StyledPopover
                  content={
                    <div
                      className={
                        "text-[#f0e9cf7a] text-[10px] leading-[14px] px-[4px] my-[-2px]"
                      }
                    >
                      You have{" "}
                      <span className={"text-[#F1C315]"}>
                        {hasValue(referralData?.unclaimedCount)
                          ? referralData?.unclaimedCount
                          : "--"}
                      </span>{" "}
                      unclaimed referrals
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
                  "flex flex-row gap-[8px] items-center text-[#F0E9CF] text-[20px] leading-[24px]"
                }
              >
                <LightningIcon />
                {hasValue(referralData?.unclaimedCount)
                  ? referralData?.unclaimedCount * 3
                  : "--"}
              </div>
              <div
                className={
                  "flex flex-row gap-[8px] items-center text-[#F0E9CF] text-[20px] leading-[24px]"
                }
              >
                <TrophyIcon />
                {hasValue(referralData?.unclaimedCount)
                  ? referralData?.unclaimedCount * 1000
                  : "--"}
              </div>
            </div>
            <PixelBorderBox
              as={"button"}
              className={`${claimMutation.isPending || !referralData?.unclaimedCount ? "text-[#F0E9CF3D] cursor-not-allowed" : "text-[#100d08e6]"} w-fit  text-[16px] leading-[24px] text-center px-[7px]`}
              hoverColor={
                claimMutation.isPending || !referralData?.unclaimedCount
                  ? ""
                  : "F0D469"
              }
              color={
                claimMutation.isPending || !referralData?.unclaimedCount
                  ? "F0E9CF0A"
                  : "F1C315"
              }
              onClick={claimMutation.mutate}
              disabled={
                claimMutation.isPending || !referralData?.unclaimedCount
              }
            >
              <div className={"my-[-4px]"}>
                {claimMutation.isPending ? "Claiming" : "Claim"}
              </div>
            </PixelBorderBox>
          </div>
        </PixelBorderBox>
        <PixelBorderBox
          color={"1d1b16"}
          className={"px-[5px] py-[7px] min-w-[228px]"}
        >
          <div className={"h-full flex flex-col"}>
            <div
              className={
                "flex flex-col gap-[12px] border-b border-[var(--color-border-subtle)] pb-[16px] mb-[16px]"
              }
            >
              <div
                className={
                  "flex flex-row items-center gap-[4px] text-[#f0e9cf7a] text-[14px] leading-[18px]"
                }
              >
                Eligibility
                <StyledPopover
                  content={
                    <div
                      className={
                        "text-[#f0e9cf7a] text-[10px] leading-[14px] px-[4px] my-[-2px] text-center"
                      }
                    >
                      Referees must have <br />a{" "}
                      <span className={"text-[#F1C315]"}>Game Pass</span> to be
                      eligible
                    </div>
                  }
                >
                  <IconWrapper>
                    <DetailIcon />
                  </IconWrapper>
                </StyledPopover>
              </div>
              <div className={"flex flex-row gap-[10px] items-baseline"}>
                <UserIcon
                  style={{ transform: "scale(1.25)" }}
                  className={"mb-[2px]"}
                />
                <div
                  className={
                    "text-[var(--color-text-subtle)] text-[20px] leading-[24px]"
                  }
                >
                  <span className={"text-[var(--color-text-normal)]"}>
                    {referralData?.totalCount || 0}
                  </span>
                  /{referralData?.referralList?.length || 0}
                </div>
              </div>
            </div>
            <div className={"flex flex-col gap-[12px]"}>
              <div
                className={
                  "flex flex-row items-center gap-[4px] text-[#f0e9cf7a] text-[14px] leading-[18px]"
                }
              >
                Commission
                <StyledPopover
                  content={
                    <div
                      className={
                        "text-[#f0e9cf7a] text-[10px] leading-[14px] px-[4px] my-[-2px] text-center"
                      }
                    >
                      You earn <span className={"text-[#F1C315]"}>20%</span> of
                      each
                      <br />
                      referee expense
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
                  "flex flex-row gap-[8px] items-center text-[#F0E9CF] text-[20px] leading-[24px]"
                }
              >
                <SolTokenIcon
                  style={{ transform: "scale(0.75)" }}
                  className={"m-[-4px]"}
                />
                {roundToDecimals(referralData?.totalCommission || 0, 4)}
              </div>
            </div>
          </div>
        </PixelBorderBox>
      </div>
      <div className={"flex flex-col"}>
        <PixelBorderBox
          color={"1d1b16"}
          className={"mt-[16px] px-[7px] py-[3px] flex flex-col"}
        >
          <div className={"flex flex-col"}>
            <StyledTable className={"w-full tracking-[0.64px]"}>
              <colgroup>
                <col />
                <col width="80" />
                <col width="141" />
              </colgroup>
              <thead>
                <tr className="text-left text-[#F0E9CF7A]">
                  <td>
                    <div>Referral Wallet</div>
                  </td>
                  <td className="bg-[#f0e9cf0f] text-center">Eligibility</td>
                  <td>
                    <div className="text-right">
                      <p
                        className={
                          "flex flex-row justify-end items-center gap-[4px]"
                        }
                      >
                        Expense{" "}
                        <StyledPopover
                          content={
                            <div
                              className={
                                "text-[#f0e9cf7a] text-[10px] leading-[14px] px-[4px] my-[-2px]"
                              }
                            >
                              Total expenses incurred <br />
                              since&nbsp;
                              <span className={"text-[#F1C315]"}>
                                referral activation
                              </span>
                            </div>
                          }
                        >
                          <IconWrapper as={"span"}>
                            <DetailIcon />
                          </IconWrapper>
                        </StyledPopover>
                      </p>
                    </div>
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
                  {referralData?.referralList?.length > 0 ? (
                    <StyledTable className="w-full">
                      <colgroup>
                        <col />
                        <col width="80" />
                        <col width="141" />
                      </colgroup>
                      <tbody>
                        <tr className={"h-[5px]"} />
                        {referralData?.referralList?.map((asset, index) => (
                          <tr key={index}>
                            <td className={`text-left`}>
                              <div>
                                {shortAddress(asset?.address, 3, "right")}
                              </div>
                            </td>
                            <td className={`text-center`}>
                              {asset.isEligible && (
                                <SuccessIcon className="m-auto" />
                              )}
                            </td>
                            <td className="text-right">
                              <div>
                                <span
                                  className={"text-[var(--color-text-normal)]"}
                                >
                                  {hasValue(asset.totalSolSpent)
                                    ? asset.totalSolSpent
                                    : "0"}
                                </span>{" "}
                                SOL
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
                      You have no referee
                      <br />
                      Invite your friends and get rewards!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </PixelBorderBox>
      </div>
    </div>
  );
};

export default Referral;
