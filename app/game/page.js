"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { usePrivy } from "@privy-io/react-auth";
import Loading from "@/app/loading";
import { getBoostStats, playGame, saveScore } from "./server";
import { getClientHeaders } from "@/app/helpers";
import LoginPage from "@/app/_login/LoginPage";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { user, ready, authenticated, logout } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const [gameSessionId, setGameSessionId] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [hasSentMessage, setHasSentMessage] = useState(false);

  const {
    unityProvider,
    sendMessage,
    isLoaded,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "/build/Build/build.loader.js",
    dataUrl: "/build/Build/build.data.br",
    frameworkUrl: "/build/Build/build.framework.js.br",
    codeUrl: "/build/Build/build.wasm.br",
    streamingAssetsUrl: "/build/StreamingAssets",
  });

  const { data: boostingData, isFetching: loadingBoost } = useQuery({
    queryKey: ["calcBoosting", walletAddress],
    enabled: !!walletAddress,
    queryFn: () => getBoostStats(walletAddress, getClientHeaders()),
  });

  useEffect(() => {
    return () => {
      setIsGameActive(false);
      setGameSessionId(null);
    };
  }, []);

  const handlePlayGame = useCallback(
    async (playGameData) => {
      try {
        const sessionId = `${walletAddress}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await playGame(walletAddress, playGameData, sessionId, getClientHeaders());

        setIsGameActive(true);
        setGameSessionId(sessionId);

      } catch (error) {
        messageApi.open({
          type: "error",
          content: error.message,
        });
      }
    },
    [walletAddress, messageApi],
  );

  const handleGameOver = useCallback(
    async (gameOverData) => {
      if (!isGameActive || !gameSessionId) {
        console.warn("Game over called without active game session");
        return;
      }

      try {
        const maxRetries = 3;
        let retries = 0;
        while (retries < maxRetries) {
          try {
            await saveScore(
              walletAddress,
              gameOverData,
              gameSessionId,
              getClientHeaders(),
              retries
            );

            setIsGameActive(false);
            setGameSessionId(null);

            return;
          } catch (error) {
            retries++;
          }
        }
      } catch (error) {
      }
    },
    [walletAddress, isGameActive, gameSessionId],
  );

  useEffect(() => {
    const waitForCanvas = setInterval(() => {
      const canvas = document.getElementById("react-unity-webgl-canvas-1");
      if (isLoaded && boostingData && canvas && !hasSentMessage) {
        sendMessage("MainMenu", "BoostingData", boostingData);
        setHasSentMessage(true);
        clearInterval(waitForCanvas);
      }
    }, 100);

    addEventListener("ReactPlayGame", handlePlayGame);
    addEventListener("ReactGameOver", handleGameOver);
    return () => {
      removeEventListener("ReactPlayGame", handlePlayGame);
      removeEventListener("ReactGameOver", handleGameOver);
    };
  }, [
    isLoaded,
    boostingData,
    addEventListener,
    removeEventListener,
    sendMessage,
    handleGameOver,
    handlePlayGame,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (authenticated && !walletAddress) {
        messageApi.open({
          type: "error",
          content: "Can not get wallet address, please login again",
        });
        localStorage.clear();
        logout();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [walletAddress, messageApi, logout, authenticated]);

  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const portrait = height > width;
      setIsPortrait(portrait);
    };
    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  const enterFullScreen = (event) => {
    console.log("enterFullScreen");
    const el = event.currentTarget;
    if (el) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      }
    }
  };

  // Setup console protection
  useEffect(() => {
    const cleanup = setupConsoleProtection();

    return cleanup;
  }, []);

  return (
    <div
      id="game-container"
      className={`absolute w-screen h-[100dvh] top-0 left-0 ${authenticated ? "z-[9999999]" : ""}`}
    >
      {contextHolder}
      {loadingBoost || !ready ? (
        <Loading />
      ) : !authenticated ? (
        <LoginPage />
      ) : !walletAddress ? (
        <Loading />
      ) : (
        <div
          className="relative flex h-full justify-center"
          onTouchStart={enterFullScreen}
        >
          {isPortrait ? (
            <div
              className={
                "size-full absolute top-0 left-0 flex items-center justify-center p-[20px] box-border text-center"
              }
            >
              Please turn your device to landscape mode to play.
            </div>
          ) : (
            !isLoaded && (
              <div className={"size-full absolute top-0 left-0"}>
                <Loading />
              </div>
            )
          )}
          <Unity
            unityProvider={unityProvider}
            className="size-full"
            style={{
              visibility: isLoaded && !isPortrait ? "visible" : "hidden",
            }}
          />
        </div>
      )}
    </div>
  );
}
