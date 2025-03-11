import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';

export default function Index() {
  // useEffect ile yönlendirme daha güvenli olabilir
  useEffect(() => {
    // Hiçbir şey yapmayın, sadece unstable_settings'in çalışmasını bekleyin
  }, []);
  
  // Intro ekranına yönlendir - daha kesin bir yönlendirme
  return <Redirect href="/intro" />;
}