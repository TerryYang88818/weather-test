import Image from 'next/image';
import { WeatherData, weatherCodeToDescription, weatherCodeToIcon } from '../api/weather';

interface WeatherCardProps {
  weatherData: WeatherData;
  onRefresh: () => void;
}

export default function WeatherCard({ weatherData, onRefresh }: WeatherCardProps) {
  const { 
    temperature, 
    weatherCode, 
    windSpeed, 
    humidity, 
    date,
    location 
  } = weatherData;

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg">
      <div className="relative h-48 md:h-64">
        <Image 
          src={location.imageUrl || "https://images.unsplash.com/photo-1561583534-09e822ba83ba?q=80&w=1920"} 
          alt={location.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex flex-col justify-end p-6">
          <h1 className="text-3xl font-bold text-white mb-1">{location.name}</h1>
          <p className="text-gray-200">{location.country}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-6xl mr-4">{weatherCodeToIcon(weatherCode)}</span>
            <div>
              <p className="text-4xl font-bold">{temperature}°C</p>
              <p className="text-gray-500 dark:text-gray-400">{weatherCodeToDescription(weatherCode)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-600 dark:text-gray-400">{date}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="text-xl mr-2">💨</span>
            <div>
              <p className="font-medium">风速</p>
              <p className="text-gray-600 dark:text-gray-400">{windSpeed} 公里/小时</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xl mr-2">💧</span>
            <div>
              <p className="font-medium">湿度</p>
              <p className="text-gray-600 dark:text-gray-400">{humidity}%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <button 
          onClick={onRefresh}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          显示另一个地点
        </button>
      </div>
    </div>
  );
} 