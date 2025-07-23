"use client";
import { useLogin } from "@privy-io/react-auth";
import { useState } from "react";
import UserIcon from "@/app/assets/images/UserIcon.svg";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import { TextButton } from "@/app/_components/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletProviderWrapper from "@/app/_components/WalletProvider";

export const LoginTextButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useLogin({
    onComplete: () => {
      localStorage.setItem("isFetchData", "false");
      setIsLoading(false);
      console.log("onComplete");
    },
    onError: () => setIsLoading(false),
  });
  return (
    <TextButton
      className={"text-[var(--color-text-gentle)] hover:text-[#F1C315]"}
      onClick={() => {
        setIsLoading(true);
        login();
      }}
      disabled={isLoading}
    >
      <div
        className={
          "flex flex-row gap-[8px] items-center text-center my-[-6px] ml-[-4px] pl-[4px] pr-[4px]"
        }
      >
        {isLoading ? "Loading..." : "Login"}
        <UserIcon />
      </div>
    </TextButton>
  );
};
export default function LoginButton({
  color = "F1C315",
  hoverColor = "F0D469",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useLogin({
    onComplete: () => {
      localStorage.setItem("isFetchData", "false");
      setIsLoading(false);
      console.log("onComplete");
    },
    onError: () => setIsLoading(false),
  });
  return (
    <PixelBorderBox
      color={color}
      hoverColor={hoverColor}
      as={"button"}
      className={"h-[40px]"}
      onClick={() => {
        setIsLoading(true);
        login();
      }}
      disabled={isLoading}
    >
      <div className={"text-[#100D08E5] text-center my-[-6px] px-[7px]"}>
        {isLoading ? "Loading..." : "Login"}
      </div>
    </PixelBorderBox>
  );
}

export function ConnectWallet() {
  const { connected, publicKey, connect, disconnect } = useWallet();

  return (
    <div>
      {connected ? (
        <button onClick={disconnect}>
          Disconnect ({publicKey?.toBase58().slice(0, 4)}...
          {publicKey?.toBase58().slice(-4)})
        </button>
      ) : (
        <button onClick={connect}>Connect (Mobile)</button>
      )}
    </div>
  );
}

export const ConnectWalletButton = () => (
  <WalletProviderWrapper>
    <ConnectWallet />
  </WalletProviderWrapper>
);
