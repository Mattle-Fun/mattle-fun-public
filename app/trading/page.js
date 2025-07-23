"use client";
import React, { useEffect, useState } from "react";
import WalletIcon from "@/app/assets/images/WalletIcon.svg";
import DownOutlinedIcon from "@/app/assets/images/DownOutlinedIcon.svg";
import SwapIcon from "@/app/assets/images/SwapIcon.svg";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import SelectTokenModal from "@/app/trading/SelectTokenModal";
import { notification } from "antd";
import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { VersionedTransaction } from "@solana/web3.js";
import { roundToDecimals } from "@/app/helpers";
import OrderDetails from "@/app/trading/OrderDetails";
import {
  fetchTokenInfo,
  useOnChainBalanceMap,
  useOrderResponse,
} from "@/app/trading/hooks";
import { TokenLogo48 } from "@/app/_components/TokenLogo";
import { useRouter, useSearchParams } from "next/navigation";
import { SOL, USDC } from "@/app/constants";
import styled from "styled-components";
import LoginButton from "@/app/_components/LoginButton";
import Tabs from "@/app/trading/Tabs";
import StatusIcon from "@/app/quest/StatusIcon";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/providers";

const TokenTypes = {
  input: "INPUT_TOKEN",
  output: "OUTPUT_TOKEN",
};

const StyledSwapIcon = styled(SwapIcon)`
  &:hover {
    path:first-child {
      fill: #4a463b;
    }
    path:last-child {
      fill: #f1c315;
      fill-opacity: 1;
    }
  }
`;

const StyledSelectButton = styled(PixelBorderBox)`
  &:hover {
    color: #f1c315;
    path:last-child {
      fill: #f1c315;
      fill-opacity: 1;
    }
  }
`;

