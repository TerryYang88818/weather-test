"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

// 添加城市图片映射
const cityImages: Record<string, string> = {
  // 中国城市
  'beijing': 'https://images.unsplash.com/photo-1584490867456-200db92a0212?q=80&w=800',
  'shanghai': 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?q=80&w=800',
  'guangzhou': 'https://images.unsplash.com/photo-1583824093698-e81dede3f00d?q=80&w=800',
  'shenzhen': 'https://images.unsplash.com/photo-1552912775-e7120e37e0c9?q=80&w=800',
  'hong kong': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=800',
  
  // 国际城市
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800',
  'tokyo': 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=800',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800',
  'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800',
  
  // 默认图片
  'default': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=800'
};

// 天气图标映射到背景颜色
const weatherColors: Record<string, string> = {
  '01d': '#4a90e2', // 晴天
  '01n': '#2c3e50', // 晴夜
  '02d': '#5d9cec', // 少云 白天
  '02n': '#34495e', // 少云 夜间
  '03d': '#95a5a6', // 多云 白天
  '03n': '#7f8c8d', // 多云 夜间
  '04d': '#bdc3c7', // 阴天 白天
  '04n': '#95a5a6', // 阴天 夜间
  '09d': '#3498db', // 小雨
  '09n': '#2980b9', // 小雨 夜间
  '10d': '#2980b9', // 雨
  '10n': '#2c3e50', // 雨 夜间
  '11d': '#34495e', // 雷雨
  '11n': '#2c3e50', // 雷雨 夜间
  '13d': '#ecf0f1', // 雪
  '13n': '#bdc3c7', // 雪 夜间
  '50d': '#ecf0f1', // 雾
  '50n': '#bdc3c7'  // 雾 夜间
};

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
    sunrise: number;
    sunset: number;
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cityImage, setCityImage] = useState(cityImages.default);

  // 使用useMemo缓存热门城市列表，避免每次渲染重新创建
  const popularCities = useMemo(() => [
    '北京', '上海', '广州', '深圳', '香港', 
    '纽约', '伦敦', '东京', '巴黎', '悉尼'
  ], []);

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

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

      // 添加随机延迟，避免频繁请求API
      const delay = Math.floor(Math.random() * 1000) + 500; // 500-1500ms的随机延迟
      await new Promise(resolve => setTimeout(resolve, delay));

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
        
        // 设置城市图片
        const cityKey = data.name.toLowerCase();
        const englishCityName = cityKey.replace(/\s+/g, ' ');
        setCityImage(cityImages[englishCityName] || cityImages.default);
        
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

  // 格式化当前时间
  const formattedCurrentTime = currentTime.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

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
      
      <div className={styles.currentTimeDisplay}>
        <div className={styles.timeIcon}>🕒</div>
        <span>当前时间: {formattedCurrentTime}</span>
      </div>
      
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
          
          {/* 为API限流错误添加特殊提示 */}
          {error === "API请求次数超限" && (
            <div className={styles.apiLimitInfo}>
              <p>解决方法:</p>
              <ol>
                <li>等待几小时后再试</li>
                <li>使用新的API密钥</li>
                <li>升级到OpenWeatherMap付费计划</li>
              </ol>
              <p className={styles.apiLimitNote}>
                免费API密钥限制为每分钟60次调用，每天1,000次调用
              </p>
            </div>
          )}
          
          {lastSearchedCity && retryCount < 3 && (
            <div className={styles.retryContainer}>
              <button 
                onClick={handleRetry} 
                className={styles.retryButton}
                disabled={loading || error === "API请求次数超限"}
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
        <div 
          className={styles.weatherCard}
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${cityImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white'
          }}
        >
          <div className={styles.realtimeIndicator}>
            <div className={styles.pulseDot}></div>
            <span>实时数据</span>
          </div>
          
          <h2>{weather.name} ({weather.sys.country})</h2>
          
          <div className={styles.weatherMain}>
            <Image 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
              alt={weather.weather[0].description}
              className={styles.weatherIcon}
              width={120}
              height={120}
              unoptimized
            />
            <div className={styles.temperature}>
              <span className={styles.tempValue}>{Math.round(weather.main.temp)}°C</span>
              <span className={styles.tempFeelsLike}>体感温度: {Math.round(weather.main.feels_like)}°C</span>
              <span className={styles.weatherDescription}>{weather.weather[0].description}</span>
            </div>
          </div>
          
          <div className={styles.weatherDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>湿度</span>
              <span className={styles.detailValue}>{weather.main.humidity}%</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>气压</span>
              <span className={styles.detailValue}>{weather.main.pressure} hPa</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>风速</span>
              <span className={styles.detailValue}>{weather.wind.speed} m/s</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>能见度</span>
              <span className={styles.detailValue}>{(weather.visibility / 1000).toFixed(1)} km</span>
            </div>
          </div>
          
          <div className={styles.sunTimes}>
            <div className={styles.sunTime}>
              <span className={styles.sunTimeIcon}>🌅</span>
              <span className={styles.sunTimeLabel}>日出</span>
              <span className={styles.sunTimeValue}>
                {new Date((weather.sys.sunrise + weather.timezone) * 1000).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </span>
            </div>
            <div className={styles.sunTime}>
              <span className={styles.sunTimeIcon}>🌇</span>
              <span className={styles.sunTimeLabel}>日落</span>
              <span className={styles.sunTimeValue}>
                {new Date((weather.sys.sunset + weather.timezone) * 1000).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </span>
            </div>
          </div>
          
          {weather.formatted_time && (
            <div className={styles.timeInfo}>
              <p>当地时间: {weather.formatted_time}</p>
              <p className={styles.dataSource}>数据来源: OpenWeatherMap</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 