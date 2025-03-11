import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '../../../theme';

/**
 * İçgörüler Bölümü için Layout
 * Bu bölümdeki tüm ekranlar için ortak navigasyon ayarlarını tanımlar
 */
export default function InsightsLayout() {
  return (
    <Stack
      screenOptions={{
        // Tamamen header'i gizliyoruz, manuel geri tuşu ekleyeceğiz
        headerShown: false
      }}
    />
  );
}