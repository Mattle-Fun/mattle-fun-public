"use client";

import styled from "styled-components";

export const TextButton = styled.button`
  &:hover {
    path {
      fill: ${(props) =>
        props.$iconHoverColor ? props.$iconHoverColor : "#f1c315"};
      fill-opacity: 1;
    }
  }
`;

export const IconWrapper = styled.div`
  &:hover {
    path {
      fill: ${(props) =>
        props.$iconHoverColor ? props.$iconHoverColor : "#f1c315"};
      fill-opacity: 1;
    }
  }
`;
