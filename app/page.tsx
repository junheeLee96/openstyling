import { StartBtn } from "./ui/card/button";

import { lusitana } from "./ui/fonts";
import Research from "./ui/card/Research";
import Container from "./ui/Container";
import Style from "./ui/styles/Style";

const weatherGradients = {
  morn: "from-blue-400 to-yellow-200",
  eve: "from-gray-400 to-gray-200",
  night: "from-blue-700 to-gray-400",
};

{
  /* <Research />; */
}

export default async function Home(props: {
  searchParams?: Promise<{
    start: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const start = searchParams?.start;

  return (
    <div
      className={`min-w-screen min-h-screen bg-gradient-to-b ${weatherGradients.morn} p-8 flex items-center flex-col `}
    >
      <header
        className={`${lusitana.className} text-2xl lg:text-4xl text-rose-50 font-bold `}
      >
        내일의 스타일을 추천해줘요.
      </header>
      <Container
        bg={"bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col"}
      >
        {start ? <Research /> : <StartBtn />}
      </Container>

      <Style />
    </div>
  );
}
