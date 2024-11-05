"use server";

import OpenAI from "openai";
import { dataTypes, NaverType, OpenWeatherData } from "./definitions";

const openai = new OpenAI({ apiKey: process.env.OPENAPI_KEY });
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || "";
const NAVER_SCRET = process.env.NAVER_SCRET_KEY || "";
const NAVER_URL = "https://openapi.naver.com/v1/search/shop.json";
const KAKAO_URL = "https://dapi.kakao.com/v2/local/search/address.json";
const KAKAO_KEY = process.env.KAKAO_KEY || "";

const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;

export const getWeather = async ({
  lat,
  lon,
}: {
  lat: string;
  lon: string;
}): Promise<OpenWeatherData | null> => {
  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${process.env.OPENWEATHER_KEY}&lang=en`;
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const callGPTText = async ({
  weatherData,
  sex,
  age,
  purpose,
}: {
  weatherData: OpenWeatherData;
  sex: string;
  age: string;
  purpose: string;
}) => {
  const { summary, temp, feels_like, weather } = weatherData.daily[1];
  const prupose = "외출 목적: 데이트";
  var prompt = `
        오늘의 날씨 상황을 기준으로 소개팅을 위한 옷차림을 추천해 주세요.

        - 기온: 아침 ${kelvinToCelsius(temp.morn)}도 (체감 ${kelvinToCelsius(
    feels_like.morn
  )}도), 낮 ${kelvinToCelsius(temp.day)}도 (체감 ${kelvinToCelsius(
    feels_like.day
  )}도), 저녁 ${kelvinToCelsius(temp.eve)}도 (체감 ${kelvinToCelsius(
    feels_like.eve
  )}도), 밤 ${kelvinToCelsius(temp.night)}도 (체감 ${kelvinToCelsius(
    feels_like.night
  )}도)
        - 하늘 상태: ${summary}
        - 목적: ${prupose}
        - 나이: ${age}
        - 성별: ${sex}
        - 외출 목적: ${purpose}

        추천 내용:
        1. 기온과 하늘 상태에 맞게, 어떤 색상의 옷을 입어야 하는지 설명해 주세요. 왜 그 색이 어울리는지도 알려주세요.
        2. 상의, 하의, 신발, 악세사리 각각의 추천을 해주세요.
        3. 선택한 스타일이 날씨와 어떤 점에서 잘 맞는지 이유를 설명해 주세요.
        4. 가능하다면 아침/낮/저녁의 온도를 고려해 코디해주세요.
        5. 상의,하의,신발,악세사리를 json형식으로 주세요. 예를들어 {"상의":" 낮 기온이 높으므로 가벼운 니트가 적합합니다. 밝은 톤은 맑은 날씨와 잘 어울립니다.","하의":" 낮 기온이 높으므로 가벼운 니트가 적합합니다. 밝은 톤은 맑은 날씨와 잘 어울립니다." ....}
        
        JSON 형식으로 아래와 같이 응답해 주세요:
            {
                "top": {"suggest": "", "reason": ""},
                "bottom": {"suggest": "", "reason": ""},
                "shoes": {"suggest": "", "reason": ""},
                "accessories": {"suggest": "", "reason": ""}
                "tip":{"suggest":"","reason":""}
            }

            JSON형식 외에 필요없는 문자는 빼주세요.
          tip은 추가적으로 레이어드나 "ooo을 하면 더 좋습니다"와 같은 것을 알려주세요. 
      `;

  //   return;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "당신은 옷 스타일링 전문가입니다. 날씨와 상황에 맞게 옷을 추천해주세요.",
      },
      {
        role: "user",
        content: prompt,
      },
      {
        role: "assistant",
        content: `
        - **상의**: 네이비 색의 니트 - 이유: 낮 기온이 높으므로 가벼운 니트가 적합합니다. 밝은 톤은 맑은 날씨와 잘 어울립니다.
        - **하의**: 네이비 컬러의 슬랙스 - 이유: 단정하면서도 소개팅에 어울리는 인상을 줍니다.
        - **신발**: 블랙 또는 브라운의 로퍼 - 이유: 단정한 인상을 주고, 소개팅 자리에서 신뢰감을 줄 수 있습니다.
        - **악세사리**: 실버 시계 - 이유: 가벼운 악세사리가 단정한 인상을 더해줍니다.
      `,
      },
    ],
    max_tokens: 400, // 응답 길이 제한
    temperature: 0.7, // 응답의 다양성 조절
  });
  const content = response.choices[0].message.content;
  if (!content) return null;
  let cleanContent = content.replace(/```json|```/g, "").trim();

  // JSON 파싱 전 특수 문자를 처리
  cleanContent = cleanContent
    .replace(/\\n/g, "") // 개행 문자 제거
    .replace(/\\"/g, '"') // 탈출 문자 제거
    .replace(/\\'/g, "'"); // 단일 인용부호 처리

  try {
    const parsedContent = JSON.parse(cleanContent); // 여기서 한 번만 JSON.parse를 호출
    return parsedContent; // 이미 객체로 변환된 상태를 반환
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
  }
};

const getDalleImage = async (prompt: string): Promise<string> => {
  return "/examples.png";
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: `다음 JSON형태에 맞는 옷을 입은 여자를 그려줘. 이미지는 머리부터 발끝까지 전부 나와야해. ,${prompt}`,
    size: "1024x1024",
    n: 1,
  });
  // return image;
};

const getNaverShoppingURL = async (prompt: any): Promise<NaverType> => {
  console.log("prompt = ", prompt);
  const obj: any = {
    top: null,
    bottom: null,
    shoes: null,
    accessories: null,
  };

  const promiseArray = Object.keys(prompt).map((key) => {
    if (key === "tip") {
      return null;
    }
    return fetch(`${NAVER_URL}?query=${prompt[key].suggest}&display=1`, {
      headers: {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_SCRET,
      },
    }).then((res) => res.json().then((data) => (obj[key] = data)));
  });

  await Promise.all(promiseArray);

  return obj;
};

export const getLocation = async (
  addr: string
): Promise<{ lat: string; lon: string }> => {
  const res = await fetch(`${KAKAO_URL}?query=${addr}`, {
    headers: {
      Authorization: `KakaoAK ${KAKAO_KEY}`,
    },
  });
  const data = await res.json();
  return { lon: data.documents[0].x, lat: data.documents[0].y };
};

export const getCardData = async (
  sex: string,
  area: string,
  purpose: string,
  age: string
): Promise<dataTypes | null> => {
  const { lat, lon } = await getLocation(area);
  const weatherData = await getWeather({ lat, lon });
  if (!weatherData) return null;
  const hourly = weatherData.hourly;
  const { weather } = weatherData.daily[1];

  // const prompt = await callGPTText({ weatherData ,sex,age,purpose});
  const prompt = {
    top: {
      suggest: "네이비 색의 니트",
      reason:
        "낮 기온이 높으므로 가벼운 니트가 적합합니다. 네이비는 세련되면서도 차분한 느낌을 줍니다.",
    },
    bottom: {
      suggest: "네이비 컬러의 슬랙스",
      reason: "단정하면서도 소개팅에 어울리는 인상을 줍니다.",
    },
    shoes: {
      suggest: "블랙 또는 브라운의 로퍼",
      reason: "단정한 인상을 주고, 소개팅 자리에서 신뢰감을 줄 수 있습니다.",
    },
    accessories: {
      suggest: "실버 시계",
      reason: "가벼운 악세사리가 단정한 인상을 더해줍니다.",
    },
    tip: {
      suggest: "아침과 저녁 기온이 낮으니 얇은 트렌치코트를 가져가면 좋습니다.",
      reason:
        "비가 그친 후에도 쌀쌀할 수 있으니 트렌치코트가 보온에 도움이 됩니다.",
    },
  };

  if (!prompt) return null;
  const image = await getDalleImage(JSON.stringify(prompt));
  const productsURL = await getNaverShoppingURL(prompt);

  return {
    image,
    productsURL,
    weather: weatherData,
    // weather: { tomorrow: weather[0], hourly },
    prompt,
  };
};