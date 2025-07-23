import "./globals.css";
import localFont from "next/font/local";
import Navbar from "./_components/Navbar";
import ReactQueryProviders from "@/lib/react-query/providers";
import PrivyJupiterWrapper from "@/app/_components/PrivyJupiterWrapper";
import StyledComponentsRegistry from "@/lib/styled-components/registry";
import AuthGuard from "@/app/_components/AuthGuard";
import CSRFProtection from "@/app/_components/CSRFProtection";
import Script from "next/script";

const MSSansSerif = localFont({
  src: "./fonts/MSSansSerifBold.ttf",
  variable: "--font-ms",
  display: "swap",
});

export const metadata = {
  title: "Mattle.fun",
  description:
    "MattleFun is a GameFi platform that blends crypto trading performance with in-game power in a skill-based arena.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Mattle.fun" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta property="og:title" content="MattleFun" />
        <meta
          property="og:description"
          content="MattleFun is a GameFi platform that blends crypto trading performance with in-game power in a skill-based arena."
        />
        <meta
          property="og:image"
          content="https://mattle.fun/images/android-chrome-512x512.png"
        />
        <meta property="og:url" content="https://mattle.fun/" />
        <meta property="og:type" content="website" />

        <link
          rel="apple-touch-icon"
          href="/images/android-chrome-512x512.png"
        />
      </head>
      <body
        className={`${MSSansSerif.variable} bg-black text-white h-[100dvh]`}
      >
        <StyledComponentsRegistry>
          <ReactQueryProviders>
            <PrivyJupiterWrapper>
              <CSRFProtection>
                <AuthGuard>
                  <Navbar />
                  <div className="w-screen h-[100dvh] pt-[var(--navbar-total-height)] box-border flex justify-center overflow-y-auto">
                    <div className={"max-w-[1440px] box-border w-full"}>
                      {children}
                    </div>
                  </div>
                </AuthGuard>
              </CSRFProtection>
            </PrivyJupiterWrapper>
          </ReactQueryProviders>
          <div id="pixel-background-id" className={"h-[100dvh]"} />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
