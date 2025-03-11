import { useEffect } from 'react';
import { InteractionManager } from 'react-native';

/**
 * Performans izleme bileşeni
 * Bu bileşen geliştirme sırasında React Native uygulamasının performansını izlemenize yardımcı olur.
 * 
 * Kullanımı:
 * 1. Sadece geliştirme modunda etkinleştirin
 * 2. Ana ekranda veya ana layout bileşeninde kullanın
 * 
 * NOT: Bu bileşeni sadece geliştirme aşamasında kullanın, canlı uygulamaya dahil etmeyin.
 */
export const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    if (__DEV__) {
      console.log('PerformanceMonitor: İzleme başladı');
      
      // Render süresini izleme
      const startTime = Date.now();
      
      InteractionManager.runAfterInteractions(() => {
        const endTime = Date.now();
        console.log(`PerformanceMonitor: Ekran yükleme süresi: ${endTime - startTime}ms`);
      });
      
      // Uzun JS görevlerini tespit etme (hiz problemlerini tanımlamak için)
      const interval = setInterval(() => {
        const now = Date.now();
        const frameDuration = now - startTime;
        if (frameDuration > 500) {
          console.log(`PerformanceMonitor: Uzun JS görevi tespit edildi: ${frameDuration}ms`);
        }
      }, 1000);
      
      return () => {
        clearInterval(interval);
        console.log('PerformanceMonitor: İzleme durduruldu');
      };
    }
    
    return undefined;
  }, []);
  
  // Hiçbir UI render etmez
  return null;
};

export default PerformanceMonitor;