"use server";

import OpenAI from "openai";
import { dataTypes, NaverType, OpenWeatherData } from "./definitions";
import { headers } from "next/headers";
import { getRedisClient } from "./redis";

type errorType = {
  message: string;
};

const openai = new OpenAI({ apiKey: process.env.OPENAPI_KEY });
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || "";
const NAVER_SCRET = process.env.NAVER_SCRET_KEY || "";
const NAVER_URL = "https://openapi.naver.com/v1/search/shop.json";
const KAKAO_URL = "https://dapi.kakao.com/v2/local/search/address.json";
const KAKAO_KEY = process.env.KAKAO_KEY || "";

const DAILY_LIMIT = 3;

const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;

export const getWeather = async ({
  lat,
  lon,
}: {
  lat: string;
  lon: string;
}) => {
  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${process.env.OPENWEATHER_KEY}&lang=en`;
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (e) {
    return { message: "날씨 정보를 불러오는 중 오류가 발생했습니다." };
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
  // const prupose = "외출 목적: 데이트";
  var prompt = `
        오늘의 날씨 상황을 기준으로 나이, 외출 목적, 성별에 맞는 옷차림을 추천해 주세요. 현재 계절에 맞는 컬러를 조합해주세요. 

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
        - 목적: ${purpose}
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

  try {
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
    if (!response.choices[0].message.content)
      return { message: "크레딧이 부족합니다." };
    const content = response.choices[0].message.content;
    if (!content) return { message: "알 수 없는 오류가 발생했습니다." };
    let cleanContent = content.replace(/```json|```/g, "").trim();

    // JSON 파싱 전 특수 문자를 처리
    cleanContent = cleanContent
      .replace(/\\n/g, "") // 개행 문자 제거
      .replace(/\\"/g, '"') // 탈출 문자 제거
      .replace(/\\'/g, "'"); // 단일 인용부호 처리

    const parsedContent = JSON.parse(cleanContent); // 여기서 한 번만 JSON.parse를 호출
    return parsedContent; // 이미 객체로 변환된 상태를 반환
  } catch (e) {
    return { message: "토큰이 모두 소진되었습니다." };
  }
};

const getDalleImage = async (
  prompt: string,
  sex: string,
  age: string
): Promise<
  { img: string; message?: undefined } | { img?: undefined; message: string }
> => {
  try {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: `다음 JSON형태에 맞는 옷을 입은 나이대${age}인 ${sex}를 그려줘. 이미지는 머리부터 발끝까지 전부 나와야해. ,${prompt}`,
      size: "1024x1024",
      n: 1,
    });
    if (image.data[0].url) return { img: image.data[0].url };
    return { message: "크레딧이 부족합니다." };
  } catch (e) {
    console.error("DALL-E 이미지 생성 오류:", e);
    return { message: "이미지 생성 중 오류가 발생했습니다." };
  }
};

const getNaverShoppingURL = async (prompt: any) => {
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

  try {
    await Promise.all(promiseArray);

    return obj;
  } catch (e) {
    return { message: "쇼핑 정보를 불러오는 중 오류가 발생했습니다." };
  }
};

export const getLocation = async (addr: string) => {
  try {
    const res = await fetch(`${KAKAO_URL}?query=${addr}`, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_KEY}`,
      },
    });

    const data = await res.json();
    return { lon: data.documents[0].x, lat: data.documents[0].y };
  } catch (e) {
    return { message: "위치 정보를 불러오는 중 오류가 발생했습니다." };
  }
};

export const generateData = async (
  sex: string,
  area: string,
  purpose: string,
  age: string
) => {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for");
  console.log(ip, typeof ip);
  if (!ip) return;
  console.log("start");

  const redis = getRedisClient();
  if (ip !== process.env.MY_IP && ip !== process.env.LOCAL_IP) {
    try {
      const calls = await redis.get(ip);
      const callCount = calls ? parseInt(calls, 10) : 0;
      if (callCount >= DAILY_LIMIT) {
        return { message: "생성이 제한되었습니다.(카운트 초과)" };
      }

      await redis
        .multi()
        .incr(ip)
        .expire(ip, 24 * 60 * 60)
        .exec();
    } catch (e) {
      return { message: "오류가 발생했습니다." };
    }
  }
  const location = await getLocation(area);
  if (location.message) return location.message;
  const { lon, lat } = location;

  const weatherData = await getWeather({
    lat,
    lon,
  });
  if (weatherData.message) return weatherData.message;
  const prompt = await callGPTText({ weatherData, sex, age, purpose });
  if (prompt.message) return prompt.message;
  // const prompt = {
  //   top: {
  //     suggest: "네이비 색의 니트",
  //     reason:
  //       "낮 기온이 높으므로 가벼운 니트가 적합합니다. 네이비는 세련되면서도 차분한 느낌을 줍니다.",
  //   },
  //   bottom: {
  //     suggest: "네이비 컬러의 슬랙스",
  //     reason: "단정하면서도 소개팅에 어울리는 인상을 줍니다.",
  //   },
  //   shoes: {
  //     suggest: "블랙 또는 브라운의 로퍼",
  //     reason: "단정한 인상을 주고, 소개팅 자리에서 신뢰감을 줄 수 있습니다.",
  //   },
  //   accessories: {
  //     suggest: "실버 시계",
  //     reason: "가벼운 악세사리가 단정한 인상을 더해줍니다.",
  //   },
  //   tip: {
  //     suggest: "아침과 저녁 기온이 낮으니 얇은 트렌치코트를 가져가면 좋습니다.",
  //     reason:
  //       "비가 그친 후에도 쌀쌀할 수 있으니 트렌치코트가 보온에 도움이 됩니다.",
  //   },
  // };

  const image = await getDalleImage(JSON.stringify(prompt), sex, age);
  if (image.message) return image.message;
  const productsURL = await getNaverShoppingURL(prompt);
  if (productsURL.message) return productsURL.message;

  return {
    image: image.img,
    productsURL,
    weather: weatherData,
    // weather: { tomorrow: weather[0], hourly },
    prompt,
  };
};
