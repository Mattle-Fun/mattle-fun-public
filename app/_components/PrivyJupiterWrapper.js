"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

export default function PrivyJupiterWrapper({ children }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          accentColor: "#f1c324",
          theme: "#1d1b15",
          walletChainType: "solana-only",
          walletList: ["phantom", "solflare", "okx_wallet"], // ["backpack", "detected_solana_wallets"]
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
        solanaClusters: [
          { name: "mainnet-beta", rpcUrl: process.env.NEXT_PUBLIC_RPC || "" },
        ],
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        fundingMethodConfig: {
          moonpay: {
            paymentMethod: "credit_debit_card",
            uiConfig: { accentColor: "#696FFD", theme: "light" },
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
