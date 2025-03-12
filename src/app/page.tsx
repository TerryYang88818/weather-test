"use client";

import { useState, useEffect } from "react";
import { fetchWeatherData, getRandomLocation, WeatherData, preloadNextLocationImage } from "./api/weather";
import WeatherCard from "./components/WeatherCard";
import WeatherLoading from "./components/WeatherLoading";
import Navigation from "./components/Navigation";
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    // 重定向到天气页面
    router.push('/openweather');
  }, [router]);

  // 显示加载状态，避免页面跳动
  return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>正在加载天气应用...</p>
      </div>
    </div>
  );
}
