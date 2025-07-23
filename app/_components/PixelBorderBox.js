"use client";
import styled from "styled-components";

export const exportUrl = (color) =>
  `data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 0H34V3H40V6H45V12H48V36H45V42H40V45H34V48H14V45H8V42H3V36H0V12H3V6H8V3H14V0Z' fill='%23${color}'/%3E%3C/svg%3E%0A`;
const exportTableUrl = (color) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21' fill='none'%3E%3Cpath d='M6 0H15V3H18V6H21V15H18V18H15V21H6V18H3V15H0V6H3V3H6V0Z' fill='%23${color}'/%3E%3C/svg%3E`;

const Box = styled.div`
  border-image-source: url("${(props) => exportUrl(props.$color)}");
  border-style: solid;
  border-width: 13px 15px;
  border-image-slice: 13 15 fill;
  border-image-repeat: stretch;
  z-index: 1;
  &:hover {
    border-image-source: url("${(props) => exportUrl(props.$hoverColor)}");
  }
`;

const TableBox = styled.div`
  border-image-source: url("${(props) => exportTableUrl(props.$color)}");
  border-style: solid;
  border-width: 9px;
  border-image-slice: 9 fill;
  border-image-repeat: stretch;
  z-index: 1;
  &:hover {
    border-image-source: url("${(props) => exportTableUrl(props.$hoverColor)}");
  }
`;

export const PixelTextBox = styled.div`
  border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 38 38' fill='none'%3E%3Cpath d='M30.5 1.5V4.5H33.5V7.5H36.5V30.5H33.5V33.5H30.5V36.5H7.5V33.5H4.5V30.5H1.5V7.5H4.5V4.5H7.5V1.5H30.5Z' fill='%23${(
    props,
  ) => (props.$color ? props.$color : "282001")}' stroke='%23${(props) =>
    props.$borderColor
      ? props.$borderColor
      : "6B5409"}' stroke-width='3'/%3E%3C/svg%3E");
  border-style: solid;
  border-width: 12px;
  border-image-slice: 12 fill;
  border-image-repeat: stretch;
  color: #f0e9cf;
  box-sizing: border-box;
  &:hover {
    border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 38 38' fill='none'%3E%3Cpath d='M30.5 1.5V4.5H33.5V7.5H36.5V30.5H33.5V33.5H30.5V36.5H7.5V33.5H4.5V30.5H1.5V7.5H4.5V4.5H7.5V1.5H30.5Z' fill='%23${(
      props,
    ) =>
      props.$hoverColor
        ? props.$hoverColor
        : props.$color || "282001"}' stroke='%23${(props) =>
      props.$borderColor
        ? props.$borderColor
        : "6B5409"}' stroke-width='3'/%3E%3C/svg%3E");
  }
`;

export const PixelPillBox = styled.div`
  border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'%3E%3Cpath d='M13 0V2H16V4H18V14H16V16H13V18H5V16H2V14H0V4H2V2H5V0H13Z' fill='%23${(
    props,
  ) => (props.$color ? props.$color : "f0e9cf1a")}'/%3E%3C/svg%3E");
  border-style: solid;
  border-width: 8px;
  border-image-slice: 8 fill;
  border-image-repeat: stretch;
  box-sizing: border-box;
`;

export function TablePixelBorderBox({
  color,
  hoverColor,
  children,
  className,
  ...props
}) {
  return (
    <TableBox
      {...props}
      $color={color}
      $hoverColor={hoverColor || color}
      className={className}
    >
      {children}
    </TableBox>
  );
}

export default function PixelBorderBox({
  color,
  hoverColor,
  children,
  className,
  ...props
}) {
  return (
    <Box
      {...props}
      $color={color}
      $hoverColor={hoverColor || color}
      className={className}
    >
      {children}
    </Box>
  );
}
