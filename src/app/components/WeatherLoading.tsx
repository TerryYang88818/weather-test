export default function WeatherLoading() {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col items-center justify-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-xl font-medium text-gray-700 dark:text-gray-300">正在加载天气数据...</p>
      <p className="text-gray-500 dark:text-gray-400 mt-2">查找世界各地的随机位置</p>
    </div>
  );
} 