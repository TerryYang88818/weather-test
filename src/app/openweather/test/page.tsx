"use client"

import { useState } from 'react';

export default function TestApiPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testDirectApi = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/openweather?city=london');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API 测试页面</h1>
      <p className="mb-4 text-gray-600">
        此页面用于测试 OpenWeatherMap API 的连接情况，帮助排查问题。
      </p>
      
      <button 
        onClick={testDirectApi}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? '测试中...' : '测试 API 连接'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p className="font-bold">错误:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">API 响应:</h2>
        <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-96 text-sm">
          {result || '点击上方按钮测试 API'}
        </pre>
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-medium mb-1">常见问题:</h3>
        <ul className="list-disc pl-5">
          <li>确保API密钥正确且已激活 (新API密钥可能需要几小时生效)</li>
          <li>尝试使用英文城市名，如&quot;beijing&quot;而不是&quot;北京&quot;</li>
          <li>检查网络连接是否正常</li>
          <li>检查浏览器控制台 (F12) 查看详细错误</li>
        </ul>
      </div>
    </div>
  );
} 