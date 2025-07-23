"use client";
import Tabs from "@/app/portfolio/Tabs";
import Row from "@/app/portfolio/Row";
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { calcPnL, filterList, getPortfolio } from "@/app/dashboard/server";
import styled from "styled-components";
import { Skeleton } from "antd";
import ReceiveIcon from "@/app/assets/images/ReceiveIcon.svg";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import { useFundWallet } from "@privy-io/react-auth/solana";
import { usePrivy } from "@privy-io/react-auth";
import { roundToDecimals } from "@/app/helpers";
import WithdrawButton from "@/app/_withdraw/page";
import { TokenGroups } from "@/app/constants";
import Loading from "@/app/loading";
import { SubLogin } from "@/app/_login/LoginPage";

export const Button = styled(PixelBorderBox)`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f0e9cf;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  height: 40px;
  box-sizing: border-box;
  &:hover {
    color: #100d08e5;
    path {
      fill: #100d08e5;
      fill-opacity: 1;
    }
  }
`;

const StyledTable = styled.table`
  td {
    margin: 0;
    padding: 0;
  }
  thead {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 128.571% */
    td:first-child {
      div {
        border-style: solid;
        border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%231D1B16'/%3E%3C/svg%3E");
        border-width: 9px;
        border-right: 0;
        border-image-slice: 9 fill;
        border-image-repeat: stretch;
        padding: 3px 0 3px 7px;
      }
    }
    td:last-child {
      div {
        border-style: solid;
        border-width: 9px;
        border-left: 0;
        border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%231D1B16'/%3E%3C/svg%3E");
        border-image-slice: 9 fill;
        border-image-repeat: stretch;
        padding: 3px 7px 3px 0;
      }
    }
  }
  tbody {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 125% */
    letter-spacing: 0.64px;
    td {
      box-sizing: border-box;
      height: 40px;
      align-items: center;
    }
    td:first-child div {
      padding-left: 16px;
    }
    td:last-child div {
      padding-right: 16px;
    }
    tr:hover {
      td:first-child {
        div {
          padding: 1px 0 1px 7px;
          display: flex;
          border-style: solid;
          border-width: 9px;
          border-right: 0;
          border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%23F0E9CF3D'/%3E%3C/svg%3E");
          border-image-slice: 9 fill;
          border-image-repeat: stretch;
          height: 40px;
        }
      }

      td:last-child {
        div {
          padding: 1px 7px 1px 0;
          border-style: solid;
          border-width: 9px;
          border-left: 0;
          border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%23F0E9CF3D'/%3E%3C/svg%3E");
          border-image-slice: 9 fill;
          border-image-repeat: stretch;
          height: 40px;
        }
      }
      td:not(:first-child):not(:last-child) {
        background: rgba(240, 233, 207, 0.24);
      }
    }
  }
`;
const StyledSkeleton = styled(Skeleton)`
  & .ant-skeleton-title,
  & .ant-skeleton-paragraph li {
    background-image: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    ) !important;
  }
`;
const PortfolioPage = () => {
  const { ready, authenticated, user } = usePrivy();
  const [tab, setTab] = useState(TokenGroups.all);
  const { fundWallet } = useFundWallet();
  const walletAddress = user?.wallet?.address;
  const enabled = !!walletAddress && !!ready && !!authenticated;
  const { data, isFetching, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["portfolio", walletAddress],
    queryFn: async () => {
      console.log("Running Data Portfolio");
      await calcPnL(walletAddress);
      const data = await getPortfolio(walletAddress);
      const stableList = await filterList(data, "stable-coin");
      const partnerList = await filterList(data, "partner");
      const normalList = await filterList(data, "jupiter-strict");
      return {
        stableList,
        partnerList,
        normalList,
      };
    },
    enabled,
  });

  const dataSource = useMemo(() => {
    if (data && typeof data === "object") {
      const { stableList, partnerList, normalList } = data || {};
      const allList = [...stableList, ...partnerList, ...normalList];
      const portfolio = {
        total: allList?.reduce(
          (accumulator, a) => accumulator + a.balance * a.currentPrice,
          0,
        ),
        change: allList?.reduce(
          (accumulator, a) =>
            accumulator + (a.type !== "stable-coin" ? a.pnl : 0),
          0,
        ),
      };
      const listing = (() => {
        switch (tab) {
          case TokenGroups.all:
            return allList;
          case TokenGroups.stable:
            return stableList;
          case TokenGroups.partner:
            return partnerList;
          case TokenGroups.normal:
            return normalList;
        }
      })();
      return { listing, portfolio };
    }
    return {};
  }, [data, tab]);
  if (!ready) return <Loading />;
  if (ready && !authenticated) return <SubLogin />;
  return (
    <div className={"flex flex-col"}>
      <div className="flex items-center justify-between py-9 px-16">
        <div>
          <div
            className={"text-[#F0E9CF7A] text-[16px] leading-[20px] mb-[8px]"}
          >
            Total balance:
          </div>
          <div className="flex items-end gap-[12px] mb-[4px]">
            <div className="text-[#F0E9CF] font-[400] text-[56px] leading-[60px]">
              ${roundToDecimals(dataSource?.portfolio?.total || 0, 2)}
            </div>
            <div
              className={`${roundToDecimals(dataSource?.portfolio?.change || 0, 2) === 0 ? "text-[#F1C315]" : dataSource?.portfolio?.change < 0 ? "text-[#FF6200]" : "text-[#00FF97]"} font-[400] text-[20px] leading-[38px]`}
            >
              {`${roundToDecimals(dataSource?.portfolio?.change || 0, 2) < 0 ? "-" : "+"}$${Math.abs(roundToDecimals(dataSource?.portfolio?.change || 0, 2)).toFixed(2)}`}
            </div>
          </div>
        </div>
        <div className="flex gap-[16px]">
          <Button
            color={"F0E9CF1A"}
            hoverColor={"F0D469"}
            onClick={() =>
              fundWallet(walletAddress, {
                cluster: { name: "mainnet-beta" },
                amount: 0.01,
                uiConfig: {
                  receiveFundsTitle: "Deposit fund",
                  receiveFundsSubtitle:
                    "Scan this code or copy your wallet address to receive funds.",
                },
              })
            }
          >
            <ReceiveIcon />
            <div className={"px-[4px]"}>Receive</div>
          </Button>
          <WithdrawButton />
        </div>
      </div>
      <Tabs tab={tab} setTab={setTab} refetch={refetch} />
      <div className={"py-[24px] px-[48px] flex-1 flex flex-col"}>
        <StyledTable className="w-full">
          <colgroup>
            <col width="230" />
            <col width="215" />
            <col width="215" />
            <col width="215" />
            <col width="215" />
          </colgroup>
          <thead>
            <tr className="text-left text-[#F0E9CF7A]">
              <td>
                <div>Asset</div>
              </td>
              <td className="bg-[#1d1b16] text-center">Perks</td>
              <td className="bg-[#1d1b16] text-right">Balance</td>
              <td className="bg-[#1d1b16] text-right">Value</td>
              <td>
                <div className="text-right">PnL</div>
              </td>
            </tr>
          </thead>
        </StyledTable>
        <div className={"flex-1"}>
          {isFetching ? (
            <StyledSkeleton
              className={"mt-[15px]"}
              title={false}
              active
              paragraph={{ rows: 5 }}
              loading={isFetching}
            />
          ) : (
            <div>
              <StyledTable className="w-full">
                <colgroup>
                  <col width="230" />
                  <col width="215" />
                  <col width="215" />
                  <col width="215" />
                  <col width="215" />
                </colgroup>
                <tbody>
                  <tr className={"h-[5px]"} />
                  {dataSource?.listing?.map((asset) => (
                    <Row key={asset.address} asset={asset} />
                  ))}
                </tbody>
              </StyledTable>
            </div>
          )}
        </div>
        {!(dataSource?.listing?.length > 0) && !isFetching && enabled && (
          <div
            className={
              "m-[48px] text-white text-center font-[400] text-[14px] leading-[18px]"
            }
          >
            You have nothing in your wallet, please deposit and step up your
            game!
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
