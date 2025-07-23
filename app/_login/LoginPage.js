"use client";
import LoginButton from "@/app/_components/LoginButton";
import React from "react";

export function SubLogin({ description }) {
  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <div
        className={
          "text-[#F0E9CF] text-[22px] leading-[26px] mt-[4px] mb-[24px]"
        }
      >
        {description || "Please login to continue"}
      </div>
      <LoginButton />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={"w-full h-full"}>
      <div className={"flex items-center flex-col pt-[80px] "}>
        <div
          className={
            "text-[24px] md:text-[32px] font-normal leading-[28px] md:leading-[36px] text-[#F0E9CF7A] mb-[12px]"
          }
        >
          Welcome to
        </div>
        <div
          className={
            "text-[#F1C315] text-[40px] md:text-[100px]  leading-css-normal"
          }
        >
          Mattle.fun
        </div>
        <div
          className={
            "text-[#F0E9CF] text-[18px] md:text-[20px] leading-[24px] mt-[4px] mb-[24px]"
          }
        >
          Trade smarter, survive longer!
        </div>
        <LoginButton color={"BC88FF"} hoverColor={"C9A0FF"} />
      </div>
    </div>
  );
}
