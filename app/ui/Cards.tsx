"use client";

import { ReactNode } from "react";

export function TopCard({
  children,
  height,
}: {
  height: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mt-6 rounded-lg overflow-y-auto w-full lg:w-[1024px]  bg-gradient-to-r from-blue-500 to-purple-500 `}
    >
      {children}
    </div>
  );
}
