"use client"

import { useState } from 'react';

export default function TestApiPage() {
  const [result, setResult] = useState<string>('等待测试...');
  const [city, setCity] = useState<string>('beijing');
  
  const testDirectApi = async () => {
    try {
      setResult('正在通过API路由测试...');
      const response = await fetch(`/api/openweather?city=${encodeURIComponent(city)}`);
      const data = await response.json();
      setResult('API路由返回:\n' + JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`API路由错误: ${err instanceof Error ? err.message : '未知错误'}`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">OpenWeatherMap API 测试</h1>
      
      <div className="mb-4">
        <label className="block mb-2">城市名称 (建议英文)</label>
        <input 
          type="text" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        
        <button 
          onClick={testDirectApi}
          className="p-2 bg-blue-500 text-white rounded"
        >
          测试API
        </button>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">测试结果:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap">
          {result}
        </pre>
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-medium mb-1">常见问题:</h3>
        <ul className="list-disc pl-5">
          <li>确保API密钥正确且已激活 (新API密钥可能需要几小时生效)</li>
          <li>尝试使用英文城市名，如"beijing"而不是"北京"</li>
          <li>检查网络连接是否正常</li>
          <li>检查浏览器控制台 (F12) 查看详细错误</li>
        </ul>
      </div>
    </div>
  );
} 