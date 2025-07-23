import { roundToDecimals } from "@/app/helpers";
import React from "react";
import styled from "styled-components";
import TokenDetailsModal from "@/app/portfolio/TokenDetailsModal";
import { TokenLogo20 } from "@/app/_components/TokenLogo";
import StyledPopover from "@/app/_components/StyledPopover";
import { LEVEL_COLORS, PerkLabel, TokenGroups } from "@/app/constants";

export const Tag = styled.div`
  border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='18' viewBox='0 0 19 18' fill='none'%3E%3Cpath d='M5 0V2H2V4H0V14H2V16H5V18H14V16H17V14H19V4H17V2H14V0H5Z' fill='%23F0E9CF' fill-opacity='0.1'/%3E%3C/svg%3E");
  border-style: solid;
  border-width: 8px;
  border-image-slice: 8 fill;
  border-image-repeat: stretch;
  height: 18px;
  box-sizing: border-box;
  position: relative;
  color: rgba(240, 233, 207, 0.48);
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px; /* 140% */
  div {
    margin: -5px 0 -6px 0;
  }
`;

const Row = ({ asset }) => {
  const [open, setOpen] = React.useState(false);
  if (!asset) return null;
  return (
    <>
      <tr
        key={asset.address}
        onClick={() => asset.type !== TokenGroups.stable && setOpen(true)}
        className={asset.type !== TokenGroups.stable ? "cursor-pointer" : ""}
      >
        <td className="text-[#F0E9CF]">
          <div className="flex items-center gap-2">
            <TokenLogo20 imageHref={asset.logoURI} />
            <p>{asset.name}</p>
          </div>
        </td>
        <td className="text-right text-[#F0E9CF7A]">
          <div className={"flex items-center justify-center"}>
            {asset.type !== TokenGroups.stable && (
              <StyledPopover
                placement="top"
                content={
                  <div className={"px-[4px] my-[-2px]"}>
                    <div
                      className={`text-[10px] leading-[14px]`}
                      style={{
                        color: LEVEL_COLORS[asset.currentLevel],
                      }}
                    >
                      {`${asset.type === TokenGroups.partner ? "" : "Group "}Boost Lv.${asset.currentLevel}`}
                    </div>
                  </div>
                }
              >
                <Tag>
                  <div
                    style={{
                      color: LEVEL_COLORS[asset.currentLevel],
                    }}
                  >{`+${asset.type === TokenGroups.partner ? `${asset.boostStats[asset.perk]}%` : ""} ${PerkLabel[asset.perk]}`}</div>
                </Tag>
              </StyledPopover>
            )}
          </div>
        </td>
        <td className="text-right text-[#F0E9CF7A]">
          {roundToDecimals(asset.balance, 2)} {asset.symbol}
        </td>
        <td className="text-right text-[#F0E9CF]">
          ${roundToDecimals(asset.balance * asset.currentPrice, 2)}
        </td>
        <td
          className={`text-right ${asset.pnl < 0 ? "text-[#FF6200]" : asset.pnl === 0 ? "text-[#F1C315]" : "text-[#00FF97]"}`}
        >
          <div className={"flex items-center justify-end"}>
            {asset.type !== TokenGroups.stable && asset.pnlString}
          </div>
        </td>
      </tr>
      <TokenDetailsModal open={open} setOpen={setOpen} asset={asset} />
    </>
  );
};

export default Row;
