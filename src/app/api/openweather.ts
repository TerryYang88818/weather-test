// OpenWeatherMap API 工具函数
// 文档: https://openweathermap.org/api

export interface OpenWeatherData {
  cityName: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  weatherMain: string;
  weatherDescription: string;
  weatherIcon: string;
  country: string;
  sunrise: Date;
  sunset: Date;
}

// 使用 OpenWeatherMap API 获取天气数据
export const fetchOpenWeatherData = async (
  city: string, 
  apiKey: string,
  units: 'metric' | 'imperial' = 'metric'
): Promise<OpenWeatherData> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}&lang=zh_cn`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`获取天气数据失败: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    cityName: data.name,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    weatherMain: data.weather[0].main,
    weatherDescription: data.weather[0].description,
    weatherIcon: data.weather[0].icon,
    country: data.sys.country,
    sunrise: new Date(data.sys.sunrise * 1000),
    sunset: new Date(data.sys.sunset * 1000)
  };
};

// 热门城市列表
export const popularCities = [
  { name: "北京", country: "中国" },
  { name: "上海", country: "中国" },
  { name: "广州", country: "中国" },
  { name: "深圳", country: "中国" },
  { name: "香港", country: "中国" },
  { name: "东京", country: "日本" },
  { name: "纽约", country: "美国" },
  { name: "伦敦", country: "英国" },
  { name: "巴黎", country: "法国" },
  { name: "悉尼", country: "澳大利亚" }
];

// 获取天气图标 URL
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// 格式化时间
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// 根据天气情况获取背景图
export const getWeatherBackground = (weatherMain: string): string => {
  const backgrounds: Record<string, string> = {
    'Clear': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1024&auto=format&fit=crop',
    'Clouds': 'https://images.unsplash.com/photo-1525920980995-f8a382bf42c5?q=80&w=1024&auto=format&fit=crop',
    'Rain': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1024&auto=format&fit=crop',
    'Drizzle': 'https://images.unsplash.com/photo-1556485689-33e55ab56127?q=80&w=1024&auto=format&fit=crop',
    'Thunderstorm': 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1024&auto=format&fit=crop',
    'Snow': 'https://images.unsplash.com/photo-1516431762806-5a41e2353ae4?q=80&w=1024&auto=format&fit=crop',
    'Mist': 'https://images.unsplash.com/photo-1543968996-ee822b8176ba?q=80&w=1024&auto=format&fit=crop',
    'Smoke': 'https://images.unsplash.com/photo-1543968996-ee822b8176ba?q=80&w=1024&auto=format&fit=crop',
    'Haze': 'https://images.unsplash.com/photo-1533757704860-f673d420d2d5?q=80&w=1024&auto=format&fit=crop',
    'Dust': 'https://images.unsplash.com/photo-1532928448350-27c4fb515a07?q=80&w=1024&auto=format&fit=crop',
    'Fog': 'https://images.unsplash.com/photo-1543968996-ee822b8176ba?q=80&w=1024&auto=format&fit=crop'
  };
  
  return backgrounds[weatherMain] || 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1024&auto=format&fit=crop';
}; 