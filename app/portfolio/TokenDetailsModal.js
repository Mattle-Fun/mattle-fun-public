import StyledModal from "@/app/_components/StyledModal";
import { Tooltip } from "antd";
import {
  ceilToDecimals,
  roundToDecimals,
  shortAddress,
  sround,
} from "@/app/helpers";
import CopyIcon from "@/app/assets/images/CopyIcon.svg";
import WebsiteIcon from "@/app/assets/images/WebsiteIcon.svg";
import XIcon from "@/app/assets/images/XIcon.svg";
import TelegramIcon from "@/app/assets/images/TelegramIcon.svg";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import { useRouter } from "next/navigation";
import { TokenLogo20 } from "@/app/_components/TokenLogo";
import React from "react";
import styled from "styled-components";
import Link from "next/link";
import {
  boostTable,
  LEVEL_COLORS,
  PerkLabel,
  TokenGroups,
} from "@/app/constants";
import StyledPopover from "@/app/_components/StyledPopover";
import { Tag } from "@/app/portfolio/Row";

const Icon = styled.div`
  border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cpath d='M7 2V0H21V2L24 2V4H26V7H28V21H26V24H24V26H21V28H7V26H4V24H2V21H0V7H2V4H4V2L7 2Z' fill='%233B382F'/%3E%3C/svg%3E");
  border-style: solid;
  border-width: 9px;
  border-image-slice: 9 fill;
  border-image-repeat: stretch;
  width: 28px;
  height: 28px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cpath d='M7 2V0H21V2L24 2V4H26V7H28V21H26V24H24V26H21V28H7V26H4V24H2V21H0V7H2V4H4V2L7 2Z' fill='%234A463B'/%3E%3C/svg%3E");
    path {
      fill: #f1c315;
      fill-opacity: 1;
    }
  }
`;

const TokenDetailsModal = ({ open, setOpen, asset }) => {
  const router = useRouter();
  if (!asset) return null;
  return (
    <StyledModal
      open={open}
      onCancel={() => setOpen(false)}
      title={null}
      footer={null}
      closable={false}
      width={451}
    >
      <div className={"flex flex-col"}>
        <div className={"flex justify-between pl-[8px] pb-[8px]"}>
          <div className={"flex flex-col gap-[8px]"}>
            <div className={"flex flex-row items-center py-[4px]"}>
              <TokenLogo20 imageHref={asset.logoURI} />
              <div
                className={
                  "text-[#F0E9CF] font-[400] text-[16px] leading-[20px] ml-[10px] mr-[4px]"
                }
              >
                {asset.name}
              </div>
            </div>
            <div className={"flex flex-row items-end gap-[8px]"}>
              <div
                className={
                  "text-[#F0E9CF] font-[400] text-[32px] leading-[36px]"
                }
              >
                ${roundToDecimals(asset.balance * asset.currentPrice, 2)}
              </div>
              <div
                className={
                  "text-[#F0E9CF7A] font-[400] text-[16px] leading-[20px] pb-[2px]"
                }
              >{`${roundToDecimals(asset.balance, 2)} ${asset.symbol}`}</div>
            </div>
            {asset.type !== TokenGroups.stable && (
              <div className={"flex flex-row items-center gap-[8px]"}>
                <div
                  className={`font-[400] text-[16px] leading-[20px] ${asset.pnl < 0 ? "text-[#FF6200]" : asset.pnl === 0 ? "text-[#F1C315]" : "text-[#00FF97]"}`}
                >
                  {asset.pnlString}
                </div>
                <StyledPopover
                  placement="top"
                  content={
                    <div className={"px-[4px] my-[-2px]"}>
                      <div className={`text-[10px] leading-[14px]`}>
                        <div
                          className={`text-center mb-[2px]`}
                          style={{
                            color: LEVEL_COLORS[asset.currentLevel],
                          }}
                        >
                          {`${asset.type === TokenGroups.normal ? "Group " : ""}Boost Lv.${asset.currentLevel}`}
                        </div>
                        <div className={`text-[#F0E9CF7A] text-center`}>
                          {asset.currentLevel === 4
                            ? "Max reached"
                            : `+$${ceilToDecimals(asset.pnlToNextLevel, 0)} PnL${asset.type === TokenGroups.normal ? " on Unlisted tokens" : ""} to reach Lv.${asset.currentLevel + 1} (+${boostTable[asset.currentLevel + 1][asset.perk]}% ${PerkLabel[asset.perk]})`}
                        </div>
                      </div>
                    </div>
                  }
                >
                  <Tag>
                    <div
                      style={{
                        color: LEVEL_COLORS[asset.currentLevel],
                      }}
                    >{`+${asset.boostStats[asset.perk]}% ${PerkLabel[asset.perk]}`}</div>
                  </Tag>
                </StyledPopover>
              </div>
            )}
          </div>
          <div className={"flex flex-col gap-[8px]"}>
            {asset?.links?.homepage && (
              <Link href={asset.links.homepage} target={"_blank"}>
                <Icon>
                  <WebsiteIcon className="m-[-3px]" />
                </Icon>
              </Link>
            )}
            {asset?.links?.twitter && (
              <Link href={asset.links.twitter} target={"_blank"}>
                <Icon>
                  <XIcon className="m-[-3px]" />
                </Icon>
              </Link>
            )}
            {asset?.links?.telegram && (
              <Link href={asset.links.telegram} target={"_blank"}>
                <Icon>
                  <TelegramIcon className="m-[-3px]" />
                </Icon>
              </Link>
            )}
          </div>
        </div>
        <div
          className={
            "flex flex-col gap-[4px] my-[16px] py-[16px] px-[8px] border border-y-[2px] border-x-0 border-[#F0E9CF14]"
          }
        >
          <div
            className={
              "flex flex-row justify-between py-[4px] text-[#F0E9CF7A] font-[400] text-[14px] leading-[18px]"
            }
          >
            <div>Contract</div>
            <div className={"flex flex-row gap-[8px] text-[#F0E9CF]"}>
              <div>{shortAddress(asset.address)}</div>
              <Tooltip title={"Copied!"} trigger={"click"}>
                <CopyIcon
                  className={"cursor-pointer"}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(asset.address)
                      .then(() => {
                        console.log("Copied to clipboard!");
                      })
                      .catch((err) => {
                        console.error("Failed to copy: ", err);
                      })
                  }
                />
              </Tooltip>
            </div>
          </div>
          {asset.type !== TokenGroups.stable && (
            <>
              <div
                className={
                  "flex flex-row justify-between py-[4px] text-[#F0E9CF7A] font-[400] text-[14px] leading-[18px]"
                }
              >
                <div>Average Price</div>
                <div className={"text-[#F0E9CF]"}>
                  ${sround(asset.avgBuy, 4)}
                </div>
              </div>
              <div
                className={
                  "flex flex-row justify-between py-[4px] text-[#F0E9CF7A] font-[400] text-[14px] leading-[18px]"
                }
              >
                <div>Current Price</div>
                <div className={"text-[#F0E9CF]"}>
                  ${sround(asset.currentPrice, 4)}
                </div>
              </div>
            </>
          )}
        </div>
        <PixelBorderBox
          color={"F0E9CF1A"}
          className={
            "text-center text-[#F0E9CF] font-[400] text-[20px] leading-[24px] cursor-pointer"
          }
          onClick={() =>
            router.push(`/trading?input=SOL&output=${asset.address}`, {
              scroll: false,
            })
          }
        >
          Swap
        </PixelBorderBox>
      </div>
    </StyledModal>
  );
};

export default TokenDetailsModal;
