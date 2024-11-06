"use client";

import React, { useEffect } from "react";

const Toast = ({ err }: { err: string }) => {
  return (
    <div className="fixed w-[250px] animate-toast top-[-0px] right-10 ">
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
