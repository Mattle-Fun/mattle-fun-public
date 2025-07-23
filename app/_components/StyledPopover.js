import { Popover } from "antd";
import styled from "styled-components";
import { IconWrapper } from "@/app/_components/Button";
import DetailIcon from "@/app/assets/images/DetailIcon.svg";
import React from "react";

const CustomPopover = ({ className, children, ...restProps }) => (
  <Popover overlayClassName={className} {...restProps}>
    {children}
  </Popover>
);

const StyledPopover = styled(CustomPopover)`
  box-shadow: 0px 0px 20px 0px #1d1b16;
  font-family: var(--font-ms);
  .ant-popover-inner {
    background-color: transparent;
    border-image-source: url("data:image/svg+xml,%3Csvg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%233B382F'/%3E%3C/svg%3E%0A");
    border-style: solid;
    border-width: 8px;
    border-image-slice: 8 fill;
    border-image-repeat: stretch;
    padding: 0;
  }
  .ant-popover-arrow::before {
    padding: 5px;
    background-color: #f0e9cf;
  }
`;

export const DetailsTooltip = ({ children, className }) => (
  <StyledPopover
    content={
      <div
        className={
          className ||
          "text-[#f0e9cf7a] text-[10px] leading-[14px] px-[4px] my-[-2px] text-center"
        }
      >
        {children}
      </div>
    }
  >
    <IconWrapper>
      <DetailIcon />
    </IconWrapper>
  </StyledPopover>
);

export default StyledPopover;
