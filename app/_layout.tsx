import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { paperTheme } from './theme';
import { ActivityIndicator, View } from 'react-native';
import PerformanceMonitor from './_components/PerformanceMonitor';

// Doğrudan import kullanarak SplashScreen'i yükleme
import CustomSplashScreen from './SplashScreen';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'intro',
  // Intro sayfasının görünmesi için index saklama kaldırıldı
  hideFromRouting: [],
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  
  // Custom splash screen özelliğini kontrol eden state
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  // useEffect'lerin birleştirilmesi - performansı artırır
  useEffect(() => {
    if (error) throw error;
    
    if (loaded) {
      // Varsayılan splash ekranını hemen gizle (async IIFE ile hızlandırılmış)
      (async () => {
        await SplashScreen.hideAsync();
      })();
      // Özel splash ekranı gösterilecek, showCustomSplash = true olarak kalıyor
      // Intro sayfasına geçiş için kritik değişiklik
    }
  }, [error, loaded]);

  // Fontlar yüklenmemişse boş dön
  if (!loaded) {
    return null;
  }
  
  // Fontlar yüklendi, özel splash ekranını göster - Lazy loading kaldırıldı
  if (showCustomSplash) {
    return <CustomSplashScreen onFinish={() => setShowCustomSplash(false)} />;
  }

  // Özel splash ekranı tamamlandı, normal uygulamaya geç
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <PaperProvider theme={paperTheme}>
      {/* Sadece geliştirme modunda performans izleme */}
      {__DEV__ && <PerformanceMonitor />}
      
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="intro" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" />
      </Stack>
    </PaperProvider>
  );
}