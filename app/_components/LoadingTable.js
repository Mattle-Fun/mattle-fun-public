"use client";
import styled from "styled-components";
import { Skeleton } from "antd";

const LoadingTable = styled(Skeleton)`
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

export default LoadingTable;
