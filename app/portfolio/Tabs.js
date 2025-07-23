"use client";
import RetweetIcon from "@/app/assets/images/RetweetIcon.svg";
import styled from "styled-components";
import { TokenGroups } from "@/app/constants";

const RefreshButton = styled.div`
  &:hover {
    color: #f1c315;
    path {
      fill: #f1c315;
    }
  }
`;
const items = [
  {
    key: TokenGroups.all,
    label: "All",
  },
  {
    key: TokenGroups.stable,
    label: "Stable",
  },
  {
    key: TokenGroups.partner,
    label: "Listed",
  },
  {
    key: TokenGroups.normal,
    label: "Unlisted",
  },
];
const Tabs = ({ tab = TokenGroups.all, setTab, refetch }) => {
  return (
    <div className="flex items-center justify-between flex-row px-[48px] border-t border-b border-[#493B0C] text-[#F0E9CF7A] font-[400] text-[16px] leading-[20px] ">
      <div className="flex items-center flex-row">
        {items.map(({ key, label }) => (
          <div
            key={key}
            className={`py-[12px] px-[16px] cursor-pointer ${tab === key && "text-[#F1C315]"} hover:text-[#F1C315]`}
            onClick={() => setTab(key)}
          >
            {label}
          </div>
        ))}
      </div>
      <RefreshButton
        className="text-[#F0E9CF] flex items-center flex-row gap-[8px] cursor-pointer px-[22px] py-[8px]"
        onClick={refetch}
      >
        <RetweetIcon />
        <div>Refresh</div>
      </RefreshButton>
    </div>
  );
};

export default Tabs;
