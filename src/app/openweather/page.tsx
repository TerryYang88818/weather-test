"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

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
  visibility: number;
  dt: number;
  timezone: number;
  formatted_time: string;
  local_time: string;
}

export default function OpenWeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastSearchedCity, setLastSearchedCity] = useState<string | null>(null);

  // 使用useMemo缓存热门城市列表，避免每次渲染重新创建
  const popularCities = useMemo(() => [
    '北京', '上海', '广州', '深圳', '香港', 
    '纽约', '伦敦', '东京', '巴黎', '悉尼'
  ], []);

  // 初始加载效果
  useEffect(() => {
    // 延迟一小段时间后关闭初始加载状态
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const fetchWeather = async (searchCity: string, isRetry = false) => {
    if (!searchCity.trim()) {
      setError('请输入城市名');
      setErrorDetails('城市名不能为空');
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      
      if (!isRetry) {
        setLastSearchedCity(searchCity);
      }

      // 添加时间戳避免缓存
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/openweather?city=${encodeURIComponent(searchCity)}&_=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || '获取天气数据失败');
        setErrorDetails(errorData.details || `HTTP错误: ${response.status}`);
        setWeather(null);
      } else {
        const data = await response.json();
        setWeather(data);
        // 成功获取数据后重置重试计数
        setRetryCount(0);
      }
    } catch (err) {
      console.error('获取天气数据时出错:', err);
      setError('获取天气数据失败');
      setErrorDetails(err instanceof Error ? err.message : '未知错误');
      setWeather(null);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const handleRetry = () => {
    if (retryCount < 3 && lastSearchedCity) {
      setRetryCount(prev => prev + 1);
      fetchWeather(lastSearchedCity, true);
    }
  };

  const handlePopularCityClick = (popularCity: string) => {
    setCity(popularCity);
    fetchWeather(popularCity);
  };

  // 显示初始加载状态
  if (initialLoad) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>正在加载天气应用...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>天气查询</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="输入城市名称 (如: 北京, london)"
          className={styles.input}
          disabled={loading}
        />
        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? '加载中...' : '查询'}
        </button>
      </form>

      <div className={styles.popularCities}>
        <h3>热门城市:</h3>
        <div className={styles.cityButtons}>
          {popularCities.map((popularCity) => (
            <button
              key={popularCity}
              onClick={() => handlePopularCityClick(popularCity)}
              className={styles.cityButton}
              disabled={loading}
            >
              {popularCity}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>正在获取天气数据...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <h3>错误: {error}</h3>
          {errorDetails && <p>{errorDetails}</p>}
          {lastSearchedCity && retryCount < 3 && (
            <div className={styles.retryContainer}>
              <button 
                onClick={handleRetry} 
                className={styles.retryButton}
                disabled={loading}
              >
                重试 ({retryCount}/3)
              </button>
              <p className={styles.retryHint}>
                {retryCount === 0 
                  ? '首次尝试失败' 
                  : retryCount === 1 
                    ? '第二次尝试' 
                    : '最后一次尝试'}
              </p>
            </div>
          )}
        </div>
      )}

      {weather && (
        <div className={styles.weatherCard}>
          <h2>{weather.name} ({weather.sys.country})</h2>
          <div className={styles.weatherMain}>
            <Image 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description}
              className={styles.weatherIcon}
              width={80}
              height={80}
              unoptimized
            />
            <div className={styles.temperature}>
              <span className={styles.tempValue}>{Math.round(weather.main.temp)}°C</span>
              <span className={styles.tempFeelsLike}>体感温度: {Math.round(weather.main.feels_like)}°C</span>
            </div>
          </div>
          <p className={styles.weatherDescription}>{weather.weather[0].description}</p>
          
          <div className={styles.weatherDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>湿度:</span>
              <span className={styles.detailValue}>{weather.main.humidity}%</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>气压:</span>
              <span className={styles.detailValue}>{weather.main.pressure} hPa</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>风速:</span>
              <span className={styles.detailValue}>{weather.wind.speed} m/s</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>能见度:</span>
              <span className={styles.detailValue}>{(weather.visibility / 1000).toFixed(1)} km</span>
            </div>
          </div>
          
          {weather.formatted_time && (
            <div className={styles.timeInfo}>
              <p>当地时间: {weather.formatted_time}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 