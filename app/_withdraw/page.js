import React, { useState } from "react";
import { Button } from "@/app/portfolio/PortfolioPage";
import SendIcon from "@/app/assets/images/SendIcon.svg";
import { useBalanceMap } from "@/app/trading/hooks";
import SendTokenModal from "@/app/_withdraw/SendTokenModal";
import SelectTokenModal from "@/app/_withdraw/SelectTokenModal";
import { usePrivy } from "@privy-io/react-auth";

const WithdrawButton = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [balanceMap] = useBalanceMap(walletAddress);
  const [token, setToken] = useState();
  return (
    <>
      <Button
        color={"F0E9CF1A"}
        hoverColor={"F0D469"}
        onClick={() => setIsSelectModalOpen(true)}
      >
        <SendIcon />
        <div className={"px-[4px]"}>Send</div>
      </Button>
      <SelectTokenModal
        isOpen={isSelectModalOpen}
        setIsOpen={setIsSelectModalOpen}
        onSelect={(value) => {
          setToken(value);
          setIsSendModalOpen(true);
          setIsSelectModalOpen(false);
        }}
        balanceMap={balanceMap}
        walletAddress={walletAddress}
      />
      <SendTokenModal
        asset={token}
        isOpen={isSendModalOpen}
        setIsOpen={setIsSendModalOpen}
        walletAddress={walletAddress}
        balanceMap={balanceMap}
        onBack={() => {
          setIsSendModalOpen(false);
          setIsSelectModalOpen(true);
        }}
      />
    </>
  );
};

export default React.memo(WithdrawButton);
