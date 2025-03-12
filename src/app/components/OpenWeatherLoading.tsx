export default function OpenWeatherLoading() {
  return (
    <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mt-2"></div>
          </div>
          <div className="flex items-center">
            <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-20 ml-2"></div>
          </div>
        </div>
        
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-60 mt-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
        
        <div className="bg-gray-100 dark:bg-gray-900 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="text-center">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mx-auto w-16 mb-2"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mx-auto w-12"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-2"></div>
            <div className="flex items-center">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-28 mb-2"></div>
            <div className="flex items-center space-x-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 