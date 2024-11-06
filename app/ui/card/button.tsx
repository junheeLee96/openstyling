"use client";

import { usePathname, useRouter } from "next/navigation";
import Loading from "../loading";

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

export function SubmitBtn({ loading }: { loading: boolean }) {
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full rounded-md font-medium transition-colors bg-blue-500 text-white  flex justify-center">
          <button
            type="submit"
            className="hover:bg-blue-600 w-full h-full px-4 py-2  rounded-md font-extrabold"
          >
            확인
          </button>
        </div>
      )}
    </>
  );
}
