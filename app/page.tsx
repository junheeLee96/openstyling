import { StartBtn } from "./ui/button";
import Card from "./ui/Card";

export default async function Home(props: {
  searchParams?: Promise<{
    lat?: string;
    lon?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const lon = searchParams?.lon;
  const lat = searchParams?.lat;

  return (
    <div>
      {lat && lon ? (
        <Card lon={parseFloat(lon)} lat={parseFloat(lat)} />
      ) : (
        <StartBtn />
      )}
    </div>
  );
}
