"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import StyledPopover from "@/app/_components/StyledPopover";
import DownOutlinedIcon from "@/app/assets/images/DownOutlinedIcon.svg";
import Discord20Icon from "@/app/assets/images/Discord20Icon.svg";
import X20Icon from "@/app/assets/images/X20Icon.svg";
import Tele20Icon from "@/app/assets/images/Tele20Icon.svg";
import Youtube20Icon from "@/app/assets/images/Youtube20Icon.svg";
import styled from "styled-components";
import React, { useMemo } from "react";
import { IconWrapper } from "@/app/_components/Button";

const Button = styled.button`
  &:hover,
  &:active {
    color: #f1c315;
    path {
      fill: #f1c315;
      fill-opacity: 1;
    }
  }
`;

const links = [
  {
    path: "https://x.com/mattlefun",
    target: "_blank",
    icon: <X20Icon />,
  },
  {
    path: "https://discord.gg/JRgwZhmP8Q",
    target: "_blank",
    icon: <Discord20Icon />,
  },
  {
    path: "https://t.me/mattlefun",
    target: "_blank",
    icon: <Tele20Icon />,
  },
  {
    path: "https://www.youtube.com/@mattlefun",
    target: "_blank",
    icon: <Youtube20Icon />,
  },
];
function SidebarMenu() {
  const _pathname = usePathname();
  const pathname = _pathname === "/" ? "/trading" : _pathname;
  const isProduction = useMemo(
    () => window?.location?.hostname === "mattle.fun",
    [],
  );
  const menuItems = [
    { name: "Trading", path: "/trading" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Quest", path: "/quest" },
    { name: "Shop", path: "/shop" },
    {
      name: "More",
      path: "/more",
      children: isProduction
        ? [
            { name: "Campaign", path: "/campaign" },
            { name: "Allocation", path: "/allocation" },
            { name: "Ranking", path: "/ranking" },
            {
              name: "Playbook",
              path: "https://mattlefun.fandom.com/",
              target: "_blank",
            },
          ]
        : [
            { name: "Campaign", path: "/campaign" },
            { name: "Allocation", path: "/allocation" },
            { name: "Ranking", path: "/ranking" },
            { name: "Holding", path: "/holding" },
            {
              name: "Playbook",
              path: "https://mattlefun.fandom.com/",
              target: "_blank",
            },
          ],
    },
  ];
  if (["/game"].includes(pathname)) {
    return null;
  }
  return (
    <>
      <div className="flex flex-row gap-[28px]">
        {menuItems.map((item) =>
          item.children?.length > 0 ? (
            <StyledPopover
              key={item.path}
              className={"min-w-[156px]"}
              content={
                <div className={"flex flex-col gap-[12px] p-[8px]"}>
                  {item.children.map((i, index) => (
                    <Link
                      key={i.path}
                      href={i.path}
                      className={`flex items-center gap-[4px] px-[4px] font-normal hover:text-[#f1c315] text-[14px] leading-[18px] tracking-normal transition-colors ${
                        pathname === i.path
                          ? "text-[#F1C315]"
                          : "text-[var(--color-text-gentle)]"
                      }`}
                      target={i.target}
                    >
                      {i.name}
                    </Link>
                  ))}
                  <div
                    className={"w-full h-[1px] bg-[var(--color-border-subtle)]"}
                  />
                  <div
                    className={"flex flex-row items-center gap-[12px] px-[4px]"}
                  >
                    {links.map((i, index) => (
                      <IconWrapper key={index}>
                        <Link key={i.path} href={i.path} target={i.target}>
                          {i.icon}
                        </Link>
                      </IconWrapper>
                    ))}
                  </div>
                </div>
              }
              arrow={false}
            >
              <Button
                className={
                  "flex flex-row items-center gap-[4px] text-[#F0E9CF] text-[16px] leading-[20px] tracking-normal transition-colors"
                }
              >
                {item.name}
                <DownOutlinedIcon />
              </Button>
            </StyledPopover>
          ) : (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-[4px] font-normal text-[16px] leading-[20px] tracking-normal transition-colors ${
                pathname === item.path
                  ? "text-[#F1C315]"
                  : "text-[#F0E9CF] hover:text-[#f1c315]"
              }`}
              target={item.target}
            >
              {item.name}
            </Link>
          ),
        )}
      </div>
    </>
  );
}

export default React.memo(SidebarMenu);
