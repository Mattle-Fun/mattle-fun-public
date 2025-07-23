"use client";
import React, { useEffect, useState } from "react";
import { Typography, Select, Button, Card, Avatar, InputNumber } from "antd";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from '@privy-io/react-auth/solana';

const JupiterForm = () => {
  const [tokenMap, setTokenMap] = useState(new Map());
  const [inputToken, setInputToken] = useState(null);
  const [outputToken, setOutputToken] = useState(null);
  const [orderResponse, setOrderResponse] = useState(null);
  const [excecuteResponse, setExcecuteResponse] = useState("");
  const [swapAmount, setSwapAmount] = useState(0);
  const [slippage, setSlippage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const divideStrings = (str, num) => {
    const num1 = parseInt(str, 10);
    const result = num1 / 10 ** num;
    return result.toString();
  };

  const { user } = usePrivy();
  const { wallets } = useSolanaWallets()
  const desiredWallet = wallets.find((wallet) => user.wallet.address === wallet.address);

  useEffect(() => {
    fetch(`https://fe-api.jup.ag/api/v1/tokens/search?query=${searchQuery}`)
      .then((res) => res.json())
      .then((res) => {
        const tokens = res.tokens;
        setTokenMap(
          tokens.reduce((map, item) => {
            map.set(item.address, item);
            return map;
          }, new Map()),
        );
      });
  }, [setTokenMap, searchQuery]);

  useEffect(() => {
    if (inputToken && outputToken && swapAmount > 0 && desiredWallet) {
      const amount = swapAmount * 10 ** inputToken.decimals;
      fetch(
        `https://lite-api.jup.ag/ultra/v1/order?inputMint=${inputToken.address}&outputMint=${outputToken.address}&amount=${amount}&taker=${desiredWallet.address}`,
      )
        .then((res) => res.json())
        .then((res) => {
          setOrderResponse(res);
        });
    }
  }, [inputToken, outputToken, swapAmount]);

  const onSendTransaction = async () => {
    if (!orderResponse) return
    try {
      setExcecuteResponse("")
      const transactionBase64 = orderResponse.transaction
      const transaction = VersionedTransaction.deserialize(Buffer.from(transactionBase64, 'base64'));
      const sign = await desiredWallet.signTransaction(transaction)
      if (sign) {
        const signedTransaction = Buffer.from(sign.serialize()).toString('base64');
        const executeResponse = await (
          await fetch('https://lite-api.jup.ag/ultra/v1/execute', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  signedTransaction: signedTransaction,
                  requestId: orderResponse.requestId,
              }),
          })
        ).json();
        if (executeResponse.error) {
          throw new Error(executeResponse.error);
        }
        setExcecuteResponse(`https://solscan.io/tx/${executeResponse.signature}`)
      }
    } catch (error) {
      setExcecuteResponse("Transaction failed")
      console.log(error)
    }
  }

  return (
    <Card style={{ width: "fit-content" }}>
      <h1>Swap</h1>
      <div className="mb-2">
        <label htmlFor="inputMint" className="block text-sm font-medium">
          Input token
        </label>
        <Select
          showSearch
          onSearch={(value) => {
            setSearchQuery(value);
          }}
          style={{ width: 400 }}
          onChange={(key) => {
            const value = tokenMap.get(key);
            setInputToken(value);
          }}
          optionLabelProp="label"
        >
          {[...tokenMap].map(([key, value]) => (
            <Select.Option key={key} value={key} label={value.symbol}>
              <Card
                style={{
                  width: 350,
                  background: "#0d1117",
                  borderRadius: 10,
                  color: "white",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar src={value.icon} size={40} />
                  <div style={{ flex: 1 }}>
                    <Typography style={{ color: "white" }}>
                      {value.symbol}
                    </Typography>
                    <Typography style={{ color: "#8b949e" }}>
                      {value.name}
                    </Typography>
                    <a
                      href={'https://solscan.io/token/'+value.address}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#58a6ff" }}
                    >
                      {`${value.address.slice(0, 3)}...${value.address.slice(-3)}`}
                    </a>
                  </div>
                </div>
              </Card>
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="mb-2">
        <label htmlFor="outputMint" className="block text-sm font-medium">
          Output token
        </label>
        <Select
          showSearch
          onSearch={(value) => {
            setSearchQuery(value);
          }}
          style={{ width: 400 }}
          onChange={(key) => {
            const value = tokenMap.get(key);
            setOutputToken(value);
          }}
          optionLabelProp="label"
        >
          {[...tokenMap].map(([key, value]) => (
            <Select.Option key={key} value={key} label={value.symbol}>
              <Card
                style={{
                  width: 350,
                  background: "#0d1117",
                  borderRadius: 10,
                  color: "white",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar src={value.icon} size={40} />
                  <div style={{ flex: 1 }}>
                    <Typography style={{ color: "white" }}>
                      {value.symbol}
                    </Typography>
                    <Typography style={{ color: "#8b949e" }}>
                      {value.name}
                    </Typography>
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#58a6ff" }}
                    >
                      {`${value.address.slice(0, 3)}...${value.address.slice(-3)}`}
                    </a>
                  </div>
                </div>
              </Card>
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Amount</label>
        <InputNumber
          value={swapAmount}
          onChange={(value) => setSwapAmount(value || 0)}
          style={{ width: 100 }}
        />
        {/* <label className="block text-sm font-medium">
          Slippage
        </label>
        <InputNumber
          value={slippage}
          onChange={(value) => setSlippage(value || 0)}
          style={{ width: 100 }}
        /> */}
      </div>
      {orderResponse &&
        (() => {
          return (
            <div>
              <p>
                Rate:{" "}
                {`${divideStrings(orderResponse.inAmount, Number(inputToken?.decimals))} ${inputToken?.symbol} ~ ${divideStrings(orderResponse.outAmount, Number(outputToken?.decimals))} ${outputToken?.symbol}`}
              </p>
              <p>
                Price Impact:{" "}
                {orderResponse.priceImpactPct < "0.01"
                  ? "< 1%"
                  : orderResponse.priceImpactPct}
              </p>
              <p>
                Minimum Receiver:{" "}
                {divideStrings(
                  orderResponse.otherAmountThreshold,
                  Number(outputToken?.decimals),
                )}
              </p>
            </div>
          );
        })()}

      {excecuteResponse !== "" && (
        <p>
          <a href={excecuteResponse}>{excecuteResponse}</a>
        </p>
      )}
      <Button onClick={onSendTransaction}>Swap</Button>
    </Card>
  );
};

export default JupiterForm;
