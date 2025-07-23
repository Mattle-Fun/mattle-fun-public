"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Table, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getPortfolio, filterList, calcPnL } from "@/app/dashboard/server";
import { sround } from "@/app/helpers";

const getColumnsStable = () => [
  {
    title: "Token",
    dataIndex: "symbol",
    width: 200,
  },
  {
    title: "Balance",
    dataIndex: "balance",
    width: 200,
    render: (value) => `${sround(value, 4)}`,
  },
];

const getColumns = () => [
  {
    title: "Token",
    dataIndex: "symbol",
    width: 200,
  },
  {
    title: "Average Price",
    dataIndex: "avgBuy",
    width: 200,
    render: (value) => `$${sround(value, 4)}`,
  },
  {
    title: "Current Price",
    dataIndex: "currentPrice",
    width: 200,
    render: (value) => `$${sround(value, 4)}`,
  },
  {
    title: "Balance",
    dataIndex: "balance",
    width: 200,
    render: (value) => `${sround(value, 4)}`,
  },
  {
    title: "Value",
    dataIndex: "balance",
    width: 200,
    render: (value, record) => `$${sround(value * record.currentPrice, 4)}`,
  },
  {
    title: "PnL",
    dataIndex: "pnl",
    width: 200,
    render: (value, record) => {
      let pnl = value > 0 ? "+" : "-";
      const pnlValue = Math.abs(sround(value, 4));
      const percentageChange =
        Math.abs(record.currentPrice / record.avgBuy - 1) * 100;

      return `${pnl}$${pnlValue} (${pnl}${percentageChange.toFixed(2)}%)`;
    },
  },
];

const Portfolio = ({ walletAddress, isCalculated }) => {
  const [loading, setLoading] = useState(false);

  const { data, isFetching, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["portfolio", walletAddress],
    queryFn: async () => {
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
    enabled: !!walletAddress,
  });

  const getPnL = async () => {
    setLoading(true);
    await calcPnL(walletAddress);
    refetch();
    setLoading(false);
  };

  useEffect(() => {
    if (isCalculated) {
      refetch();
    }
  }, [isCalculated, refetch]);

  const columns = useMemo(() => getColumns(), [walletAddress]);

  const columnsStable = useMemo(() => getColumnsStable(), [walletAddress]);

  if (data === true || !data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Button
        loading={loading}
        onClick={() => getPnL()}
        style={{ float: "right" }}
      >
        Refresh
      </Button>
      <h3>Stable</h3>
      <Table
        columns={columnsStable}
        loading={isLoading || isFetching}
        dataSource={data.stableList || []}
        rowKey={"_id"}
        pagination={false}
      />
      <h3>Partner</h3>
      <Table
        columns={columns}
        loading={isLoading || isFetching}
        dataSource={data.partnerList || []}
        rowKey={"_id"}
        pagination={false}
      />
      <h3>Normal</h3>
      <Table
        columns={columns}
        loading={isLoading || isFetching}
        dataSource={data.normalList || []}
        rowKey={"_id"}
        pagination={false}
      />
    </>
  );
};

export default React.memo(Portfolio);
