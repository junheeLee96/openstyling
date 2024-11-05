"use client";

import { usePathname, useRouter } from "next/navigation";

export function StartBtn() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const buttonClick = () => {
    replace(`${pathname}?start=true`);
  };
  return (
    <button
      className={`w-full h-[100px] text-white font-semibold text-lg`}
      onClick={buttonClick}
    >
      START
    </button>
  );
}

export function SubmitBtn() {
  return (
    <button
      type="submit"
      className="px-4 py-2  rounded-md font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600"
    >
      확인
    </button>
  );
}
