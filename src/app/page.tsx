"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到天气页面
    router.push('/openweather');
  }, [router]);

  // 显示加载状态，避免页面跳动
  return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>正在加载天气应用...</p>
      </div>
    </div>
  );
}
