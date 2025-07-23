"use client";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import SearchIcon from "@/app/assets/images/SearchIcon.svg";
import React, { useEffect, useState } from "react";
import { useTokenMap } from "@/app/trading/hooks";
import { roundToDecimals, shortAddress } from "@/app/helpers";
import { TokenLogo32 } from "@/app/_components/TokenLogo";
import StyledModal from "@/app/_components/StyledModal";
import CloseIcon from "@/app/assets/images/CloseIcon.svg";

const SelectTokenModal = ({ isOpen, setIsOpen, onSelect, balanceMap }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenMap, isTokenLoading] = useTokenMap(searchQuery);
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);
  return (
    <StyledModal
      title="Choose token"
      open={isOpen}
      width={320}
      onCancel={() => setIsOpen(false)}
      footer={null}
      closeIcon={<CloseIcon />}
    >
      <PixelBorderBox
        color={"F0E9CF1A"}
        className={
          "flex flex-row items-center text-[#FAFAFA] font-[400] text-[14px] leading-[18px] gap-[6px] my-[16px]"
        }
      >
        <SearchIcon />
        <input
          className={
            "border-none bg-transparent outline-none shadow-none w-full"
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </PixelBorderBox>
      <div className={"min-h-[344px] max-h-[344px] overflow-auto"}>
        <div className={"flex flex-col gap-[4px]"}>
          {tokenMap.size > 0 ? (
            [...tokenMap].map(([key, value]) => {
              return (
                <PixelBorderBox
                  key={key}
                  color={"F0E9CF1A"}
                  hoverColor={"F0E9CF3D"}
                  className={"box-border h-[52px] cursor-pointer"}
                  onClick={() => onSelect(value)}
                >
                  <div className={"relative w-full h-full"}>
                    <div
                      className={
                        "absolute top-1/2 transform -translate-y-1/2 w-full flex flex-row items-center justify-between"
                      }
                    >
                      <div
                        className={
                          "flex flex-row items-center gap-[12px] text-[#F0E9CF] text-left font-[400] text-[12px] leading-[16px]"
                        }
                      >
                        <TokenLogo32
                          imageHref={value.icon}
                          idSuffix={value.address}
                        />
                        <div>
                          <div className={"truncate"}>{value.name}</div>
                          <div
                            className={
                              "mt-[2px] text-[#F0E9CF7A] text-[10px] leading-[14px]"
                            }
                          >
                            {shortAddress(value.swapAddress)}
                          </div>
                        </div>
                      </div>
                      {balanceMap.get(value.address) > 0 && (
                        <div
                          className={
                            "text-[#F0E9CF] text-right font-[400] text-[12px] leading-[16px]"
                          }
                        >
                          {roundToDecimals(balanceMap.get(value.address), 2)}{" "}
                          {value.symbol}
                        </div>
                      )}
                    </div>
                  </div>
                </PixelBorderBox>
              );
            })
          ) : (
            <div
              className={
                "text-[#F0E9CF7A] text-center font-[400] text-[14px] leading-[18px]"
              }
            >
              No result
            </div>
          )}
        </div>
      </div>
    </StyledModal>
  );
};

export default SelectTokenModal;
