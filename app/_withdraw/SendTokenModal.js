"use client";
import React, { useEffect, useRef, useState } from "react";
import { TokenLogo20 } from "@/app/_components/TokenLogo";
import StyledModal from "@/app/_components/StyledModal";
import BackIcon from "@/app/assets/images/BackIcon.svg";
import WarningIcon from "@/app/assets/images/WarningIcon.svg";
import { roundToDecimals } from "@/app/helpers";
import styled from "styled-components";
import PixelBorderBox from "@/app/_components/PixelBorderBox";
import { Input, notification } from "antd";
import bs58 from "bs58";
import {
  ComputeBudgetProgram,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { SOL_ADDRESS } from "@/app/constants";
import { JitoJsonRpcClient } from "@/app/_withdraw/src";
import CloseIcon from "@/app/assets/images/CloseIcon.svg";

const connection = new Connection(process.env.NEXT_PUBLIC_RPC, "confirmed");
const jitoClient = new JitoJsonRpcClient(
  "https://mainnet.block-engine.jito.wtf/api/v1",
  "",
);
const PRIORITY_FEE = +process.env.NEXT_PUBLIC_PRIORITY_FEE;
const TIP = +process.env.NEXT_PUBLIC_TIP;

const Tag = styled.div`
  border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='18' viewBox='0 0 19 18' fill='none'%3E%3Cpath d='M5 0V2H2V4H0V14H2V16H5V18H14V16H17V14H19V4H17V2H14V0H5Z' fill='%23F0E9CF' fill-opacity='0.1'/%3E%3C/svg%3E");
  border-style: solid;
  border-width: 8px;
  border-image-slice: 8 fill;
  border-image-repeat: stretch;
  height: 18px;
  width: 37px;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  color: #f0e9cf;
  div {
    position: absolute;
    top: 75%;
    left: 55%;
    transform: translate(-50%, -50%);
  }
  &:hover {
    color: #f1c315;
  }
`;

const TextArea = styled(Input.TextArea)`
  color: rgba(240, 233, 207, 0.48);
  font-family: var(--font-ms);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  outline: 2px solid transparent;
  outline-offset: 2px;
  &,
  &:hover,
  &:focus {
    box-shadow: 0 0 #0000;
    background: none;
    color: #fafafa;
  }
  &::placeholder {
    color: #f0e9cf7a;
  }
`;

const BackButton = styled.div`
  &:hover {
    path {
      fill: #f0e9cf;
      fill-opacity: 1;
    }
  }
`;
const SendTokenModal = ({ asset, isOpen, setIsOpen, balanceMap, onBack }) => {
  const [api, contextHolder] = notification.useNotification();
  const { user } = usePrivy();
  const { wallets } = useSolanaWallets();
  const inputRef = useRef(null);
  const walletAddress = user?.wallet?.address;
  const desiredWallet = wallets?.find(
    (wallet) => walletAddress === wallet.address,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [isValid, setIsValid] = useState(null);
  const sendDisabled =
    !desiredWallet || !isValid || !recipientAddress || !sendAmount || isLoading;

  const handleAfterOpenChange = (open) => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleChange = (e) => {
    const input = e.target.value;
    const valid = new RegExp(
      `^(\\d+)?(\\.\\d{0,${asset?.decimals || 6}})?$`,
    ).test(input);
    if (valid || input === "") {
      setSendAmount(input);
    }
  };

  const handleBlur = () => {
    if (
      sendAmount === "" ||
      isNaN(parseFloat(sendAmount)) ||
      parseFloat(sendAmount) === 0
    ) {
      setSendAmount("");
    }
  };

  const onWithdraw = async () => {
    if (!desiredWallet) return;
    try {
      const transferAmount = +sendAmount;
      const senderWallet = new PublicKey(walletAddress);
      const recipientWallet = new PublicKey(recipientAddress);
      const tokenMintAddress = new PublicKey(asset.swapAddress);

      const transaction = new Transaction();
      if (asset.address === SOL_ADDRESS) {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: senderWallet,
            toPubkey: recipientWallet,
            lamports: Math.floor(LAMPORTS_PER_SOL * transferAmount),
          }),
        );
      } else {
        const senderTokenAccount = await getAssociatedTokenAddressSync(
          tokenMintAddress,
          senderWallet,
        );
        if (!senderTokenAccount) {
          console.log("Not found token in sender's wallet.");
          return;
        }
        const recipientTokenAccount = await getAssociatedTokenAddressSync(
          tokenMintAddress,
          recipientWallet,
        );
        const recipientAccountInfo = await connection.getAccountInfo(
          recipientTokenAccount,
        );
        if (!recipientAccountInfo) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              senderWallet,
              recipientTokenAccount,
              recipientWallet,
              tokenMintAddress,
            ),
          );
        }
        const transferTokenAmount = transferAmount * 10 ** asset.decimals;
        transaction.add(
          createTransferInstruction(
            senderTokenAccount,
            recipientTokenAccount,
            senderWallet,
            transferTokenAmount,
          ),
        );
      }

      const randomTipAccount = await jitoClient.getRandomTipAccount();
      const jitoTipAccount = new PublicKey(randomTipAccount);
      const jitoTipAmount = TIP * LAMPORTS_PER_SOL;
      const priorityFee = PRIORITY_FEE * LAMPORTS_PER_SOL;

      transaction.add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: priorityFee,
        }),
      );

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: senderWallet,
          toPubkey: jitoTipAccount,
          lamports: jitoTipAmount,
        }),
      );
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.feePayer = senderWallet;
      const signedTransaction =
        await desiredWallet.signTransaction(transaction);

      const serializedTransaction = signedTransaction.serialize();
      const base58Transaction = bs58.encode(serializedTransaction);

      const result = await jitoClient.sendTxn([base58Transaction], false);

      const signature = result.result;
      api.success({
        message: "Transaction confirmed",
        description: (
          <a href={`https://solscan.io/tx/${signature}`} target={"_blank"}>
            View Transaction
          </a>
        ),
        placement: "bottomRight",
      });
      return `https://solscan.io/tx/${signature}`;
    } catch (error) {
      console.error("Error sending or confirming transaction:", error);
      api.error({
        message: "Transaction failed",
        description: <div>Please try again</div>,
        placement: "bottomRight",
      });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(recipientAddress);
    }, 500);
    return () => clearTimeout(handler);
  }, [recipientAddress]);

  useEffect(() => {
    if (!debouncedInput) {
      setIsValid(null);
    } else {
      try {
        new PublicKey(debouncedInput);
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    }
  }, [debouncedInput]);
  if (!asset) return null;
  return (
    <div>
      {contextHolder}
      <StyledModal
        title={
          <div className={"relative text-center w-full"}>
            <BackButton
              className={
                "absolute top-[-4px] left-[-4px] p-[6px] cursor-pointer"
              }
              onClick={onBack}
            >
              <BackIcon />
            </BackButton>
            Send Token
          </div>
        }
        open={isOpen}
        width={330}
        onCancel={() => setIsOpen(false)}
        footer={null}
        maskClosable={false}
        closeIcon={<CloseIcon />}
        afterOpenChange={handleAfterOpenChange}
      >
        <div className={"flex flex-col items-center mt-[16px]"}>
          <div
            className={
              "flex flex-row items-center justify-center gap-[10px] mt-[8px] mb-[20px]"
            }
          >
            <TokenLogo20 imageHref={asset.logoURI} />
            <div
              className={
                "flex flex-row font-[400] text-[14px] leading-[18px] gap-[4px]"
              }
            >
              <div className={"text-[#F0E9CF]"}>{asset.name}</div>
              <div className={"text-[#F0E9CF7A]"}>{asset.symbol}</div>
            </div>
          </div>
          <input
            ref={inputRef}
            className={
              "border-none bg-transparent outline-none shadow-none text-center text-[#F0E9CF] placeholder-[#F0E9CF3D] font-[400] text-[32px] leading-[36px] tracking-[0.96px] min-w-[100px]"
            }
            style={{ background: "none" }}
            pattern="[0-9]*"
            value={sendAmount}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={"0.00"}
          />
          {balanceMap.get(asset.address) > 0 && (
            <>
              <div
                className={
                  "text-[#F0E9CF7A] font-[400] text-[12px] leading-[16px] mt-[16px] mb-[8px]"
                }
              >
                Available: {balanceMap.get(asset.address)} {asset.symbol}
              </div>
              <div
                className={
                  "flex flex-row items-center text-[#F0E9CF7A] gap-[4px] font-[400] text-[10px] leading-[14px]"
                }
              >
                <Tag
                  onClick={() =>
                    setSendAmount(
                      roundToDecimals(
                        +balanceMap.get(asset?.address) * 0.25,
                        asset?.decimals,
                      ),
                    )
                  }
                >
                  <div>25%</div>
                </Tag>
                <Tag
                  onClick={() =>
                    setSendAmount(
                      roundToDecimals(
                        +balanceMap.get(asset.address) * 0.5,
                        asset.decimals,
                      ),
                    )
                  }
                >
                  <div>50%</div>
                </Tag>
                <Tag
                  onClick={() =>
                    setSendAmount(
                      roundToDecimals(
                        +balanceMap.get(asset.address) * 0.75,
                        asset.decimals,
                      ),
                    )
                  }
                >
                  <div>75%</div>
                </Tag>
                <Tag
                  className={"w-[42px]"}
                  onClick={() =>
                    setSendAmount(
                      roundToDecimals(
                        +balanceMap.get(asset.address),
                        asset.decimals,
                      ),
                    )
                  }
                >
                  <div>100%</div>
                </Tag>
              </div>
            </>
          )}
          <div
            className={
              "py-[16px] my-[16px] w-full border border-y-[2px] border-x-0 border-[#F0E9CF14]"
            }
          >
            <PixelBorderBox color={"F0E9CF1A"}>
              <TextArea
                rootClassName={
                  "border-none bg-transparent outline-none shadow-none"
                }
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Recipient's Solana address"
                autoSize={{ minRows: 1, maxRows: 2 }}
              />
            </PixelBorderBox>
          </div>
          {isValid === false && (
            <div
              className={
                "flex flex-row w-full text-[#FF6200] text-[12px] leading-[16px] gap-[4px] mb-[16px]"
              }
            >
              <WarningIcon />
              Invalid Solana Wallet
            </div>
          )}
        </div>
        <PixelBorderBox
          as={"button"}
          color={sendDisabled ? "F0E9CF0A" : "F1C315"}
          hoverColor={sendDisabled ? "" : "F0D469"}
          className={`${sendDisabled ? "text-[#F0E9CF3D]" : "text-[#100D08E5]"} py-[3px] px-[7px] relative h-[48px] box-border font-[400] text-[20px] leading-[24px] w-full`}
          onClick={() => {
            setIsLoading(true);
            onWithdraw().finally(() => setIsLoading(false));
          }}
          disabled={sendDisabled}
        >
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
          >
            {isLoading || !desiredWallet ? "Loading" : "Send"}
          </div>
        </PixelBorderBox>
      </StyledModal>
    </div>
  );
};

export default React.memo(SendTokenModal);
