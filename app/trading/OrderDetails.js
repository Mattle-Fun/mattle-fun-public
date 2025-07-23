"use client";
import { roundToDecimals } from "@/app/helpers";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import React, { useState } from "react";
import ToggleIcon from "@/app/assets/images/ToggleIcon.svg";

const OrderDetails = ({ inputToken, outputToken, orderResponse }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <PixelBorderBox
      color={"F0E9CF1A"}
      className={
        "flex flex-col gap-[4px] px-[7px] font-[400] text-[14px] leading-[18px] mb-[4px]"
      }
    >
      <div
        className={
          "flex items-center justify-between text-[#F0E9CF] font-[400] text-[14px] leading-[18px] my-[4px] gap-[10px]"
        }
      >
        <div className={"text-[#F0E9CF7A]"}>Rate</div>
        <div className={"flex items-center gap-[8px]"}>
          <div>
            {!toggle
              ? `1 ${inputToken?.symbol} ≈ ${roundToDecimals((orderResponse.outAmount / orderResponse.inAmount) * 10 ** (inputToken.decimals - outputToken.decimals), parseInt(outputToken.decimals))} ${outputToken?.symbol}`
              : `1 ${outputToken?.symbol} ≈ ${roundToDecimals((orderResponse.inAmount / orderResponse.outAmount) * 10 ** (outputToken.decimals - inputToken.decimals), parseInt(inputToken.decimals))} ${inputToken?.symbol}`}
          </div>
          <ToggleIcon
            className={"cursor-pointer"}
            onClick={() => setToggle(!toggle)}
          />
        </div>
      </div>
      <div
        className={
          "flex items-center justify-between text-[#F0E9CF] font-[400] text-[14px] leading-[18px] my-[4px] gap-[10px]"
        }
      >
        <div className={"text-[#F0E9CF7A]"}>Route</div>
        <div className={"truncate"}>
          {orderResponse.routePlan?.map((i) => i.swapInfo.label)?.join(", ")}
        </div>
      </div>
      <div
        className={
          "flex items-center justify-between text-[#F0E9CF] font-[400] text-[14px] leading-[18px] my-[4px] gap-[10px]"
        }
      >
        <div className={"text-[#F0E9CF7A]"}>Price impact</div>
        <div>{roundToDecimals(orderResponse.priceImpactPct * 100, 2)}%</div>
      </div>
      <div
        className={
          "flex items-center justify-between text-[#F0E9CF] font-[400] text-[14px] leading-[18px] my-[4px] gap-[10px]"
        }
      >
        <div className={"text-[#F0E9CF7A]"}>Slippage</div>
        <div>{roundToDecimals(orderResponse.slippageBps / 100, 2)}%</div>
      </div>
    </PixelBorderBox>
  );
};

export default OrderDetails;
