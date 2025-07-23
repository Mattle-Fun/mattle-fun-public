"use client";
import styled from "styled-components";
import { Modal } from "antd";
import { exportUrl } from "@/app/_components/PixelBorderBox";

const StyledModal = styled(Modal)`
  font-family: var(--font-ms);
  .ant-modal-close {
    top: 0;
    right: -5px;
    svg {
      scale: 1.2;
      fill: #f0e9cf7a;
    }
    &:hover {
      path {
        fill: #f0e9cf;
        fill-opacity: 1;
      }
    }
  }
  .ant-modal-title {
    color: #f0e9cf7a !important;
  }
  .ant-modal-header {
    background: #1d1b16;
  }
  .ant-modal-content {
    border-image-source: url("${(props) => exportUrl("1d1b16")}");
    border-style: solid;
    border-width: 13px 15px;
    border-image-slice: 13 15 fill;
    border-image-repeat: stretch;
    padding: 8px 1px 3px 1px;
  }
  .ant-modal-title {
    text-align: center;
    color: #fafafa;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
`;

export default StyledModal;
