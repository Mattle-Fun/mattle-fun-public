"use client";

import React, { useState } from "react";
import { getData, buyPackageWithSol, checkGamePassPurchased } from "./server";
import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth";
import {
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";
import { ENERGY_PACKAGES, MULTIPLY_PACKAGES } from "@/app/constants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import { IconWrapper } from "@/app/_components/Button";
import DetailIcon from "@/app/assets/images/DetailIcon.svg";
import StyledPopover from "@/app/_components/StyledPopover";
import styled from "styled-components";
import LightningIcon from "@/app/assets/images/LightningIcon.svg";
import RetweetIcon from "@/app/assets/images/RetweetIcon.svg";
import Token24Icon from "@/app/assets/images/Token24Icon.svg";
import { IconBox } from "@/app/quest/page";
import SolTokenIcon from "@/app/assets/images/SolTokenIcon.svg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { queryClient } from "@/lib/react-query/providers";
import Loading, { Spin } from "@/app/loading";
import { hasValue } from "@/app/helpers";
import Countdown from "@/app/_components/CountDown";
import { SubLogin } from "@/app/_login/LoginPage";
import Link from "next/link";
dayjs.extend(duration);
dayjs.extend(utc);

const PixelBox = styled.div`
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

const PixelTextBox = styled.div`
  border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'%3E%3Cpath d='M13 0V2H16V4H18V14H16V16H13V18H5V16H2V14H0V4H2V2H5V0H13Z' fill='%23f0e9cf1a'/%3E%3C/svg%3E");
  border-style: solid;
  border-width: 8px;
  border-image-slice: 8 fill;
  border-image-repeat: stretch;
  box-sizing: border-box;
`;

const PixelButton = styled.button`
  border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 38 38' fill='none'%3E%3Cpath d='M30.5 1.5V4.5H33.5V7.5H36.5V30.5H33.5V33.5H30.5V36.5H7.5V33.5H4.5V30.5H1.5V7.5H4.5V4.5H7.5V1.5H30.5Z' fill='%23F1C315' stroke='%236B5409' stroke-width='3'/%3E%3C/svg%3E");
  border-style: solid;
  border-width: 9px;
  border-image-slice: 9 fill;
  border-image-repeat: stretch;
  width: -webkit-fill-available;
  margin: 9px -12px -12px -12px;
  color: var(--color-text-normal);
  text-shadow:
    -1px -1px 0 #6b5409,
    1px -1px 0 #6b5409,
    -1px 1px 0 #6b5409,
    1px 1px 0 #6b5409,
    -1px 0px 0 #6b5409,
    1px 0px 0 #6b5409,
    0px -1px 0 #6b5409,
    0px 1px 0 #6b5409,
    0px 2px 0 #493b0c,
    1px 2px 0 #493b0c,
    -1px 2px 0 #493b0c;
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 125% */
  padding: 4px 0;
  &:hover {
    border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 38 38' fill='none'%3E%3Cpath d='M30.5 1.5V4.5H33.5V7.5H36.5V30.5H33.5V33.5H30.5V36.5H7.5V33.5H4.5V30.5H1.5V7.5H4.5V4.5H7.5V1.5H30.5Z' fill='%23F0D469' stroke='%236B5409' stroke-width='3'/%3E%3C/svg%3E");
  }
`;

const RefreshButton = styled.div`
  path {
    fill: #f1c315;
  }
  &:hover {
    color: #f0d469;
    path {
      fill: #f0d469;
    }
  }
`;
export const ENERGY_URLS = [
  { image: "/images/energy_pass.png", icon: "/images/energy_pass_icon.png" },
  { image: "/images/energy_x50.png", icon: "/images/energy_x50_icon.png" },
  { image: "/images/energy_x100.png", icon: "/images/energy_x100_icon.png" },
];
export const POINT_URLS = [
  { image: "/images/point_x2.png", icon: "/images/point_x2_icon.png" },
  { image: "/images/point_x3.png", icon: "/images/point_x3_icon.png" },
  { image: "/images/point_x5.png", icon: "/images/point_x5_icon.png" },
];
export default function ShopPage() {
  const [api, contextHolder] = notification.useNotification();
  const { user, ready, authenticated } = usePrivy();
  const { wallets } = useSolanaWallets();
  const walletAddress = user?.wallet?.address;
  const desiredWallet = wallets?.find(
    (wallet) => walletAddress === wallet.address,
  );
  const [activePackage, setActivePackage] = useState(null);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["shop", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => getData(walletAddress),
  });

  const { data: isGamePassPurchased, isFetching: isGamePassFetching } =
    useQuery({
      queryKey: ["checkGamePassPurchased", walletAddress],
      enabled: !!walletAddress,
      queryFn: async () => {
        try {
          const bool = await checkGamePassPurchased(walletAddress);
          return bool;
        } catch (e) {
          return false;
        }
      },
    });
  const buyMutation = useMutation({
    mutationFn: async (pkg) => {
      setActivePackage(JSON.stringify(pkg));
      if (!walletAddress) {
        throw new Error("Please connect your wallet first");
      }
      try {
        const response = await buyPackageWithSol(
          walletAddress,
          pkg.tier,
          pkg.type,
        );
        if (response?.success === false) throw new Error(response?.message);

        const messageV0 = new TransactionMessage({
          payerKey: new PublicKey(desiredWallet.address),
          recentBlockhash: response.message.recentBlockhash,
          instructions: response.message.instructions.map((ix) => ({
            programId: new PublicKey(ix.programId),
            keys: ix.keys.map((k) => ({
              pubkey: new PublicKey(k.pubkey),
              isSigner: k.isSigner,
              isWritable: k.isWritable,
            })),
            data: Buffer.from(ix.data, "base64"),
          })),
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);
        const signedTransaction =
          await desiredWallet.signTransaction(transaction);
        if (signedTransaction) {
          const serializedTransaction = signedTransaction.serialize();
          const base58Transaction = bs58.encode(serializedTransaction);
          const result = await jitoClient.sendTxn([base58Transaction], false);
          const signature = result.result;
          // Wait a bit for the transaction to be confirmed
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return signature;
        }
      } catch (err) {
        throw new Error(err?.message || "Failed to purchase");
      } finally {
      }
    },
    onSuccess: (signature) => {
      api.success({
        message: "Purchase completed",
        description: (
          <div>
            <div
              className={
                "text-[14px] text-[var(--color-text-inverse-nomal)] leading-[18px] mb-[8px]"
              }
            >
              Please refresh to sync your perk on-chain
            </div>
            <a href={`https://solscan.io/tx/${signature}`} target={"_blank"}>
              View Transaction
            </a>
          </div>
        ),
        placement: "bottomRight",
      });
      queryClient.invalidateQueries(["shop", walletAddress]);
      queryClient.invalidateQueries(["checkGamePassPurchased", walletAddress]);
    },
    onError: (error) => {
      api.error({
        message: "Purchase failed",
        description: (
          <div
            className={
              "text-[14px] text-[var(--color-text-inverse-nomal)] leading-[18px] mb-[8px]"
            }
          >
            {error?.message === "Insufficient SOL"
              ? "Insufficient SOL. Please top up your wallet"
              : "Please try again"}
          </div>
        ),
        placement: "bottomRight",
      });
    },
    onSettled: () => setActivePackage(null),
  });
  if (!ready) return <Loading />;
  return (
    <>
      {contextHolder}
      <div className={"flex flex-col items-center py-[30px] gap-[16px]"}>
        <img
          src={"/images/shop-header-background.png"}
          alt={"BG"}
          className={"w-full h-full max-w-[1078px] object-cover block"}
        />

        <PixelBorderBox
          color={"1D1B16"}
          className={
            "size-full max-w-[1078px] h-[600px] py-[19px] px-[23px] flex flex-row"
          }
        >
          <div
            className={`pr-[47px] mr-[48px] max-w-[265px] box-border w-full border-r border-[var(--color-border-subtle)] relative flex flex-col justify-between ${isFetching || isGamePassFetching ? "opacity-[0.3]" : ""}`}
          >
            {(isFetching || isGamePassFetching) && (
              <div
                className={
                  "absolute top-0 left-0 size-full flex justify-center items-center"
                }
              >
                <Spin />
              </div>
            )}
            {!authenticated ? (
              <SubLogin description={"Login to purchase"} />
            ) : (
              <>
                <div>
                  <div className={"flex flex-col gap-[16px] mb-[32px]"}>
                    <div
                      className={
                        "text-[var(--color-text-subtle)] text-[14px] leading-[18px]"
                      }
                    >
                      Current Perks
                    </div>
                    <RefreshButton
                      className={
                        "flex flex-row gap-[4px] items-center cursor-pointer text-[16px] text-[var(--color-text-brand)] leading-[20px]"
                      }
                      onClick={refetch}
                    >
                      <RetweetIcon /> Refresh
                    </RefreshButton>
                  </div>
                  <div className={"flex flex-col gap-[24px]"}>
                    <div className={"flex flex-col gap-[12px]"}>
                      <div
                        className={
                          "text-[var(--color-text-subtle)] text-[14px] leading-[18px]"
                        }
                      >
                        Current Energy
                      </div>
                      <div
                        className={
                          "flex flex-row items-center gap-[8px] text-[var(--color-text-subtle)] text-[20px] leading-[24px]"
                        }
                      >
                        <LightningIcon />
                        <div>
                          <span className={"text-[var(--color-text-normal)]"}>
                            {hasValue(data?.remainEnergy)
                              ? data.remainEnergy
                              : "--"}
                          </span>
                          /
                          {hasValue(data?.totalEnergy)
                            ? data.totalEnergy
                            : "--"}
                        </div>
                      </div>
                    </div>
                    <div className={"flex flex-col gap-[12px]"}>
                      <div
                        className={
                          "text-[var(--color-text-subtle)] text-[14px] leading-[18px] flex flex-row gap-[4px] items-center"
                        }
                      >
                        Total Token Bonus
                        <StyledPopover
                          content={
                            <div
                              className={
                                "text-[#f0e9cf7a] text-[10px] leading-[14px] px-[4px] my-[-2px] text-center"
                              }
                            >
                              Get{" "}
                              <span className={"text-[#F1C315]"}>
                                bonus MATTLE
                              </span>
                              <br />
                              on each purchase
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
                          "flex flex-row items-center gap-[8px] text-[var(--color-text-normal)] text-[20px] leading-[24px]"
                        }
                      >
                        <Token24Icon />
                        <div>
                          {hasValue(data?.totalTokenBonus)
                            ? data.totalTokenBonus
                            : 0}
                        </div>
                      </div>
                    </div>
                    <div className={"flex flex-col gap-[12px]"}>
                      <div
                        className={
                          "text-[var(--color-text-subtle)] text-[14px] leading-[18px] flex flex-row gap-[4px] items-center"
                        }
                      >
                        Total Expense
                      </div>
                      <div
                        className={
                          "flex flex-row items-center gap-[8px] text-[var(--color-text-normal)] text-[20px] leading-[24px]"
                        }
                      >
                        <SolTokenIcon
                          style={{ transform: "scale(0.75)" }}
                          className={"m-[-4px]"}
                        />
                        <div>
                          {hasValue(data?.totalSolSpent)
                            ? data.totalSolSpent
                            : "--"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={
                    "text-[var(--color-text-subtle)] text-[10px] leading-[14px]"
                  }
                >
                  All purchases are final and non-refundable
                  <br />
                  Energy can be used for all game features
                </div>
              </>
            )}
          </div>
          <div className={"flex-1 overflow-y-auto"}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {isGamePassPurchased !== true && (
                <div
                  className={
                    "flex flex-row gap-[8px] items-center text-[var(--color-text-normal)] text-[20px] leading-[24px] mb-[12px]"
                  }
                >
                  Game Pass{" "}
                  <StyledPopover
                    content={
                      <div
                        className={
                          "text-[#f0e9cf7a] text-[10px] leading-[14px] px-[4px] my-[-2px] text-center"
                        }
                      >
                        {"Get "}
                        <span className={"text-[#F1C315]"}>
                          25 energy daily
                        </span>
                        {" plus"}
                        <br />3 MATTLE bonus
                      </div>
                    }
                  >
                    <IconWrapper>
                      <DetailIcon />
                    </IconWrapper>
                  </StyledPopover>
                </div>
              )}
              <div
                className={
                  "flex flex-row gap-[8px] items-center text-[var(--color-text-normal)] text-[20px] leading-[24px] mb-[12px]"
                }
              >
                Energy Boost{" "}
                <StyledPopover
                  content={
                    <div
                      className={
                        "text-[#f0e9cf7a] text-[10px] leading-[14px] px-[4px] my-[-2px] text-center"
                      }
                    >
                      Get <span className={"text-[#F1C315]"}>extra energy</span>
                      <br />
                      to play more each day
                    </div>
                  }
                >
                  <IconWrapper>
                    <DetailIcon />
                  </IconWrapper>
                </StyledPopover>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {ENERGY_PACKAGES.map((pkg, index) =>
                isGamePassPurchased === true && index === 0 ? null : (
                  <PixelBox
                    key={index}
                    className={"flex flex-col items-center pt-[5px]"}
                  >
                    <img
                      src={ENERGY_URLS[index].image}
                      alt={"energy"}
                      className={`w-auto h-full max-h-[66px] object-cover block`}
                    />
                    <PixelTextBox
                      color={"f0e9cf1a"}
                      className={"mt-[12px] mb-[4px]"}
                    >
                      <div
                        className={
                          "my-[-6px] text-[var(--color-text-subtle)] text-[10px] leading-[14px]"
                        }
                      >
                        {index === 0
                          ? "Permanent"
                          : `Duration: ${pkg.expiredIn} Days`}
                      </div>
                    </PixelTextBox>
                    <PixelTextBox color={"f0e9cf1a"}>
                      <div
                        className={
                          "my-[-6px] text-[var(--color-text-subtle)] text-[10px] leading-[14px]"
                        }
                        style={
                          index === 0
                            ? { color: "var(--color-text-brand-contrast)" }
                            : {}
                        }
                      >
                        {index === 0
                          ? "Gain all feature access"
                          : `Bonus: ${pkg.bonusToken} $MATTLE`}
                      </div>
                    </PixelTextBox>
                    <PixelButton
                      className={`text-center ${buyMutation.isPending || !authenticated ? "cursor-not-allowed" : ""}`}
                      onClick={() => buyMutation.mutate(pkg)}
                      disabled={buyMutation.isPending || !authenticated}
                    >
                      {buyMutation.isPending &&
                      JSON.stringify(pkg) === activePackage ? (
                        <div className="size-[20px] mx-[7px] border-2 border-[#F0E9CF] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        `${pkg.amount.toLocaleString()} SOL`
                      )}
                    </PixelButton>
                  </PixelBox>
                ),
              )}
            </div>
            <div
              className={
                "flex flex-row gap-[8px] items-center text-[var(--color-text-normal)] text-[20px] leading-[24px] mb-[12px] mt-[32px]"
              }
            >
              Points Multiplier{" "}
              <StyledPopover
                content={
                  <div
                    className={
                      "text-[#f0e9cf7a] text-[10px] leading-[14px] px-[4px] my-[-2px] text-center"
                    }
                  >
                    <span className={"text-[#F1C315]"}>Multiply points</span>{" "}
                    earned
                    <br />
                    from each game session
                  </div>
                }
              >
                <IconWrapper>
                  <DetailIcon />
                </IconWrapper>
              </StyledPopover>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {MULTIPLY_PACKAGES.map((pkg, index) => (
                <PixelBox
                  key={index}
                  className={"flex flex-col items-center pt-[5px]"}
                >
                  <img
                    key={1}
                    src={POINT_URLS[index].image}
                    alt={"point_x2"}
                    className={"w-auto h-full max-h-[66px] object-cover block"}
                  />
                  <PixelTextBox
                    color={"f0e9cf1a"}
                    className={"mt-[12px] mb-[4px]"}
                  >
                    <div
                      className={
                        "my-[-6px] text-[var(--color-text-subtle)] text-[10px] leading-[14px]"
                      }
                    >
                      Duration: {pkg.expiredIn} Days
                    </div>
                  </PixelTextBox>
                  <PixelTextBox color={"f0e9cf1a"}>
                    <div
                      className={
                        "my-[-6px] text-[var(--color-text-subtle)] text-[10px] leading-[14px]"
                      }
                    >
                      Bonus: {pkg.bonusToken} $MATTLE
                    </div>
                  </PixelTextBox>
                  <PixelButton
                    className={`text-center ${buyMutation.isPending || !authenticated ? "cursor-not-allowed" : ""}`}
                    onClick={() => buyMutation.mutate(pkg)}
                    disabled={buyMutation.isPending || !authenticated}
                  >
                    {buyMutation.isPending &&
                    JSON.stringify(pkg) === activePackage ? (
                      <div className="size-[20px] mx-[7px] border-2 border-[#F0E9CF] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      `${pkg.amount.toLocaleString()} SOL`
                    )}
                  </PixelButton>
                </PixelBox>
              ))}
            </div>
          </div>
        </PixelBorderBox>
      </div>
    </>
  );
}

export function GoToShop({
  description,
  color = "F1C315",
  hoverColor = "F0D469",
}) {
  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <div
        className={
          "text-[#F0E9CF] text-[22px] leading-[26px] mt-[4px] mb-[24px] text-center"
        }
      >
        {description || "Claim your Game Pass"}
      </div>
      <Link href={"/shop"}>
        <PixelBorderBox
          color={color}
          hoverColor={hoverColor}
          as={"button"}
          className={"h-[40px]"}
        >
          <div className={"text-[#100D08E5] text-center my-[-6px] px-[7px]"}>
            Shop Now
          </div>
        </PixelBorderBox>
      </Link>
    </div>
  );
}
