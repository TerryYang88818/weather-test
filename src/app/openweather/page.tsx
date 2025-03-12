"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import WeatherLoading from '../components/WeatherLoading';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
  dt: number;
  timezone: number;
  formatted_time: string;
  local_time: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export default function OpenWeatherPage() {
  const [city, setCity] = useState('london'); // 默认使用伦敦
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>('');

  // 热门城市建议 - 使用useMemo包装，避免在每次渲染时重新创建
  const popularCities = useMemo(() => [
    { name: '伦敦', value: 'london' },
    { name: '纽约', value: 'new york' },
    { name: '东京', value: 'tokyo' },
    { name: '北京', value: 'beijing' },
    { name: '上海', value: 'shanghai' },
    { name: '巴黎', value: 'paris' },
    { name: '柏林', value: 'berlin' },
    { name: '莫斯科', value: 'moscow' },
    { name: '悉尼', value: 'sydney' },
    { name: '新加坡', value: 'singapore' }
  ], []);

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchWeather = useCallback(async (cityName: string, isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      setError(null);
      
      // 添加随机参数避免缓存
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/openweather?city=${encodeURIComponent(cityName)}&_=${timestamp}`);
      
      const data = await response.json();
      
      if (data.error) {
        setError({
          error: data.error,
          details: data.details
        });
        setWeatherData(null);
      } else {
        setWeatherData(data);
        // 成功获取数据后，将这个城市添加到建议列表的前面
        const cityToAdd = popularCities.find(c => c.value.toLowerCase() === cityName.toLowerCase())?.name || cityName;
        if (!suggestions.includes(cityToAdd)) {
          setSuggestions(prev => [cityToAdd, ...prev].slice(0, 5));
        }
        // 重置重试计数
        setRetryCount(0);
      }
    } catch (err) {
      console.error('获取天气数据错误:', err);
      setError({
        error: '获取天气数据失败',
        details: err instanceof Error ? err.message : '未知错误'
      });
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [popularCities, suggestions]);

  // 自动重试功能
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchWeather(city, true);
    }
  };

  useEffect(() => {
    fetchWeather(city);
    // 初始化建议列表
    setSuggestions(popularCities.slice(0, 5).map(c => c.name));
  }, [city, fetchWeather, popularCities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      // 重置重试计数
      setRetryCount(0);
      fetchWeather(city.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // 查找对应的英文值
    const cityObj = popularCities.find(c => c.name === suggestion);
    const cityValue = cityObj ? cityObj.value : suggestion;
    
    setCity(cityValue);
    // 重置重试计数
    setRetryCount(0);
    fetchWeather(cityValue);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          OpenWeatherMap 天气查询
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg">
          查询世界各地的实时天气状况
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          当前时间: {currentTime}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-md mb-6">
        <div className="flex flex-col">
          <div className="flex items-center">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="输入城市名称（支持中文或英文）"
              className="flex-1 p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading || !city.trim()}
            >
              {loading ? '查询中...' : '查询'}
            </button>
          </div>
          
          {/* 城市建议 */}
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </form>

      <main className="w-full max-w-2xl">
        {loading ? (
          <WeatherLoading />
        ) : error ? (
          <div className="p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300">错误</h3>
                <div className="mt-2 text-red-700 dark:text-red-200">
                  <p>{error.error}</p>
                  {error.details && (
                    <p className="mt-1 text-sm">{error.details}</p>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-red-700 dark:text-red-200 mb-3">
                    提示：支持中文城市名，如 &quot;北京&quot;、&quot;上海&quot;、&quot;广州&quot; 等
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    disabled={loading || retryCount >= 3}
                  >
                    {retryCount > 0 ? `重试 (${retryCount}/3)` : '重试'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : weatherData ? (
          <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    当地时间: {weatherData.formatted_time}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {weatherData.weather[0].icon && (
                      <div className="mr-2">
                        <Image
                          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                          alt={weatherData.weather[0].description}
                          width={50}
                          height={50}
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
                      <p className="text-gray-500 dark:text-gray-400">{weatherData.weather[0].description}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="text-xl mr-2">🌡️</span>
                  <div>
                    <p className="font-medium">体感温度</p>
                    <p className="text-gray-600 dark:text-gray-400">{Math.round(weatherData.main.feels_like)}°C</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xl mr-2">💨</span>
                  <div>
                    <p className="font-medium">风速</p>
                    <p className="text-gray-600 dark:text-gray-400">{weatherData.wind.speed} 米/秒</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xl mr-2">💧</span>
                  <div>
                    <p className="font-medium">湿度</p>
                    <p className="text-gray-600 dark:text-gray-400">{weatherData.main.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xl mr-2">🔽</span>
                  <div>
                    <p className="font-medium">气压</p>
                    <p className="text-gray-600 dark:text-gray-400">{weatherData.main.pressure} hPa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <footer className="mt-12 text-sm text-gray-500 dark:text-gray-400 text-center">
        <p>数据由 <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">OpenWeatherMap</a> 提供</p>
      </footer>
    </div>
  );
} 