import React, { lazy, Suspense } from 'react';
import { Stack } from 'expo-router';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';

// Lazy loading ile sayfaları yükle - performans optimizasyonu için
const LazyLoadingView = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

export default function DreamLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: '#f1c40f', // Altın sarısı
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#f1c40f', // Başlık rengi
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="chat" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="archive" 
        options={{
          title: 'Rüya Arşivi',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="analytics" 
        options={{
          title: 'Rüya Analizleri',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="insights" 
        options={{
          title: 'Rüya İçgörüleri',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="archetype-info/index" 
        options={{
          headerShown: false,
        }} 
      />
      {/* Detay sayfalarının başlıkları */}
      <Stack.Screen 
        name="archive/details" 
        options={{
          title: 'Rüya Detayı',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}