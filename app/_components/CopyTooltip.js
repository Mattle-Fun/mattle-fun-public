import React, { useState } from "react";
import { Tooltip } from "antd";

const CopyTooltip = ({ text, className, onClick, children, ...props }) => {
  const [open, setOpen] = useState(false);

  const handleCopy = async (e) => {
    onClick?.(e);
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        setOpen(true);
        setTimeout(() => setOpen(false), 200);
      } catch (err) {
        console.error("Copy failed", err);
      }
    }
  };

  return (
    <Tooltip title="Copied!" trigger="click" open={open}>
      <div className={className} {...props} onClick={handleCopy}>
        {children}
      </div>
    </Tooltip>
  );
};

export default CopyTooltip;
