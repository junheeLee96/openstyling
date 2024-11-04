"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function StartBtn({ loading }: { loading: boolean }) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const buttonClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          replace(`${pathname}?lat=${lat}&lon=${lon}`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    //   const data = await getWeather()
  };
  return (
    <button
      className={`w-full h-[100px] text-white font-semibold text-lg`}
      onClick={buttonClick}
    >
      {loading ? "loading..." : "START"}
    </button>
  );
}
