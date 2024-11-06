"use client";

import React, { useEffect, useRef } from "react";

const Toast = ({ err }: { err: string }) => {
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    ref.current.style.top = `-${rect.height}`;
    console.log(rect.height);
  }, []);
  return (
    <div className="fixed w-[250px]  translate-y-[-100%] top-0 right-10 animate-toast">
      <div className="w-full h-[50px] bg-toastBg rounded-md px-4 py-2 flex items-center">
        <div className="w-[20px] h-[20px] bg-underred rounded-full" />
        <div className="text-white ml-4 mb-1 flex-1 flex justify-center">
          {err}
        </div>
      </div>
      <div className="w-full h-full absolute bottom-[-4px] bg-underred z-[-1] rounded-md"></div>
    </div>
  );
};

export default Toast;
