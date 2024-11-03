import Image from "next/image";
import { getCardData } from "../lib/data";

export default async function Card({ lon, lat }: { lon: number; lat: number }) {
  const data = await getCardData({ lon, lat });
  console.log(data);
  return (
    <div>
      {data && (
        <Image
          alt={data.weather.description}
          src={`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`}
          width={150}
          height={150}
        />
      )}
    </div>
  );
}
