"use client";

import { useState, useEffect } from "react";
import { fetchWeatherData, getRandomLocation, WeatherData, preloadNextLocationImage } from "./api/weather";
import WeatherCard from "./components/WeatherCard";
import WeatherLoading from "./components/WeatherLoading";
import Navigation from "./components/Navigation";

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRandomWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get a random location
      const location = getRandomLocation();
      
      // Fetch weather data for that location
      const data = await fetchWeatherData(location);
      
      setWeatherData(data);
      
      // 提前预加载下一个可能显示的位置图片
      preloadNextLocationImage();
    } catch (err) {
      console.error("加载天气数据出错:", err);
      setError("加载天气数据失败。请重试。");
    } finally {
      setLoading(false);
    }
  };

  // Load weather data on initial render
  useEffect(() => {
    loadRandomWeather();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navigation />
      
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            全球天气探索
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg">
            使用Open-Meteo API探索世界各地的天气状况
          </p>
        </header>

        <main>
          {loading ? (
            <WeatherLoading />
          ) : error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg max-w-2xl">
              <p className="font-medium">{error}</p>
              <button 
                onClick={loadRandomWeather} 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                重试
              </button>
            </div>
          ) : weatherData ? (
            <WeatherCard weatherData={weatherData} onRefresh={loadRandomWeather} />
          ) : null}
        </main>
        
        <footer className="mt-12 text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>数据由 <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">Open-Meteo</a> 提供</p>
          <p className="mt-1">图片来自 <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">Unsplash</a></p>
        </footer>
      </div>
    </div>
  );
}
