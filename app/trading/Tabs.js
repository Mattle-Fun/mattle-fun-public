"use client";
import React, { Fragment, useMemo } from "react";
import ArrowRightIcon from "@/app/assets/images/ArrowRightIcon.svg";
import BoostDetailsPopover from "@/app/trading/BoostDetailsPopover";
import { TokenLogo32 } from "@/app/_components/TokenLogo";
import RightOutlinedIcon from "@/app/assets/images/RightOutlinedIcon.svg";
import StyledPopover from "@/app/_components/StyledPopover";
import {
  boostTable,
  LEVEL_COLORS,
  PerkColor,
  PerkLabel,
} from "@/app/constants";
import OtherTokenIcon from "@/app/assets/images/OtherTokenIcon.svg";
import DetailIcon from "@/app/assets/images/DetailIcon.svg";
import { StyledDetailIcon } from "@/app/trading/page";
import { useRouter, useSearchParams } from "next/navigation";
import { TablePixelBorderBox } from "@/app/_components/PixelBorderBox";
import { useQuery } from "@tanstack/react-query";
import { getPartnerTokens } from "@/app/trading/server";
import LoadingTable from "@/app/_components/LoadingTable";

const TAB_KEYS = ["Featured", "HP", "Armor", "Speed", "Luck", "All"];
const Tabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = React.useState(TAB_KEYS[0]);
  const { data, isFetching } = useQuery({
    queryKey: ["partner-tokens"],
    queryFn: () => getPartnerTokens(),
  });
  const onTokenClick = (address) => {
    const params = new URLSearchParams(searchParams);
    params.set("output", address);
    router.replace(`?${params.toString()}`);
  };
  const tokens = useMemo(() => {
    if (data && data.length > 0) {
      switch (tab) {
        case "Featured":
          return data.slice(0, 5);
        case "All":
          return data;
        default:
          return data.filter((token) => getPerkKey(token.boostStatus) === tab);
      }
    }
    return [];
  }, [data, tab]);
  return (
    <div>
      <div
        className={
          "flex flex-col items-center border-t border-b border-[#493B0C]"
        }
      >
        <div className="max-w-[912px] w-full flex items-center justify-between flex-row text-[#F0E9CF7A] font-[400] text-[16px] leading-[20px] ">
          <div className="flex items-center flex-row">
            {TAB_KEYS.map((type, index) => (
              <div
                key={index}
                className={`py-[12px] px-[16px] cursor-pointer ${type === tab && "text-[#F1C315]"}`}
                onClick={() => setTab(type)}
              >
                {PerkLabel[type] || type}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={"flex flex-col items-center"}>
        <div className={"max-w-[900px] w-full px-[10px] py-[24px]"}>
          {isFetching ? (
            <LoadingTable />
          ) : ["Featured", "All"].includes(tab) ? (
            <div
              className={
                "flex justify-between gap-y-[16px] flex-wrap text-[var(--color-text-gentle)] text-[14px] leading-[18px]"
              }
            >
              <div className={"w-1/3 flex flex-col max-w-[248px] gap-[16px]"}>
                {tokens
                  .filter((_, index) => index % 3 === 0)
                  .map((token, index) => (
                    <TokenInfo
                      key={index}
                      token={token}
                      onTokenClick={onTokenClick}
                    />
                  ))}
                {tokens.length % 3 === 0 && <OtherTokenInfo />}
              </div>
              <div className={"w-1/3 flex flex-col max-w-[248px] gap-[16px]"}>
                {tokens
                  .filter((_, index) => index % 3 === 1)
                  .map((token, index) => (
                    <TokenInfo
                      key={index}
                      token={token}
                      onTokenClick={onTokenClick}
                    />
                  ))}
                {tokens.length % 3 === 1 && <OtherTokenInfo />}
              </div>
              <div className={"w-1/3 flex flex-col max-w-[248px] gap-[16px]"}>
                {tokens
                  .filter((_, index) => index % 3 === 2)
                  .map((token, index) => (
                    <TokenInfo
                      key={index}
                      token={token}
                      onTokenClick={onTokenClick}
                    />
                  ))}
                {tokens.length % 3 === 2 && <OtherTokenInfo />}
              </div>
            </div>
          ) : (
            <div className={"flex flex-col gap-[16px]"}>
              <TablePixelBorderBox
                color={"1D1B16"}
                className={
                  "px-[11px] py-[3px] flex flex-row items-center gap-[24px]"
                }
              >
                {LEVEL_COLORS.map((x, i) => (
                  <Fragment key={i}>
                    <div
                      className={
                        "flex flex-col gap-[8px] text-[14px] leading-[18px]"
                      }
                    >
                      <div className={"text-[var(--color-text-subtle)]"}>
                        Lv.{i}
                      </div>
                      <div
                        style={{
                          color: LEVEL_COLORS[i],
                        }}
                      >{`+${boostTable[i]?.[tab]}% ${PerkLabel[tab]}`}</div>
                    </div>
                    {i !== LEVEL_COLORS.length - 1 && <RightOutlinedIcon />}
                  </Fragment>
                ))}
              </TablePixelBorderBox>
              <div
                className={
                  "flex flex-row flex-wrap gap-[16px] py-[8px] px-[20px]"
                }
              >
                {tokens.map((token, index) => (
                  <div
                    key={index}
                    className={
                      "flex-[142px] flex flex-row gap-[12px] max-w-[142px] items-center cursor-pointer text-[var(--color-text-gentle)] hover:text-[var(--color-text-hover)]"
                    }
                    onClick={() => onTokenClick(token.address)}
                  >
                    <TokenLogo32 imageHref={token.logoURI} />
                    <div className={"uppercase"}>{token.symbol}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getPerkKey = (boostStatus) => {
  if (boostStatus && typeof boostStatus === "object") {
    return Object.keys(boostStatus).find((key) => boostStatus[key] === true);
  }
  return "";
};

const OtherTokenInfo = () => (
  <div className={"flex flex-row w-full py-[4px] gap-[8px]"}>
    <StyledPopover
      placement="right"
      content={
        <div className={"px-[4px] my-[-2px]"}>
          <div
            className={`text-[10px] leading-[14px]`}
            style={{
              color: LEVEL_COLORS[0],
            }}
          >
            <div className={`mb-[2px]`}>Unlisted token PnL</div>
            <div>combined to boost Armor</div>
          </div>
        </div>
      }
    >
      <StyledDetailIcon className={"flex flex-row items-center flex-1 "}>
        <OtherTokenIcon />
        <div className={"ml-[12px] mr-[4px]"}>Unlisted</div>

        <div className={"flex flex-row items-center gap-[4px] cursor-pointer"}>
          <DetailIcon />
        </div>
      </StyledDetailIcon>
    </StyledPopover>
    <div className={"flex flex-row items-center flex-1 justify-between"}>
      <ArrowRightIcon className="ml-[8px]" />
      <BoostDetailsPopover
        label={"Armor"}
        fieldName={"Armor"}
        color={"#F1C315"}
      />
    </div>
  </div>
);
const TokenInfo = ({ token, onTokenClick }) => (
  <div className={"flex flex-row w-full py-[4px] gap-[8px]"}>
    <div
      className={
        "flex flex-row items-center flex-1 cursor-pointer hover:text-[var(--color-text-hover)]"
      }
      onClick={() => onTokenClick(token.address)}
    >
      <TokenLogo32 imageHref={token.logoURI} />
      <div className={"ml-[12px] uppercase"}>{token.symbol}</div>
    </div>
    <div className={"flex flex-row items-center flex-1 justify-between"}>
      <ArrowRightIcon className="ml-[8px]" />
      <BoostDetailsPopover
        label={PerkLabel[getPerkKey(token.boostStatus)]}
        fieldName={getPerkKey(token.boostStatus)}
        color={PerkColor[getPerkKey(token.boostStatus)]}
      />
    </div>
  </div>
);
export default React.memo(Tabs);
