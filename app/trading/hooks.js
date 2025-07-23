"use client";

import { useEffect, useState } from "react";
import { getPortfolio } from "@/app/dashboard/server";
import { SOL_ADDRESS, WSOL_ADDRESS, REFERRAL_ACCOUNT } from "@/app/constants";
import { getUserListToken } from "@/app/_withdraw/server";
import { useQuery } from "@tanstack/react-query";
import { getBalanceTokens } from "@/app/trading/server";
export const fetchTokenInfo = (query) =>
  fetch(`https://fe-api.jup.ag/api/v1/tokens/search?query=${query}`)
    .then((res) => res.json())
    .then((res) => {
      const token = res.tokens?.[0];
      if (token?.address === WSOL_ADDRESS) {
        token.name = "Solana";
        token.address = SOL_ADDRESS;
        token.swapAddress = WSOL_ADDRESS;
      } else if (token) {
        token.swapAddress = token.address;
      }
      return token;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
export const useTokenMap = (input) => {
  const [tokenMap, setTokenMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchQuery(input);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [input]);
  useEffect(() => {
    setIsLoading(true);
    fetch(`https://fe-api.jup.ag/api/v1/tokens/search?query=${searchQuery}`)
      .then((res) => res.json())
      .then((res) => {
        const tokens = res.tokens;
        setTokenMap(
          tokens.reduce((map, item) => {
            if (item.address === WSOL_ADDRESS) {
              item.name = "Solana";
              item.address = SOL_ADDRESS;
              item.swapAddress = WSOL_ADDRESS;
            } else {
              item.swapAddress = item.address;
            }
            map.set(item.address, item);
            return map;
          }, new Map()),
        );
      })
      .finally(() => setIsLoading(false));
  }, [searchQuery]);
  return [tokenMap, isLoading];
};
export const useMyTokenList = (walletAddress, input) => {
  const [allTokenList, setAllTokenList] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchQuery(input);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [input]);
  useEffect(() => {
    if (walletAddress) {
      setIsLoading(true);
      getUserListToken(walletAddress)
        .then(setAllTokenList)
        .finally(() => setIsLoading(false));
    }
  }, [walletAddress]);
  useEffect(() => {
    if (!searchQuery) {
      setTokenList(allTokenList);
    } else {
      const keyword = searchQuery.toLowerCase();
      setTokenList(
        allTokenList?.filter(
          (item) =>
            item.name.toLowerCase().includes(keyword) ||
            item.symbol.toLowerCase().includes(keyword) ||
            item.swapAddress === keyword,
        ),
      );
    }
  }, [allTokenList, searchQuery]);
  return [tokenList, isLoading];
};

export const useBalanceMap = (walletAddress) => {
  const [balanceMap, setBalanceMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (walletAddress) {
      setIsLoading(true);
      getPortfolio(walletAddress)
        .then((res) => {
          const map = new Map(
            Object.entries(res.portfolio).map(([key, value]) => [
              key,
              value?.balance,
            ]),
          );
          setBalanceMap(map);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [walletAddress]);
  return [balanceMap, isLoading];
};

export const useOnChainBalanceMap = (walletAddress) => {
  const { data, isFetching } = useQuery({
    queryKey: ["get-balance-tokens", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      const list = await getBalanceTokens(walletAddress);
      return new Map(list.map((i) => [i.mintAddress, i.balance]));
    },
    refetchInterval: 4000,
  });
  const map = typeof data === "object" ? data : new Map();
  return [map, isFetching];
};

export const useOrderResponse = (
  walletAddress,
  inputAddress,
  outputAddress,
  inputDecimals,
  swapAmount,
) => {
  const [orderResponse, setOrderResponse] = useState();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchOrder = async () => {
      if (
        inputAddress &&
        outputAddress &&
        inputDecimals &&
        walletAddress &&
        swapAmount > 0
      ) {
        setIsLoading(true);
        const amount = swapAmount * 10 ** inputDecimals;
        await fetch(
          `https://lite-api.jup.ag/ultra/v1/order?inputMint=${inputAddress}&outputMint=${outputAddress}&amount=${amount}&taker=${walletAddress}&referralAccount=${REFERRAL_ACCOUNT}&referralFee=100`,
        )
          .then((res) => res.json())
          .then((res) => {
            setOrderResponse(res);
          })
          .finally(() => setIsLoading(false));
      } else {
        setOrderResponse(undefined);
      }
    };
    fetchOrder().then(() => console.log("Fetch order response!!"));
    const interval = setInterval(fetchOrder, 4000);
    return () => clearInterval(interval);
  }, [walletAddress, inputAddress, outputAddress, inputDecimals, swapAmount]);
  return [orderResponse, isLoading];
};
