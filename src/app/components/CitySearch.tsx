import { useState } from 'react';
import { popularCities } from '../api/openweather';

interface CitySearchProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export default function CitySearch({ onSearch, isLoading }: CitySearchProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  const handleCityClick = (cityName: string) => {
    setCity(cityName);
    onSearch(cityName);
  };

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="输入城市名称..."
            className="flex-grow p-3 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading || !city.trim()}
          >
            {isLoading ? '加载中...' : '搜索'}
          </button>
        </div>
      </form>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">热门城市</h3>
        <div className="flex flex-wrap gap-2">
          {popularCities.map((city) => (
            <button
              key={`${city.name}-${city.country}`}
              onClick={() => handleCityClick(city.name)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              disabled={isLoading}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 