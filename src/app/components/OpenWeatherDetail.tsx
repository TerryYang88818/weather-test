import Image from 'next/image';
import { OpenWeatherData, getWeatherIconUrl, formatTime } from '../api/openweather';

interface OpenWeatherDetailProps {
  weatherData: OpenWeatherData;
}

export default function OpenWeatherDetail({ weatherData }: OpenWeatherDetailProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* 城市和温度信息 */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {weatherData.cityName}
              <span className="text-sm ml-2 text-gray-500 dark:text-gray-400">{weatherData.country}</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString('zh-CN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center">
            <Image 
              src={getWeatherIconUrl(weatherData.weatherIcon)} 
              alt={weatherData.weatherDescription}
              width={64}
              height={64}
            />
            <span className="text-4xl font-bold text-gray-800 dark:text-white ml-2">
              {Math.round(weatherData.temperature)}°C
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-lg text-gray-700 dark:text-gray-300 capitalize">
            {weatherData.weatherDescription}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            体感温度: {Math.round(weatherData.feelsLike)}°C
          </p>
        </div>
      </div>
      
      {/* 详细信息 */}
      <div className="bg-gray-50 dark:bg-gray-900 p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">最高温度</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {Math.round(weatherData.tempMax)}°C
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">最低温度</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {Math.round(weatherData.tempMin)}°C
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">湿度</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {weatherData.humidity}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">气压</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {weatherData.pressure} hPa
          </p>
        </div>
      </div>
      
      {/* 风速和日出日落 */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">风速</h3>
          <div className="flex items-center">
            <span className="text-xl mr-2">💨</span>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {weatherData.windSpeed} 米/秒
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">日出 / 日落</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🌅</span>
              <p className="text-gray-800 dark:text-white">
                {formatTime(weatherData.sunrise)}
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-xl mr-2">🌇</span>
              <p className="text-gray-800 dark:text-white">
                {formatTime(weatherData.sunset)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 