export const StyledDetailIcon = styled.div`
  &:hover,
  &:focus,
  &:active {
    svg:last-child {
      path {
        fill: #f1c315;
        fill-opacity: 1;
      }
    }
  }
`;
const TradingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [api, contextHolder] = notification.useNotification();
  const { user, authenticated, ready } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);
  const { wallets } = useSolanaWallets();
  const [swapAmount, setSwapAmount] = useState("");
  const [inputToken, setInputToken] = useState();
  const [outputToken, setOutputToken] = useState();
  const [modalOpenType, setModalOpenType] = useState();
  const [orderResponse, iseOrderLoading] = useOrderResponse(
    user?.wallet?.address,
    inputToken?.swapAddress,
    outputToken?.swapAddress,
    inputToken?.decimals,
    swapAmount,
  );
  const desiredWallet = wallets?.find(
    (wallet) => user?.wallet?.address === wallet.address,
  );
  const swapDisabled = isLoading || iseOrderLoading || !desiredWallet;
  const [balanceMap] = useOnChainBalanceMap(user?.wallet?.address);
  const onSelectToken = (value) => {
    const params = new URLSearchParams(searchParams);
    if (modalOpenType === TokenTypes.input) {
      if (value.address === outputToken?.address && inputToken) {
        setOutputToken(inputToken);
        params.set("output", inputToken.address);
      }
      setInputToken(value);
      params.set("input", value.address);
    }
    if (modalOpenType === TokenTypes.output) {
      if (value.address === inputToken?.address && outputToken) {
        setInputToken(outputToken);
        params.set("input", outputToken.address);
      }
      setOutputToken(value);
      params.set("output", value.address);
    }
    setModalOpenType(undefined);
    if (swapAmount) setSwapAmount(roundToDecimals(+swapAmount, value.decimals));
    router.replace(`?${params.toString()}`);
  };
  const handleChange = (e) => {
    const input = e.target.value;

    const valid = new RegExp(
      `^(\\d+)?(\\.\\d{0,${inputToken?.decimals || 6}})?$`,
    ).test(input);

    if (valid || input === "") {
      setSwapAmount(input);
    }
  };

  const handleBlur = () => {
    if (
      swapAmount === "" ||
      isNaN(parseFloat(swapAmount)) ||
      parseFloat(swapAmount) === 0
    ) {
      setSwapAmount("");
    }
  };

  const swapMutation = useMutation({
    mutationFn: async (pkg) => {
      if (!orderResponse) return;
      setIsLoading(true);
      const transactionBase64 = orderResponse.transaction;
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(transactionBase64, "base64"),
      );
      const sign = await desiredWallet.signTransaction(transaction);
      if (sign) {
        const signedTransaction = Buffer.from(sign.serialize()).toString(
          "base64",
        );
        const executeResponse = await (
          await fetch("https://lite-api.jup.ag/ultra/v1/execute", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              signedTransaction: signedTransaction,
              requestId: orderResponse.requestId,
            }),
          })
        ).json();
        if (executeResponse.error) {
          throw new Error(executeResponse.error);
        }
        return executeResponse.signature;
      }
    },
    onSuccess: (signature) => {
      api.success({
        message: "Transaction confirmed",
        description: (
          <a href={`https://solscan.io/tx/${signature}`} target={"_blank"}>
            View Transaction
          </a>
        ),
        placement: "bottomRight",
      });
      setTimeout(
        () =>
          queryClient.invalidateQueries([
            "get-balance-tokens",
            user?.wallet?.address,
          ]),
        1000,
      );
    },
    onError: () => {
      api.error({
        message: "Transaction failed",
        description: <div>Please try again</div>,
        placement: "bottomRight",
      });
    },
    onSettled: () => setIsLoading(false),
  });

  useEffect(() => {
    const inputAddress = searchParams.get("input");
    const outputAddress = searchParams.get("output");
    const loadTokens = async () => {
      if (inputAddress) {
        const token = await fetchTokenInfo(inputAddress);
        if (token) {
          setInputToken(token);
        }
      } else setInputToken(USDC);

      if (outputAddress) {
        const token = await fetchTokenInfo(outputAddress);
        if (token) {
          setOutputToken(token);
        }
      } else setOutputToken(SOL);
    };
    setIsLoading(true);
    loadTokens().finally(() => setIsLoading(false));
  }, [searchParams]);
  return (
    <div className={"size-full"}>
      {contextHolder}
      <div
        className={"flex flex-col items-center"}
        style={{
          background: `linear-gradient(rgba(16, 13, 8, 0.75) 0%, rgba(16, 13, 8, 0) 15%, rgba(16, 13, 8, 0) 85%, rgba(16, 13, 8, 0.75) 100%), linear-gradient(90deg, rgba(16, 13, 8, 0.75) 0%, rgba(16, 13, 8, 0) 5%, rgba(16, 13, 8, 0) 95%, rgba(16, 13, 8, 0.75) 100%), linear-gradient(232deg, rgb(64 51 0 / 40%) -24.75%, rgba(16, 13, 8, 0) 73.72%), linear-gradient(130deg, rgb(64 51 0 / 25%) -18.9%, rgba(16, 13, 8, 0) 74.83%), radial-gradient(66% 200% at 43.27% -98.03%, rgb(235 215 185 / 20%) 7.8%, rgba(16, 13, 8, 0) 100%)`,
        }}
      >
        <div
          className={
            "py-[40px] flex flex-row justify-between gap-[24px] max-w-[900px] w-full px-[10px]"
          }
        >
          <div>
            <div
              className={
                "relative text-[#F0E9CF] font-[400] text-[40px] leading-[44px] w-[200px]"
              }
            >
              Trade <br />
              and{" "}
              <span className={"text-[var(--color-text-brand)]"}>Boost</span>
              <div
                className={
                  "absolute bottom-[32px] right-[52px] bg-[url('/images/main-character-white.png')] bg-cover bg-center h-[29px] w-[24px]"
                }
              />
            </div>
            <div
              className={
                "flex flex-row gap-[8px] text-[#F0E9CF7A] text-[14px] leading-[18px] my-[12px]"
              }
            >
              <div className={"min-w-[16px]"}>
                <StatusIcon color={"#f0e9cf7a"} />
              </div>
              Listed tokens boost specific traits via PnL
            </div>
            <div
              className={
                "flex flex-row gap-[8px] text-[#F0E9CF7A] text-[14px] leading-[18px] mt-[12px]"
              }
            >
              <div className={"min-w-[16px]"}>
                <StatusIcon color={"#f0e9cf7a"} />
              </div>
              Unlisted token PnL combines to boost Armor
            </div>
          </div>
          <div>
            <div className={"flex justify-center"}>
              <div className={"max-w-[441px] box-border w-full flex flex-col"}>
                <PixelBorderBox
                  color={"F0E9CF1A"}
                  className={
                    "pl-[7px] py-[0px] pr-[1px] flex font-[400] text-[14px] leading-[18px] flex-col mt-[4px] mb-[2px]"
                  }
                >
                  <div className={"flex flex-row items-center justify-between"}>
                    <input
                      className={
                        "border-none bg-transparent outline-none shadow-none text-[#F0E9CF] placeholder-[#F0E9CF3D] font-[400] text-[24px] leading-[28px] tracking-[0.96px] min-w-[100px]"
                      }
                      value={swapAmount}
                      style={{ background: "none" }}
                      pattern="[0-9]*"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={"0.00"}
                      disabled={!ready || !authenticated}
                    />
                    <StyledSelectButton
                      color={"3B382F"}
                      hoverColor={"4A463B"}
                      className={
                        "flex flex-row items-center h-[48px] min-w-[142px] box-border cursor-pointer text-[#F0E9CF]"
                      }
                      onClick={() => setModalOpenType(TokenTypes.input)}
                    >
                      {inputToken && (
                        <>
                          <div className={"ml-[-15px] mr-[8px] min-w-[40px]"}>
                            <TokenLogo48
                              imageHref={inputToken.icon}
                              idSuffix={inputToken.address}
                            />
                          </div>
                          <div className={"truncate"}>{inputToken.symbol}</div>
                        </>
                      )}
                      <DownOutlinedIcon className={"ml-auto"} />
                    </StyledSelectButton>
                  </div>
                  <>
                    <div
                      className={
                        "flex flex-row items-center mt-[6px] mb-[12px] gap-[8px] text-[#F0E9CF7A] focus:text-[#F0E9CF] placeholder-[#F0E9CF3D] font-[400] text-[16px] leading-[20px] tracking-[0.64px]"
                      }
                    >
                      <WalletIcon />
                      <div>
                        {`${balanceMap.get(inputToken?.address) > 0 ? balanceMap.get(inputToken?.address) : "--"}`}{" "}
                        {inputToken?.symbol}
                      </div>
                    </div>
                    <div
                      className={
                        "flex flex-row items-center text-[#F0E9CF3D] gap-[12px] font-[400] text-[14px] leading-[18px] mb-[7px]"
                      }
                    >
                      <div
                        className={
                          balanceMap.get(inputToken?.address) > 0
                            ? "cursor-pointer hover:text-[#F0E9CF]"
                            : "cursor-not-allowed"
                        }
                        onClick={() =>
                          balanceMap.get(inputToken?.address) > 0 &&
                          setSwapAmount(
                            roundToDecimals(
                              +balanceMap.get(inputToken?.address) / 2,
                              inputToken?.decimals,
                            ),
                          )
                        }
                      >
                        50%
                      </div>
                      <div
                        className={
                          balanceMap.get(inputToken?.address) > 0
                            ? "cursor-pointer hover:text-[#F0E9CF]"
                            : "cursor-not-allowed"
                        }
                        onClick={() =>
                          balanceMap.get(inputToken?.address) > 0 &&
                          setSwapAmount(
                            roundToDecimals(
                              +balanceMap.get(inputToken?.address),
                              inputToken?.decimals,
                            ),
                          )
                        }
                      >
                        100%
                      </div>
                    </div>
                  </>
                </PixelBorderBox>
                <div className={"relative"}>
                  <StyledSwapIcon
                    className={
                      "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer flex z-[2]"
                    }
                    onClick={() => {
                      const inputT = outputToken
                        ? { ...outputToken }
                        : outputToken;
                      const outputT = inputToken
                        ? { ...inputToken }
                        : inputToken;
                      setInputToken(inputT);
                      setOutputToken(outputT);
                      if (orderResponse && outputToken)
                        setSwapAmount(
                          orderResponse.outAmount / 10 ** outputToken.decimals,
                        );
                    }}
                  />
                </div>
                <PixelBorderBox
                  color={"F0E9CF1A"}
                  className={
                    "pl-[7px] py-[0px] pr-[1px] flex font-[400] text-[14px] leading-[18px] flex-col mt-[2px] mb-[4px]"
                  }
                >
                  <div className={"flex flex-row items-center justify-between"}>
                    <input
                      className={
                        "border-none bg-transparent outline-none shadow-none text-[#f0e9cf7a] placeholder-[#F0E9CF3D] font-[400] text-[24px] leading-[28px] tracking-[0.96px] min-w-[100px]"
                      }
                      disabled
                      value={
                        orderResponse
                          ? roundToDecimals(
                              orderResponse.outAmount /
                                10 ** outputToken.decimals,
                              outputToken.decimals,
                            )
                          : undefined
                      }
                      placeholder={"0.00"}
                      style={{ background: "none" }}
                    />
                    <StyledSelectButton
                      color={"3B382F"}
                      hoverColor={"4A463B"}
                      className={
                        "flex flex-row items-center h-[48px] min-w-[142px] box-border cursor-pointer text-[#F0E9CF]"
                      }
                      onClick={() => setModalOpenType(TokenTypes.output)}
                    >
                      {outputToken && (
                        <>
                          <div className={"ml-[-15px] mr-[8px] min-w-[40px]"}>
                            <TokenLogo48
                              imageHref={outputToken.icon}
                              idSuffix={outputToken.address}
                            />
                          </div>
                          <div className={"truncate"}>{outputToken.symbol}</div>
                        </>
                      )}
                      <DownOutlinedIcon className={"ml-auto"} />
                    </StyledSelectButton>
                  </div>

                  <div
                    className={
                      "flex flex-row items-center my-[6px] gap-[8px] text-[#F0E9CF7A] font-[400] text-[16px] leading-[20px] tracking-[0.64px]"
                    }
                  >
                    <WalletIcon />
                    <div>
                      {`${
                        balanceMap.get(outputToken?.address) > 0
                          ? roundToDecimals(
                              balanceMap.get(outputToken?.address),
                              outputToken?.decimals,
                            )
                          : "--"
                      }`}{" "}
                      {outputToken?.symbol}
                    </div>
                  </div>
                </PixelBorderBox>
                {orderResponse && (
                  <OrderDetails
                    orderResponse={orderResponse}
                    inputToken={inputToken}
                    outputToken={outputToken}
                  />
                )}
                {ready && !authenticated ? (
                  <LoginButton />
                ) : (
                  <PixelBorderBox
                    as={"button"}
                    hoverColor={swapDisabled || !orderResponse ? "" : "F0D469"}
                    color={
                      swapDisabled || !orderResponse ? "F0E9CF0A" : "F1C315"
                    }
                    className={`${swapDisabled || !orderResponse ? "text-[#F0E9CF3D]" : "text-[#100D08E5]"} py-[3px] px-[7px] relative h-[48px] box-border font-[400] text-[20px] leading-[24px] mt-[4px]`}
                    onClick={swapMutation.mutate}
                    disabled={swapDisabled || !orderResponse}
                  >
                    <div
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      {swapDisabled ? "Loading" : "Swap"}
                    </div>
                  </PixelBorderBox>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SelectTokenModal
        isOpen={Boolean(modalOpenType)}
        setIsOpen={setModalOpenType}
        onSelect={onSelectToken}
        balanceMap={balanceMap}
      />
      <Tabs />
    </div>
  );
};

export default TradingPage;
