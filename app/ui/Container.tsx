import { ReactNode } from "react";
import { notoSansKR } from "./fonts";
import Research from "./card/Research";

export default function Container({
  children,
  bg = "bg-white",
}: {
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <div
      className={`${notoSansKR.className} ${bg} mt-6 p-4 rounded-lg w-full  min-h-[90px] `}
    >
      {children}
    </div>
  );
}
