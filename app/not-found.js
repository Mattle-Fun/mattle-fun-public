import Link from "next/link";
import PixelBorderBox from "@/app/_components/PixelBorderBox";

export default function NotFound() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className={"text-[#FF6200] text-[100px] leading-css-normal"}>
        404
      </div>
      <div
        className={
          "text-[#F0E9CF] text-[20px] leading-[24px] mt-[4px] mb-[24px]"
        }
      >
        Page not found
      </div>
      <PixelBorderBox
        as={"a"}
        href={"/"}
        color={"F1C315"}
        hoverColor={"F0D469"}
        className={"px-[4px] text-[#100D08E5]"}
      >
        <div className={"my-[-4px]"}>Go Home</div>
      </PixelBorderBox>
    </div>
  );
}
