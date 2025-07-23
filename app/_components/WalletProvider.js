"use client";
import { useMemo } from "react";
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter,
} from "@solana-mobile/wallet-adapter-mobile";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

const addressSelector = createDefaultAddressSelector();
const authorizationResultCache = createDefaultAuthorizationResultCache();
const walletNotFoundHandler = createDefaultWalletNotFoundHandler();

export default function WalletProviderWrapper({ children }) {
  const wallets = useMemo(
    () => [
      new SolanaMobileWalletAdapter({
        addressSelector,
        appIdentity: {
          name: "Mattle.fun",
          uri: "https://mattle.fun/",
          icon: "https://mattle.fun/images/apple-touch-icon.png",
        },
        authorizationResultCache,
        cluster: WalletAdapterNetwork.Mainnet,
        onWalletNotFound: walletNotFoundHandler,
        walletName: "Phantom",
      }),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={clusterApiUrl(WalletAdapterNetwork.Mainnet)}>
      <WalletProvider wallets={wallets}>{children}</WalletProvider>
    </ConnectionProvider>
  );
}
