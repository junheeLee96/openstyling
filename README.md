# [OpenStyling](https://openstyling.r-e.kr/)

### 설명

[OpenStyling](https://openstyling.r-e.kr/)은 사용자가 원하는 장소의 날씨를 예측하여 그 날의 옷차림을 추천해줍니다.
<img width="1455" alt="스크린샷 2024-11-08 오후 3 37 07" src="https://github.com/user-attachments/assets/ef7e8679-f090-4859-97db-0e00c5a003cd">

### STACK

- **Next.JS**:제가 주로 사용하는 라이브러리인 React의 SEO를 위해 사용했습니다.
- **TailwindCSS**: CSS의 편리한 사용을 위해 사용했습니다.
- **Zustand**: 클라이언트 컴포넌트의 상태 관리를 위해 사용했습니다.

### Features

- 현재부터 앞으로의 원하는 지역의 24시간 날씨를 알려줍니다.
- 나이대 별 소개팅, 면접 등 상황과 날씨에 맞는 옷차림을 추천해줍니다.
- 옷이 없을 경우를 위해 옷을 바로 구매할 수 있는 외부 링크를 제공합니다.
- IP별 일일 한도를 3회로 제한했습니다.

### Get started

API키를 발급 받아야합니다.

- GPT API는 [링크](https://openai.com/index/openai-api/)에서 발급받을 수 있습니다.
- openWeatherMap API는 [링크](https://openweathermap.org/)에서 발급받을 수 있습니다.
- Naver API는 [링크](https://developers.naver.com/main/)에서 발급받을 수 있습니다.
- Kakao API는 [링크](https://developers.kakao.com/)에서 발급받을 수 있습니다.
- Redis 서버를 설치해야 합니다.

발급받은 키는 환경변수 파일에 저장해주세요.

```
npm install && npm run dev
```
