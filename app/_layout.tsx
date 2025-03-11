import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, lazy, Suspense } from 'react';
import { PaperProvider } from 'react-native-paper';
import { paperTheme } from './theme';
import { ActivityIndicator, View } from 'react-native';
import PerformanceMonitor from './_components/PerformanceMonitor';

// Lazy loading ile SplashScreen'i yükleme
const CustomSplashScreen = lazy(() => import('./SplashScreen'));

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
  // Remove any index routes that might be causing the issue
  hideFromRouting: ['index'],
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
      // Özel splash ekranı gösterilecek, bu nedenle RootLayoutNav döndürmek için
      // showCustomSplash = false olmasını bekleyeceğiz
    }
  }, [error, loaded]);

  // Fontlar yüklenmemişse boş dön
  if (!loaded) {
    return null;
  }
  
  // Fontlar yüklendi, özel splash ekranını göster - Suspense ile lazy loading kullanımı
  if (showCustomSplash) {
    return (
      <Suspense fallback={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#131326' }}>
        <ActivityIndicator size="large" color="#f1c40f" />
      </View>}>
        <CustomSplashScreen onFinish={() => setShowCustomSplash(false)} />
      </Suspense>
    );
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
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" />
      </Stack>
    </PaperProvider>
  );
}