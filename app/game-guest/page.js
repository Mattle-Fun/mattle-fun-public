"use client";

import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import Loading from "@/app/loading";
import { getBoostStats } from "./server";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const [isPortrait, setIsPortrait] = useState(false);

  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "/build/Build/build.loader.js",
    dataUrl: "/build/Build/build.data.br",
    frameworkUrl: "/build/Build/build.framework.js.br",
    codeUrl: "/build/Build/build.wasm.br",
    streamingAssetsUrl: "/build/StreamingAssets",
  });

  const { data: boostingData, isFetching: loadingBoost } = useQuery({
    queryKey: ["calcBoosting-guest"],
    queryFn: () => getBoostStats(),
  });

  useEffect(() => {
    if (isLoaded && boostingData) {
      sendMessage("MainMenu", "BoostingData", boostingData);
    }
  }, [isLoaded, boostingData, sendMessage]);

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
  return (
    <div
      className={`absolute w-screen h-[100dvh] top-0 left-0 ${boostingData ? "z-[9999999]" : ""}`}
    >
      {loadingBoost || !boostingData ? (
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
          ) : null}
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
