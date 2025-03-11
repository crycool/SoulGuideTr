import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TooltipProps } from 'react-native';
import { Card, Chip, Tooltip } from 'react-native-paper';
import { SymbolData } from '../../_services/dreamAnalyticsService';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../../../../theme';
import symbolStore from '../../_utils/symbolStore';

interface SymbolsCloudProps {
  symbols: SymbolData[];
  scrollViewRef?: React.RefObject<any>; // ScrollView referansı için prop ekledim
}

const SymbolsCloud: React.FC<SymbolsCloudProps> = ({ symbols, scrollViewRef: parentScrollViewRef }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolData | null>(null);
  const router = useRouter();

  const screenWidth = Dimensions.get('window').width - 64;
  
  // ScrollView ve detay kartı referansları
  const scrollViewRef = parentScrollViewRef || useRef<any>(null);
  const detailCardRef = useRef<View>(null);
  
  // Güvenilir scroll fonksiyonu
  const scrollToDetailCard = () => {
    if (!detailCardRef.current || !scrollViewRef.current) {
      console.log("Referanslar henüz hazır değil, tekrar deneniyor...");
      // Eğer referanslar henüz hazır değilse, tekrar dene
      setTimeout(() => scrollToDetailCard(), 100);
      return;
    }

    try {
      // requestAnimationFrame kullanarak bir sonraki render döngüsünde ölçüm yap
      requestAnimationFrame(() => {
        detailCardRef.current.measureLayout(
          scrollViewRef.current.getInnerViewNode ? 
            scrollViewRef.current.getInnerViewNode() : 
            scrollViewRef.current,
          (x, y, width, height) => {
            // Ölçülen y pozisyonundan 80px offset çıkararak scroll et
            scrollViewRef.current.scrollTo({ y: Math.max(0, y - 80), animated: true });
          },
          () => {
            // Ölçüm başarısız olursa yedek plan
            console.log("Ölçüm başarısız, yedek plan kullanılıyor");
            scrollViewRef.current.scrollTo({ y: 500, animated: true });
          }
        );
      });
    } catch (error) {
      console.error('Scroll ölçümü hatası:', error);
      // Hata durumunda sağlam bir yedek strateji
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 500, animated: true });
        }
      }, 200);
    }
  };
  
  // Store'dan seçilen sembolü kontrol et ve yükle
  useEffect(() => {
    if (symbols.length === 0) return;
    
    // Store'dan seçili sembolü al
    const selectedSymbolName = symbolStore.getSelectedSymbol();
    if (selectedSymbolName) {
      // Sembol ismine göre bul
      const foundSymbol = symbols.find(s => s.text === selectedSymbolName);
      if (foundSymbol) {
        setSelectedSymbol(foundSymbol);
        // Gecikmeli scroll - daha uzun bekle
        setTimeout(() => {
          scrollToDetailCard();
        }, 700); // Sayfa geçişlerinde daha uzun bekleme süresi
      }
    }
  }, [symbols]);
  
  const handleSymbolPress = (symbol: SymbolData) => {
    // Aynı sembole tıklandığında toggle 
    if (selectedSymbol && selectedSymbol.text === symbol.text) {
      setSelectedSymbol(null);
      symbolStore.clearSelectedSymbol();
      return;
    }
    
    // Seçilen sembolü state'e ve store'a kaydet
    setSelectedSymbol(symbol);
    symbolStore.selectSymbol(symbol.text);
    
    // Bileşenin render olması için önce bir gecikme ekle
    setTimeout(() => {
      // Sonra scroll işlemi yap (detailCardRef render edilmiş olacak)
      scrollToDetailCard();
    }, 100);
  };

  const closeDetails = () => {
    setSelectedSymbol(null);
    symbolStore.clearSelectedSymbol();
  };

  // Boş veri kontrolü
  if (symbols.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Title title="Sembol Bulutu" titleStyle={{color: theme.colors.primary, fontWeight: theme.typography.fontWeight.bold, fontSize: theme.typography.fontSize.lg}} />
        <Card.Content>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Henüz sembol analizi için yeterli veri bulunmamaktadır.
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  // Sembol boyutlarını hesapla
  const maxValue = Math.max(...symbols.map(s => s.value));
  const minValue = Math.min(...symbols.map(s => s.value));
  const valueRange = maxValue - minValue;
  
  const calculateFontSize = (value: number) => {
    // 12 ile 24 punto arasında ölçeklendir
    const minFont = 12;
    const maxFont = 24;
    const fontRange = maxFont - minFont;
    
    if (valueRange === 0) return minFont; // Tüm değerler aynıysa
    
    const normalizedValue = (value - minValue) / valueRange;
    return minFont + (normalizedValue * fontRange);
  };
  
  const calculateOpacity = (value: number) => {
    // 0.7 ile 1.0 arasında ölçeklendir
    const minOpacity = 0.7;
    const maxOpacity = 1.0;
    
    if (valueRange === 0) return maxOpacity; // Tüm değerler aynıysa
    
    const normalizedValue = (value - minValue) / valueRange;
    return minOpacity + (normalizedValue * (maxOpacity - minOpacity));
  };

  return (
    <Card style={styles.card}>
      {/* Dialog artık kullanılmıyor */}
      <Card.Title 
        title="Sembol Bulutu" 
        titleStyle={{color: theme.colors.primary, fontWeight: theme.typography.fontWeight.bold, fontSize: theme.typography.fontSize.lg}}
        subtitle={`${symbols.length} farklı sembol`}
        subtitleStyle={{color: theme.colors.textSecondary}}
      />
      <Card.Content>
        <View style={styles.cloudContainer}>
          {symbols.map((symbol, index) => (
            <Tooltip title="Tıkla: Sembol hakkında bilgi al" key={`symbol-tooltip-${index}`}>
              <TouchableOpacity
                key={`symbol-${index}`}
                style={[
                  styles.symbolContainer,
                  { 
                    backgroundColor: `${symbol.color}20`,
                    borderColor: symbol.color,
                  }
                ]}
                onPress={() => handleSymbolPress(symbol)}
              >
                <Text
                  style={[
                    styles.symbolText,
                    {
                      fontSize: calculateFontSize(symbol.value),
                      opacity: calculateOpacity(symbol.value),
                      color: symbol.color,
                    }
                  ]}
                >
                  {symbol.text}
                </Text>
              </TouchableOpacity>
            </Tooltip>
          ))}
        </View>

        {selectedSymbol && (
          <Animated.View 
            ref={detailCardRef}
            style={styles.detailsContainer}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <View style={styles.detailsHeader}>
              <Text style={[styles.detailsTitle, { color: selectedSymbol.color }]}>
                {selectedSymbol.text}
              </Text>
              <TouchableOpacity onPress={closeDetails} style={styles.closeButtonContainer}>
              <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.detailsText}>
              Bu sembol {selectedSymbol.value} rüyanızda görüldü.
            </Text>
            <View style={styles.detailsActions}>
              <TouchableOpacity 
                style={[styles.optionButton, { backgroundColor: '#3498db' }]} 
                onPress={() => {
                  router.push({
                    pathname: '/(tabs)/dream/symbol-info',
                    params: { symbol: selectedSymbol.text }
                  });
                }}
              >
                <Ionicons name="book-outline" size={22} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Sembolün Anlamını Göster</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.optionButton, { backgroundColor: '#9b59b6' }]} 
                onPress={() => {
                  router.push({
                    pathname: '/(tabs)/dream/archive',
                    params: { symbolFilter: selectedSymbol.text }
                  });
                  // Sembolü store'da sakladık, geri dönüldüğünde kullanılacak
                }}
              >
                <Ionicons name="list-outline" size={22} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Sembollü Rüyalarımı Göster</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        
        <View style={styles.legendContainer}>
          <View style={styles.legendRow}>
            <MaterialCommunityIcons name="information-outline" size={16} color={theme.colors.text} />
            <Text style={styles.legendText}>
              Sembol büyüklüğü sıklığa göre değişir. Büyük semboller daha sık görülür.
            </Text>
          </View>
          <View style={styles.legendRow}>
            <MaterialCommunityIcons name="gesture-tap" size={16} color={theme.colors.text} />
            <Text style={styles.legendText}>
              Sembol detayları için sembole tıklayın.
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.md,
  },
  cloudContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    minHeight: 180,
  },
  symbolContainer: {
    padding: theme.spacing.sm,
    margin: theme.spacing.xs,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    ...theme.shadows.sm,
  },
  symbolText: {
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
  detailsContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    ...theme.shadows.sm,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  detailsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  closeButtonContainer: {
    padding: 5,
  },
  detailsText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  detailsActions: {
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  legendContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  legendText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    opacity: 0.7,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default SymbolsCloud;
