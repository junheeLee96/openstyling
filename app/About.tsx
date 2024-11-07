import Container from "./ui/Container";

export default function About() {
  return (
    <Container>
      <main className="w-full   text-gray-900 ">
        <div className="w-full flex flex-col items-center">
          <h1 className="font-bold text-3xl mb-4">
            오픈스타일링은 이럴 때 유용해요.
          </h1>
          <div className="w-full max-w-[800px] mt-5 ">
            <ul className="font-bold">
              <li className="text-gray-900 mb-6 ">
                <div className="mb-2">😥 내일의 날씨를 모르겠어요... </div>
                <div>
                  👉 걱정하지 마세요. 현재부터 앞으로의 24시간 날씨를 알려줘요.
                </div>
              </li>
              <li className="mb-6">
                <div className="mb-2">
                  😥 상황과 시간에 맞는 옷차림이(TPO) 고민돼요...{" "}
                </div>
                <div>
                  👉 오픈 스타일링은 시간 별 날씨와 온도, 상황에 맞는 옷차림
                  또한 추천해줘요.
                </div>
              </li>
              <li className="mb-6">
                <div className="mb-2">😥 추천해준 옷이 저에게는 없어요...</div>
                <div>👉 해당 옷의 쇼핑몰도 추천해주니 걱정 마세요.</div>
              </li>
              <li></li>
            </ul>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          오픈 스타일링은 GPT를 활용하여 서비스를 제공합니다. 개발자의 GPT크레딧
          소진 시, 안될 수 있어요.
        </div>
      </main>
    </Container>
  );
}
