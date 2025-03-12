import { NextResponse } from 'next/server';

// 确保这里已替换为有效的API密钥
const FALLBACK_API_KEY = '18971d2744ddae8df23ba9606bb1a327'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'london'; // 使用一个确定存在的城市作为默认值

  const apiKey = process.env.OPENWEATHERMAP_API_KEY || FALLBACK_API_KEY;
  
  try {
    // 尝试使用英文城市名
    let encodedCity = encodeURIComponent(city);
    
    // 如果输入的是中文城市名，尝试转换为英文名
    const cityMapping: Record<string, string> = {
      // 中国城市
      '北京': 'beijing',
      '上海': 'shanghai',
      '广州': 'guangzhou',
      '深圳': 'shenzhen',
      '香港': 'hong kong',
      '台北': 'taipei',
      '成都': 'chengdu',
      '重庆': 'chongqing',
      '西安': 'xian',
      '南京': 'nanjing',
      '杭州': 'hangzhou',
      '武汉': 'wuhan',
      '天津': 'tianjin',
      '苏州': 'suzhou',
      '厦门': 'xiamen',
      '哈尔滨': 'harbin',
      '长春': 'changchun',
      '沈阳': 'shenyang',
      '大连': 'dalian',
      '青岛': 'qingdao',
      '济南': 'jinan',
      '郑州': 'zhengzhou',
      '长沙': 'changsha',
      '福州': 'fuzhou',
      '昆明': 'kunming',
      '贵阳': 'guiyang',
      '南宁': 'nanning',
      '海口': 'haikou',
      '三亚': 'sanya',
      '拉萨': 'lhasa',
      '乌鲁木齐': 'urumqi',
      '兰州': 'lanzhou',
      '西宁': 'xining',
      '银川': 'yinchuan',
      '太原': 'taiyuan',
      '石家庄': 'shijiazhuang',
      '呼和浩特': 'hohhot',
      '南昌': 'nanchang',
      '合肥': 'hefei',
      
      // 国际城市
      '东京': 'tokyo',
      '首尔': 'seoul',
      '纽约': 'new york',
      '伦敦': 'london',
      '巴黎': 'paris',
      '柏林': 'berlin',
      '莫斯科': 'moscow',
      '悉尼': 'sydney',
      '新加坡': 'singapore',
      '曼谷': 'bangkok',
      '吉隆坡': 'kuala lumpur',
      '雅加达': 'jakarta',
      '迪拜': 'dubai',
      '开罗': 'cairo',
      '罗马': 'rome',
      '马德里': 'madrid',
      '阿姆斯特丹': 'amsterdam',
      '布鲁塞尔': 'brussels',
      '维也纳': 'vienna',
      '斯德哥尔摩': 'stockholm',
      '赫尔辛基': 'helsinki',
      '奥斯陆': 'oslo',
      '华沙': 'warsaw',
      '布达佩斯': 'budapest',
      '布拉格': 'prague',
      '雅典': 'athens',
      '伊斯坦布尔': 'istanbul',
      '孟买': 'mumbai',
      '德里': 'delhi',
      '加尔各答': 'kolkata',
      '孟加拉': 'dhaka',
      '卡拉奇': 'karachi',
      '约翰内斯堡': 'johannesburg',
      '开普敦': 'cape town',
      '墨西哥城': 'mexico city',
      '圣保罗': 'sao paulo',
      '里约热内卢': 'rio de janeiro',
      '布宜诺斯艾利斯': 'buenos aires',
      '利马': 'lima',
      '圣地亚哥': 'santiago',
      '多伦多': 'toronto',
      '温哥华': 'vancouver',
      '蒙特利尔': 'montreal',
      '墨尔本': 'melbourne',
      '奥克兰': 'auckland',
      '惠灵顿': 'wellington'
    };
    
    if (cityMapping[city]) {
      encodedCity = encodeURIComponent(cityMapping[city]);
      console.log(`将城市名 "${city}" 转换为 "${cityMapping[city]}"`);
    }
    
    // 使用备用API密钥
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&lang=zh_cn&units=metric`;
    
    console.log('发送请求到:', apiUrl.replace(apiKey, '[API_KEY]'));
    
    // 添加超时和更多选项
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
    try {
      const response = await fetch(apiUrl, { 
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId); // 清除超时
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误:', response.status, errorText);
        
        // 如果是404错误，可能是城市名不正确
        if (response.status === 404) {
          return NextResponse.json(
            { 
              error: `找不到城市 "${city}"`, 
              details: "请尝试使用英文城市名，如 'beijing' 而不是 '北京'"
            },
            { status: 404 }
          );
        }
        
        // 如果是401错误，可能是API密钥问题
        if (response.status === 401) {
          return NextResponse.json(
            { 
              error: "API密钥无效或未激活", 
              details: "请检查您的OpenWeatherMap API密钥是否正确，新API密钥可能需要几小时才能激活"
            },
            { status: 401 }
          );
        }
        
        return NextResponse.json(
          { error: `OpenWeatherMap API错误: ${response.status}`, details: errorText },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      // 添加本地时间信息
      const timestamp = data.dt * 1000; // 转换为毫秒
      const localTime = new Date(timestamp + (data.timezone * 1000)); // 添加时区偏移
      
      // 格式化时间
      const formattedTime = localTime.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      // 添加格式化的时间到返回数据
      const enhancedData = {
        ...data,
        formatted_time: formattedTime,
        local_time: localTime.toISOString()
      };
      
      console.log('API返回数据:', enhancedData);
      return NextResponse.json(enhancedData);
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: '请求超时', details: '服务器响应时间过长，请稍后再试' },
          { status: 408 }
        );
      }
      throw fetchError; // 重新抛出其他fetch错误
    }
  } catch (error: any) {
    console.error('获取天气数据失败:', error);
    
    // 提供更详细的错误信息
    let errorMessage = '获取天气数据失败';
    let errorDetails = error instanceof Error ? error.message : '未知错误';
    
    // 检查是否是网络错误
    if (error instanceof Error && error.message.includes('fetch')) {
      errorMessage = '网络连接错误';
      errorDetails = '无法连接到OpenWeatherMap API，请检查您的网络连接';
    }
    
    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 }
    );
  }
} 