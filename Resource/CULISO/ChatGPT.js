require('dotenv').config();
const axios = require('axios');

let openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;
let tavilyApiKey = process.env.TAVILY_API_KEY;

const weatherDescriptionMap = {
    'clear sky': '맑은 하늘',
    'few clouds': '구름 조금',
    'scattered clouds': '흩어진 구름',
    'broken clouds': '구름 많음',
    'shower rain': '소나기',
    'rain': '비',
    'thunderstorm': '천둥번개',
    'snow': '눈',
    'mist': '안개',
    'overcast clouds': '흐린 하늘'
};

const cityMap = {
    '서울': 'Seoul',
    '부산': 'Busan',
    '대구': 'Daegu',
    '인천': 'Incheon',
    '광주': 'Gwangju',
    '대전': 'Daejeon',
    '울산': 'Ulsan',
    '세종': 'Sejong',
    '경기': 'Gyeonggi-do',
    '강원': 'Gangwon-do',
    '충북': 'Chungcheongbuk-do',
    '충남': 'Chungcheongnam-do',
    '전북': 'Jeollabuk-do',
    '전남': 'Jeollanam-do',
    '경북': 'Gyeongsangbuk-do',
    '경남': 'Gyeongsangnam-do',
    '제주': 'Jeju-do'
};

const reverseCityMap = Object.fromEntries(Object.entries(cityMap).map(([k, v]) => [v, k]));

const getClosestForecast = (forecasts, specificTime) => {
    let closestForecast = forecasts[0];
    let minDifference = Math.abs(new Date(forecasts[0].dt * 1000).getHours() - specificTime);
  
    for (let i = 1; i < forecasts.length; i++) {
      const forecastTime = new Date(forecasts[i].dt * 1000).getHours();
      const difference = Math.abs(forecastTime - specificTime);
  
      if (difference < minDifference) {
        closestForecast = forecasts[i];
        minDifference = difference;
      }
    }
  
    return closestForecast;
  };
  
  const getWeatherForecastByCityWithMessage = async (city, specificTime) => {
    try {
      const cityName = cityMap[city] || city;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${openWeatherMapApiKey}&units=metric`
      );
      const forecast = response.data;
  
      if (specificTime !== undefined) {
        const closestForecast = getClosestForecast(forecast.list, specificTime);
  
        const date = new Date(closestForecast.dt * 1000);
        const weatherDescription = weatherDescriptionMap[closestForecast.weather[0].description] || closestForecast.weather[0].description;
  
        return `${city}의 ${specificTime}시 날씨는 기온이 ${closestForecast.main.temp}°C이며, ${weatherDescription}입니다.`;
      }
  
      const forecastMessages = forecast.list.slice(0, 5).map((item) => {
        const date = new Date(item.dt * 1000);
        const weatherDescription = weatherDescriptionMap[item.weather[0].description] || item.weather[0].description;
  
        return `${date.toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: 'numeric' })}의 기온은 ${item.main.temp}°C이며, ${weatherDescription}입니다.`;
      });
  
      const locationMessage = `${reverseCityMap[forecast.city.name] || forecast.city.name}의 날씨 예보입니다.`;
  
      return `${locationMessage}\n${forecastMessages.join('\n')}`;
    } catch (error) {
      console.error('Error fetching weather forecast data:', error.response ? error.response.data : error.message);
      throw new Error('날씨 예보 정보를 가져오는 데 문제가 발생했습니다.');
    }
  };
  
  const getCurrentWeatherByCityWithMessage = async (city) => {
    try {
      const cityName = cityMap[city] || city;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${openWeatherMapApiKey}&units=metric`
      );
      const weather = response.data;
  
      const weatherDescription = weatherDescriptionMap[weather.weather[0].description] || weather.weather[0].description;
  
      return `${reverseCityMap[weather.name] || weather.name}의 현재 기온은 ${weather.main.temp}°C이며, ${weatherDescription}입니다.`;
    } catch (error) {
      console.error('Error fetching current weather data:', error.response ? error.response.data : error.message);
      throw new Error('현재 날씨 정보를 가져오는 데 문제가 발생했습니다.');
    }
  };
  
  const getWeatherForecastByLocationWithMessage = async (latitude, longitude, specificTime) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}&units=metric`
      );
      const forecast = response.data;
  
      if (specificTime !== undefined) {
        const closestForecast = getClosestForecast(forecast.list, specificTime);
  
        const date = new Date(closestForecast.dt * 1000);
        const weatherDescription = weatherDescriptionMap[closestForecast.weather[0].description] || closestForecast.weather[0].description;
  
        return `해당 위치의 ${specificTime}시 날씨는 기온이 ${closestForecast.main.temp}°C이며, ${weatherDescription}입니다.`;
      }
  
      const forecastMessages = forecast.list.slice(0, 5).map((item) => {
        const date = new Date(item.dt * 1000);
        const weatherDescription = weatherDescriptionMap[item.weather[0].description] || item.weather[0].description;
  
        return `${date.toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: 'numeric' })}의 기온은 ${item.main.temp}°C이며, ${weatherDescription}입니다.`;
      });
  
      const locationMessage = `${reverseCityMap[forecast.city.name] || forecast.city.name}의 날씨 예보입니다.`;
  
      return `${locationMessage}\n${forecastMessages.join('\n')}`;
    } catch (error) {
      console.error('Error fetching weather forecast data:', error.response ? error.response.data : error.message);
      throw new Error('날씨 예보 정보를 가져오는 데 문제가 발생했습니다.');
    }
  };
  
  const getCurrentWeatherByLocationWithMessage = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}&units=metric`
      );
      const weather = response.data;
  
      const weatherDescription = weatherDescriptionMap[weather.weather[0].description] || weather.weather[0].description;
  
      return `${reverseCityMap[weather.name] || weather.name}의 현재 기온은 ${weather.main.temp}°C이며, ${weatherDescription}입니다.`;
    } catch (error) {
      console.error('Error fetching current weather data:', error.response ? error.response.data : error.message);
      throw new Error('현재 날씨 정보를 가져오는 데 문제가 발생했습니다.');
    }
  };
  const getAnswerFromTavily = async (message) => {
    try {
      const response = await axios.post(
        'https://api.tavily.com/v1/query',
        { query: message },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tavilyApiKey}`
          }
        }
      );
  
      return response.data.answer;
    } catch (error) {
      console.error('Error fetching data from Tavily:', error.response ? error.response.data : error.message);
      throw new Error('Tavily API 정보를 가져오는 데 문제가 발생했습니다.');
    }
  }



module.exports = {
    getClosestForecast: getClosestForecast,
    getWeatherForecastByCityWithMessage : getWeatherForecastByCityWithMessage,
    getCurrentWeatherByCityWithMessage : getCurrentWeatherByCityWithMessage,
    getWeatherForecastByLocationWithMessage : getWeatherForecastByLocationWithMessage,
    getCurrentWeatherByLocationWithMessage : getCurrentWeatherByLocationWithMessage,
    getAnswerFromTavily:getAnswerFromTavily
};
