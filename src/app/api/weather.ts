// Weather API utility functions using Open-Meteo API
// Documentation: https://open-meteo.com/en/docs

export interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  imageUrl?: string;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  date: string;
  location: Location;
}

// Sample locations from around the world
export const locations: Location[] = [
  {
    name: "纽约",
    lat: 40.7128,
    lon: -74.0060,
    country: "美国",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "伦敦",
    lat: 51.5074,
    lon: -0.1278,
    country: "英国",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "东京",
    lat: 35.6762,
    lon: 139.6503,
    country: "日本",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "悉尼",
    lat: -33.8688,
    lon: 151.2093,
    country: "澳大利亚",
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "里约热内卢",
    lat: -22.9068,
    lon: -43.1729,
    country: "巴西",
    imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "开罗",
    lat: 30.0444,
    lon: 31.2357,
    country: "埃及",
    imageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "北京",
    lat: 39.9042,
    lon: 116.4074,
    country: "中国",
    imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "巴黎",
    lat: 48.8566,
    lon: 2.3522,
    country: "法国",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "孟买",
    lat: 19.0760,
    lon: 72.8777,
    country: "印度",
    imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "开普敦",
    lat: -33.9249,
    lon: 18.4241,
    country: "南非",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "上海",
    lat: 31.2304,
    lon: 121.4737,
    country: "中国",
    imageUrl: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?q=80&w=1920&auto=format&fit=crop"
  },
  {
    name: "香港",
    lat: 22.3193,
    lon: 114.1694,
    country: "中国",
    imageUrl: "https://images.unsplash.com/photo-1506970845246-18f21d533b20?q=80&w=1920&auto=format&fit=crop"
  }
];

// Get a random location from the list
export const getRandomLocation = (): Location => {
  const randomIndex = Math.floor(Math.random() * locations.length);
  return locations[randomIndex];
};

// Weather code mapping to description
export const weatherCodeToDescription = (code: number): string => {
  const weatherCodes: {[key: number]: string} = {
    0: "晴朗",
    1: "大部晴朗",
    2: "部分多云",
    3: "阴天",
    45: "雾",
    48: "雾凇",
    51: "小毛毛雨",
    53: "中毛毛雨",
    55: "大毛毛雨",
    56: "小冻雨",
    57: "大冻雨",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    66: "小冻雨",
    67: "大冻雨",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    77: "雪粒",
    80: "小阵雨",
    81: "中阵雨",
    82: "强阵雨",
    85: "小阵雪",
    86: "大阵雪",
    95: "雷暴",
    96: "雷暴伴小冰雹",
    99: "雷暴伴大冰雹"
  };
  
  return weatherCodes[code] || "未知";
};

// Weather code to icon mapping
export const weatherCodeToIcon = (code: number): string => {
  if (code === 0) return "☀️"; // Clear sky
  if (code === 1 || code === 2) return "🌤️"; // Mainly clear or partly cloudy
  if (code === 3) return "☁️"; // Overcast
  if (code === 45 || code === 48) return "🌫️"; // Fog
  if (code >= 51 && code <= 57) return "🌧️"; // Drizzle
  if (code >= 61 && code <= 67) return "🌧️"; // Rain
  if (code >= 71 && code <= 77) return "❄️"; // Snow
  if (code >= 80 && code <= 82) return "🌦️"; // Rain showers
  if (code >= 85 && code <= 86) return "🌨️"; // Snow showers
  if (code >= 95) return "⛈️"; // Thunderstorm
  
  return "❓";
};

// 预加载下一个随机位置的图片
export const preloadNextLocationImage = () => {
  const nextLocation = getRandomLocation();
  if (nextLocation.imageUrl) {
    const img = new Image();
    img.src = nextLocation.imageUrl;
  }
};

// Fetch weather data for a location
export const fetchWeatherData = async (location: Location): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    humidity: data.current.relative_humidity_2m,
    date: new Date(data.current.time).toLocaleDateString(),
    location: location
  };
}; 