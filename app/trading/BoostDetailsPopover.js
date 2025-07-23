import StyledPopover from "@/app/_components/StyledPopover";
import { boostTable, LEVEL_COLORS } from "@/app/constants";
import DetailIcon from "@/app/assets/images/DetailIcon.svg";
import React from "react";
import { StyledDetailIcon } from "@/app/trading/page";

const BoostDetailsPopover = ({ label, color, fieldName }) => (
  <StyledPopover
    placement="right"
    content={
      <div className={"px-[4px]"}>
        <div className={"w-[152px]"}>
          <div
            className={
              "text-[#F0E9CF3D] text-[12px] leading-[16px] pt-[4px] px-[8px] pb-[8px] flex flex-row items-center justify-between"
            }
          >
            <div>Level</div>
            <div>Perks</div>
          </div>
          <div className={"flex flex-col text-[14px] leading-[18px]"}>
            {LEVEL_COLORS.map((x, i) => (
              <div
                key={i}
                className={
                  "flex flex-row items-center justify-between py-[4px] px-[8px]"
                }
              >
                <div className={"text-[#F0E9CF7A]"}>{i}</div>
                <div
                  style={{
                    color: LEVEL_COLORS[i],
                  }}
                >{`+${boostTable[i]?.[fieldName]}% ${label}`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }
  >
    <StyledDetailIcon className={"flex flex-row items-center gap-[4px]"}>
      <div
        style={{
          color,
        }}
      >
        {label}
      </div>
      <DetailIcon />
    </StyledDetailIcon>
  </StyledPopover>
);

export default BoostDetailsPopover;
