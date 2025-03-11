import React from 'react';
import { Stack } from 'expo-router';

export default function AnalyticsLayout() {
  return (
    <Stack
      screenOptions={{
        // Tamamen header'i gizliyoruz, manuel geri tuşu ekleyeceğiz
        headerShown: false
      }}
    />
  );
}
