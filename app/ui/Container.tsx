import { ReactNode } from "react";
import { notoSansKR } from "./fonts";
import Research from "./card/Research";

export default function Container({
  children,
  bg,
}: {
  children: React.ReactNode;
  bg: string;
}) {
  return (
    <div
      className={`${notoSansKR.className} ${bg} mt-6 p-4 rounded-lg w-full lg:w-[1024px] min-h-[90px] `}
    >
      {children}
    </div>
  );
}
