"use client";
import { usePathname } from "next/navigation";
import { Slider } from "antd";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { shortAddress } from "@/app/helpers";
import CopyTooltip from "@/app/_components/CopyTooltip";
import CopyIcon from "@/app/assets/images/CopyIcon.svg";
import LogoMark24Icon from "@/app/assets/images/LogoMark24Icon.svg";
import LogoutIcon from "@/app/assets/images/LogoutIcon.svg";
import ExportIcon from "@/app/assets/images/ExportIcon.svg";
import CloseIcon from "@/app/assets/images/CloseIcon.svg";
import DownOutlinedIcon from "@/app/assets/images/DownOutlinedIcon.svg";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import StyledPopover from "@/app/_components/StyledPopover";
import { LoginTextButton } from "@/app/_components/LoginButton";
import SidebarMenu from "@/app/_components/SidebarMenu";
import Link from "next/link";
import { EVENT_DISPLAY_CODE } from "@/app/constants";
import { PixelTextBox } from "@/app/_components/PixelBorderBox";
import { IconWrapper } from "@/app/_components/Button";

const SliderBox = styled.div`
  border-image-source: url("data:image/svg+xml,%3Csvg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%23100D0852'/%3E%3C/svg%3E%0A");
  border-style: solid;
  border-width: 8px;
  border-image-slice: 8 fill;
  border-image-repeat: stretch;
  padding: 4px 8px 8px 8px;
  width: 218px;
  box-sizing: border-box;
`;
const StyledSlider = styled(Slider)`
  .ant-slider-rail,
  .ant-slider-track {
    border-style: solid;
    border-width: 8px;
    border-image-slice: 8 fill;
    border-image-repeat: stretch;
  }
  .ant-slider-rail {
    border-image-source: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0V2H2V4H0V14H2V16H5V18H13V16H16V14H18V4H16V2H13V0H5Z' fill='%23100D0852'/%3E%3C/svg%3E%0A");
    box-sizing: content-box;
    height: 0;
  }
  .ant-slider-track {
    border-image-source: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0V2H2V4H0V14H2V16H5V18H13V16H16V14H18V4H16V2H13V0H5Z' fill='%23F0E9CF7A'/%3E%3C/svg%3E%0A");
    background-color: transparent;
    border-right: 0;
  }
  .ant-slider-handle {
    &::before {
      display: none;
    }
    &::after {
      border-image-source: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0V2H2V4H0V14H2V16H5V18H13V16H16V14H18V4H16V2H13V0H5Z' fill='%23F0E9CF'/%3E%3C/svg%3E%0A");
      border-style: solid;
      border-width: 8px;
      border-image-slice: 8 fill;
      border-image-repeat: stretch;
      width: auto;
      height: auto;
      box-shadow: none;
      outline: none;
      inset-inline-start: 0;
      inset-block-start: 0;
      border-radius: inherit;
      padding: 2px;
      background-color: transparent;
      z-index: 2;
    }
  }
  &:hover {
    .ant-slider-track {
      border-image-source: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0V2H2V4H0V14H2V16H5V18H13V16H16V14H18V4H16V2H13V0H5Z' fill='%23F1C315'/%3E%3C/svg%3E%0A");
      background-color: transparent;
      border-right: 0;
    }
    .ant-slider-handle {
      &::after {
        box-shadow: none;
        outline: none;
        width: auto;
        height: auto;
        inset-inline-start: 0;
        inset-block-start: 0;
      }
    }
  }
  .ant-slider-handle:focus::after,
  .ant-slider-handle:active::after {
    box-shadow: none;
    outline: none;
    width: auto;
    height: auto;
    inset-inline-start: 0;
    inset-block-start: 0;
  }
`;
const ItemDiv = styled.div`
  &:hover {
    color: #f1c315;
    svg path {
      fill: #f1c315;
      fill-opacity: 1;
    }
  }
`;
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
const CloseButton = styled.div`
  &:hover {
    path {
      fill: #f1c315;
      fill-opacity: 1;
    }
  }
`;
function Navbar() {
  const pathname = usePathname();
  const [opacity, setOpacity] = useState(30);
  const { ready, authenticated, user, logout } = usePrivy();
  const { exportWallet } = useSolanaWallets();

  const [isEventVisible, setIsEventVisible] = useState(undefined);
  const enabled = Boolean(
    ready &&
      authenticated &&
      user?.linkedAccounts?.find(
        (account) =>
          account.type === "wallet" &&
          account.walletClientType === "privy" &&
          account.chainType === "solana",
      ),
  );

  const onChange = (value) => {
    const backgroundDiv = document.getElementById("pixel-background-id");
    if (backgroundDiv) {
      backgroundDiv.style.opacity = value / 100;
    }
    localStorage.setItem("backgroundOpacity", value / 100);
    setOpacity(value);
  };

  const onHideEvent = () => {
    setIsEventVisible(false);
    localStorage.setItem(EVENT_DISPLAY_CODE, "false");
  };
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--navbar-total-height",
      `${isEventVisible ? 94 : 62}px`,
    );
  }, [isEventVisible]);
  useEffect(() => {
    setIsEventVisible(localStorage.getItem(EVENT_DISPLAY_CODE) !== "false");
    const savedOpacity = localStorage.getItem("backgroundOpacity");
    const backgroundDiv = document.getElementById("pixel-background-id");

    if (savedOpacity && backgroundDiv) {
      const numericOpacity = parseFloat(savedOpacity);
      setOpacity(parseInt(numericOpacity * 100));
      backgroundDiv.style.opacity = numericOpacity;
    }
  }, []);
  if (["/game"].includes(pathname) || isEventVisible === undefined) {
    return null;
  }
  return (
    <nav className="fixed top-0 left-0 h-[var(--navbar-total-height)] w-full border-b border-[#493B0C] z-50 bg-[#100D08]">
      <div
        className={
          "relative truncate h-[32px] w-full bg-[url('/images/event-background.png')] bg-no-repeat bg-cover bg-center"
        }
        style={{
          display: isEventVisible ? "block" : "none",
        }}
      >
        <Link
          className={"truncate"}
          href={"https://x.com/mattlefun/status/1947310350757691817"}
          target={"_blank"}
        >
          <div
            className={
              "size-full text-[12px] leading-[16px] flex items-center justify-center"
            }
            style={{
              WebkitTextStrokeWidth: "4px",
              WebkitTextStrokeColor: "#493B0C",
              paintOrder: "stroke fill",
              textTransform: "uppercase",
            }}
          >
            Mattle Run BONK Season - Win $3000
          </div>
        </Link>
        <CloseButton
          className={"absolute top-0 right-[16px] p-[8px] cursor-pointer"}
          onClick={onHideEvent}
        >
          <CloseIcon />
        </CloseButton>
      </div>

      <div className="relative flex flex-row items-center">
        {/*TODO: Mobile*/}
        <IconWrapper
          className={
            "h-full cursor-pointer md:block hidden px-[24px] py-[16px]"
          }
        >
          <Link href="/" className="text-[#F0E9CF] text-[20px] leading-[24px]">
            <LogoMark24Icon />
          </Link>
        </IconWrapper>
        <div
          className={
            "w-full pr-[24px] py-[12px] flex flex-row items-center justify-between"
          }
        >
          {/*TODO: Mobile*/}
          <div className="flex items-center justify-center h-full overflow-auto md:mr-0 mr-[16px] ml-[4px]">
            <SidebarMenu />
          </div>

          <div className="flex flex-row items-center gap-[16px]">
            <a href={"/game"} target={"_blank"}>
              <PixelTextBox
                $borderColor={"493B0C"}
                $color={"F1C315"}
                $hoverColor={"F0D469"}
                className={
                  "text-[var(--color-text-normal)] text-[16px] leading-[20px] px-[6px] cursor-pointer "
                }
                style={{
                  textShadow: `
                  -1px -1px 0 #493B0C,
                  1px -1px 0 #493B0C,
                  -1px 1px 0 #493B0C,
                  1px 1px 0 #493B0C,
                  -1px 0px 0 #493B0C,
                  1px 0px 0 #493B0C,
                  0px -1px 0 #493B0C,
                  0px 1px 0 #493B0C,
                  0px 2px 0 #282001, 
                  1px 2px 0 #282001, 
                  -1px 2px 0 #282001
                  `,
                }}
              >
                <div className={"my-[-3px] whitespace-nowrap"}>Play Now</div>
              </PixelTextBox>
            </a>
            <div className={"h-[24px] w-[1px] bg-[#493B0C]"} />
            {!ready ? (
              <div />
            ) : !authenticated ? (
                <LoginTextButton />
            ) : (
              <StyledPopover
                content={
                  <div
                    className={
                      "text-[#f0e9cf] flex flex-col gap-[12px] p-[8px]"
                    }
                  >
                    <SliderBox>
                      <div
                        className={
                          "flex flex-row justify-between items-center text-[14px] leading-[18px] mb-[8px]"
                        }
                      >
                        <div className={"text-[#F0E9CF]"}>CRT Filter</div>
                        <div className={"text-[#F0E9CF7A]"}>{opacity}</div>
                      </div>
                      <div className={"pr-[12px]"}>
                        <StyledSlider
                          defaultValue={opacity}
                          onChange={onChange}
                        />
                      </div>
                    </SliderBox>
                    <CopyTooltip text={user?.wallet?.address}>
                      <ItemDiv
                        className={
                          "flex flex-row justify-between items-center cursor-pointer p-[4px] text-[16px] leading-[20px]"
                        }
                      >
                        <div>Copy address</div>
                        <CopyIcon />
                      </ItemDiv>
                    </CopyTooltip>
                    {enabled && (
                      <ItemDiv
                        className={
                          "flex flex-row justify-between items-center cursor-pointer p-[4px] text-[16px] leading-[20px]"
                        }
                        onClick={() => exportWallet()}
                      >
                        <div>Export key</div>
                        <ExportIcon />
                      </ItemDiv>
                    )}
                    <ItemDiv
                      className={
                        "flex flex-row justify-between items-center cursor-pointer p-[4px] text-[16px] leading-[20px]"
                      }
                      onClick={() => {
                        localStorage.clear();
                        return logout();
                      }}
                    >
                      <div>Log out</div>
                      <LogoutIcon />
                    </ItemDiv>
                  </div>
                }
                trigger="click"
                arrow={false}
              >
                <Button className="flex flex-row items-center gap-[8px] text-[var(--color-text-gentle)] text-[16px] leading-[20px] tracking-[0.64px] px-[4px] ml-[-4px]">
                  {shortAddress(user?.wallet?.address, 4)}
                  <DownOutlinedIcon />
                </Button>
              </StyledPopover>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default React.memo(Navbar);
