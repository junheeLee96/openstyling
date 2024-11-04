import { Suspense } from "react";
import { getCardData } from "./lib/data";
import { StartBtn } from "./ui/button";
import { TopCard } from "./ui/Cards";
import { lusitana } from "./ui/fonts";
import Graph from "./ui/Graph";

const weatherGradients = {
  morn: "from-blue-400 to-yellow-200",
  eve: "from-gray-400 to-gray-200",
  night: "from-blue-700 to-gray-400",
};

export default async function Home(props: {
  searchParams?: Promise<{
    lat?: string;
    lon?: string;
  }>;
}) {
  let loading = false;
  let data = null;
  const searchParams = await props.searchParams;
  const lon = searchParams?.lon,
    lat = searchParams?.lat;

  if (lon && lat) {
    loading = true;
    data = data = await getCardData({
      lon: parseFloat(lon),
      lat: parseFloat(lat),
    });
    loading = false;
    console.log(data);
  }
  return (
    <div
      className={`w-screen h-screen bg-gradient-to-b ${weatherGradients.morn} p-8 flex items-center flex-col`}
    >
      <h1
        className={`${lusitana.className} text-2xl lg:text-4xl text-rose-50 font-bold `}
      >
        내일의 스타일을 추천해줘요.
      </h1>
      <TopCard height={data ? "500px" : "80px"}>
        {data ? (
          <Graph hourly={data.weather.hourly} />
        ) : (
          <StartBtn loading={loading} />
        )}
      </TopCard>
    </div>
  );
}
