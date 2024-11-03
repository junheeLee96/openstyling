"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function StartBtn() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const buttonClick = () => {
    if (navigator.geolocation) {
      console.log("start");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("zzz");

          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          replace(`${pathname}?lat=${lat}&lon=${lon}`);
          //   const data = await getWeather({ lat, lon });
          //   if (!data) return;
          //   const tomorrow = data.daily[1];

          //   console.log(data);
          //   console.log(data.daily.map((d) => new Date(d.dt * 1000)));
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
  return <button onClick={buttonClick}>Start</button>;
}
