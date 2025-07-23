"use client";
import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Token40Icon from "@/app/assets/images/Token40Icon.svg";
import Token24Icon from "@/app/assets/images/Token24Icon.svg";
import Link16Icon from "@/app/assets/images/Link16Icon.svg";
import PixelBorderBox, { PixelPillBox } from "@/app/_components/PixelBorderBox";
import { DetailsTooltip } from "@/app/_components/StyledPopover";
import styled from "styled-components";
import { usePrivy } from "@privy-io/react-auth";
import { SubLogin } from "@/app/_login/LoginPage";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { getTokenInfo, getUserAirdrop } from "@/app/allocation/server";
import { formatNumber, hasValue, roundToDecimals } from "@/app/helpers";
import { checkGamePassPurchased } from "@/app/shop/server";
import { GoToShop } from "@/app/shop/page";
dayjs.extend(utc);

const EventButton = styled.div`
  color: var(--color-text-subtle);
  &:hover {
    div {
      path:nth-of-type(-n + 2) {
        fill: var(--color-text-brand);
        fill-opacity: 1;
      }
      color: var(--color-text-brand);
    }
  }
`;
const TOTAL_SUPPLY = 10000000;
const Token = () => {
  const { user, ready, authenticated } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data, isFetching } = useQuery({
    queryKey: ["allocation"],
    queryFn: () => getTokenInfo(),
  });
  const { data: myData, isFetching: isMyFetching } = useQuery({
    queryKey: ["allocation", walletAddress],
    queryFn: () => getUserAirdrop(walletAddress),
    enabled: !!walletAddress,
  });
  const { data: isGamePassPurchased, isFetching: isGamePassFetching } =
    useQuery({
      queryKey: ["checkGamePassPurchased", walletAddress],
      enabled: !!walletAddress,
      queryFn: async () => {
        try {
          const bool = await checkGamePassPurchased(walletAddress);
          return bool;
        } catch (e) {
          return false;
        }
      },
    });
  const pointToken =
    hasValue(myData?.totalPoint) &&
    hasValue(data?.totalPoint, { allowZero: false })
      ? roundToDecimals(
          (myData.totalPoint * data.airdropToken) / data.totalPoint,
          1,
        )
      : 0;
  if (!ready || isFetching || isMyFetching || isGamePassFetching)
    return <Loading />;
  return (
    <div className={"flex flex-row gap-[24px] justify-center p-[40px]"}>
      <div
        className={
          "pl-[43px] pr-[64px] py-[16px] max-w-[377px] w-full flex flex-col gap-[24px]"
        }
      >
        <div className={"flex flex-col gap-[8px]"}>
          <div
            className={
              "text-[var(--color-text-subtle)] text-[16px] leading-[20px]"
            }
          >
            Introducing Utility Token
          </div>
          <div
            className={
              "text-[var(--color-text-normal)] text-[56px] leading-[60px]"
            }
          >
            $MATTLE
          </div>
        </div>
        <div className={"flex flex-col gap-[12px]"}>
          <div
            className={
              "text-[var(--color-text-subtle)] text-[16px] leading-[20px]"
            }
          >
            Total Supply
          </div>
          <div
            className={
              "flex flex-row gap-[8px] items-center text-[var(--color-text-normal)] text-[20px] leading-[24px]"
            }
          >
            <Token24Icon />
            {formatNumber(TOTAL_SUPPLY)}
          </div>
        </div>
        <div className={"flex flex-col gap-[12px]"}>
          <div
            className={
              "text-[var(--color-text-subtle)] text-[16px] leading-[20px] flex flex-row items-center gap-[4px]"
            }
          >
            Airdrop Pool for Players
            <DetailsTooltip>
              <span className={"text-[var(--color-text-brand)]"}>
                +100K per 100M
              </span>{" "}
              community points, <br />
              max 1M $MATTLE
            </DetailsTooltip>
          </div>
          <div
            className={
              "flex flex-row gap-[8px] items-center text-[var(--color-text-normal)] text-[20px] leading-[24px]"
            }
          >
            <Token24Icon />
            {formatNumber(data.airdropToken)}
          </div>
        </div>
        <div className={"flex flex-col gap-[12px]"}>
          <div
            className={
              "text-[var(--color-text-subtle)] text-[16px] leading-[20px]"
            }
          >
            Total Community Points
          </div>
          <div
            className={
              "text-[var(--color-text-normal)] text-[20px] leading-[24px]"
            }
          >
            {formatNumber(data?.totalPoint)}
          </div>
        </div>
        <div className={"flex flex-col gap-[12px]"}>
          <div
            className={
              "text-[var(--color-text-subtle)] text-[16px] leading-[20px]"
            }
          >
            Target Launch Price
          </div>
          <div
            className={
              "text-[var(--color-text-normal)] text-[20px] leading-[24px]"
            }
          >
            $1.00
          </div>
        </div>
      </div>
      <div className={"flex flex-col max-w-[500px] w-full"}>
        {!authenticated ? (
          <SubLogin description={"Login to see your stats"} />
        ) : isGamePassPurchased === true ? (
          <PixelBorderBox color={"1D1B16"} className={"p-[7px]"}>
            <div className={"flex flex-col gap-[12px] px-[8px]"}>
              <div
                className={
                  "text-[var(--color-text-subtle)] text-[14px] leading-[18px]"
                }
              >
                Your $MATTLE Balance
              </div>
              <div
                className={
                  "flex flex-row items-center gap-[16px] text-[var(--color-text-brand)] text-[40px] leading-[44px]"
                }
              >
                <Token40Icon />
                <div>
                  {pointToken +
                    (myData?.shopToken || 0) +
                    (myData?.eventToken || 0)}
                </div>
              </div>
              <PixelPillBox color={"f0e9cf1a"} className={"w-fit"}>
                <div
                  className={
                    "my-[-6px] text-[var(--color-text-normal)] text-[10px] leading-[14px]"
                  }
                >
                  Rewards will unlock after the Token Generation Event
                </div>
              </PixelPillBox>
            </div>
            <div className={"mt-[16px] flex flex-col gap-[12px]"}>
              <PixelBorderBox
                color={"f0e9cf0f"}
                className={"p-[7px] flex flex-col gap-[12px]"}
              >
                <div
                  className={
                    "flex flex-row items-center gap-[4px] text-[var(--color-text-subtle)] text-[14px] leading-[18px]"
                  }
                >
                  From Points
                  <DetailsTooltip>
                    Based on your{" "}
                    <span className={"text-[var(--color-text-brand)]"}>
                      share of total points
                    </span>
                    ,
                    <br />
                    updates dynamically
                  </DetailsTooltip>
                </div>
                <div className={"flex flex-row items-center gap-[8px]"}>
                  <Token24Icon />
                  <div className={"flex flex-row items-baseline gap-[8px]"}>
                    <div
                      className={
                        "text-[var(--color-text-normal)] text-[20px] leading-[24px]"
                      }
                    >
                      {roundToDecimals(pointToken, 1)}
                    </div>
                    <div
                      className={
                        "text-[var(--color-text-subtle)] text-[16px] leading-[20px]"
                      }
                    >
                      {formatNumber(myData?.totalPoint)} Points
                    </div>
                  </div>
                </div>
              </PixelBorderBox>
              <PixelBorderBox
                color={"f0e9cf0f"}
                className={"p-[7px] flex flex-col gap-[12px]"}
              >
                <div
                  className={
                    "flex flex-row items-center gap-[4px] text-[var(--color-text-subtle)] text-[14px] leading-[18px]"
                  }
                >
                  From Shop
                  <DetailsTooltip>
                    Earn MATTLE every time <br />
                    you{" "}
                    <span className={"text-[var(--color-text-brand)]"}>
                      buy a package
                    </span>
                  </DetailsTooltip>
                </div>
                <div className={"flex flex-row items-center gap-[8px]"}>
                  <Token24Icon />
                  <div
                    className={
                      "text-[var(--color-text-normal)] text-[20px] leading-[24px]"
                    }
                  >
                    {formatNumber(myData?.shopToken)}
                  </div>
                </div>
              </PixelBorderBox>
              <PixelBorderBox
                color={"f0e9cf0f"}
                className={"p-[7px] flex flex-col gap-[12px]"}
              >
                <div
                  className={
                    "flex flex-row items-center gap-[4px] text-[var(--color-text-subtle)] text-[14px] leading-[18px]"
                  }
                >
                  From Events
                  <DetailsTooltip>
                    Total rewards from
                    <br />
                    <span className={"text-[var(--color-text-brand)]"}>
                      all social events
                    </span>
                  </DetailsTooltip>
                </div>
                <div className={"flex flex-row items-center gap-[8px]"}>
                  <Token24Icon />
                  <div
                    className={
                      "text-[var(--color-text-normal)] text-[20px] leading-[24px]"
                    }
                  >
                    {myData?.eventToken}
                  </div>
                </div>
                {myData?.events?.length > 0 && (
                  <div
                    className={
                      "mt-[16px] pt-[16px] border-t border-[var(--color-border-subtle)] flex flex-col"
                    }
                  >
                    {myData.events.map((item, i) => (
                      <EventButton
                        key={i}
                        as={"a"}
                        href={item.url}
                        target={"_blank"}
                        className={
                          "flex flex-row items-center justify-between gap-[8px] py-[10px] cursor-pointer"
                        }
                      >
                        <div
                          className={
                            "flex flex-row items-center gap-[8px] text-[14px] leading-[18px]"
                          }
                        >
                          <Link16Icon />
                          {item.name}
                        </div>
                        <p
                          className={
                            "flex flex-row items-center gap-[10px] text-[var(--color-text-gentle)] text-[16px] leading-[20px] tracking-[0.64px]"
                          }
                        >
                          <Token24Icon />
                          {item.amount}
                        </p>
                      </EventButton>
                    ))}
                  </div>
                )}
              </PixelBorderBox>
            </div>
          </PixelBorderBox>
        ) : (
          <GoToShop description={"Claim your Game Pass to access Allocation"} />
        )}
      </div>
    </div>
  );
};

export default Token;
