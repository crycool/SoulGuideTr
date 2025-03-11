import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { theme } from '../../../../theme';
import { ThemeData } from '../../_services/dreamAnalyticsService';
import themeStore from '../../_utils/themeStore';

interface ThemesChartProps {
  themes: ThemeData[];
  onThemePress?: (theme: string) => void;
  scrollViewRef?: React.RefObject<any>; // ScrollView referansı için prop eklendi
}

const ThemesChart: React.FC<ThemesChartProps> = ({ themes, onThemePress, scrollViewRef: parentScrollViewRef }) => {
  const [chartThemes, setChartThemes] = useState<ThemeData[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
  
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

  useEffect(() => {
    // En çok 8 temayı göster (bar chart için)
    const displayThemes = themes.slice(0, 8);
    setChartThemes(displayThemes);
  }, [themes]);
  
  // Store'dan seçilen temayı kontrol et ve yükle
  useEffect(() => {
    if (themes.length === 0) return;
    
    // Store'dan seçili temayı al
    const selectedThemeName = themeStore.getSelectedTheme();
    if (selectedThemeName) {
      // Tema ismine göre bul
      const foundTheme = themes.find(t => t.name === selectedThemeName);
      if (foundTheme) {
        setSelectedTheme(foundTheme);
        // Gecikmeli scroll - daha uzun bekle
        setTimeout(() => {
          scrollToDetailCard();
        }, 700); // Sayfa geçişlerinde daha uzun bekleme süresi
      }
    }
  }, [themes]);

  const handleBarPress = (data: any) => {
    const index = data.index;
    const themeData = chartThemes[index];
    setSelectedTheme(themeData);
    
    // Temayı store'a kaydet
    themeStore.selectTheme(themeData.name);
    
    // Bileşenin render olması için önce bir gecikme ekle
    setTimeout(() => {
      // Sonra scroll işlemi yap (detailCardRef render edilmiş olacak)
      scrollToDetailCard();
    }, 100);
    
    if (onThemePress) {
      onThemePress(themeData.name);
    }
  };

  const closeDetails = () => {
    setSelectedTheme(null);
    // Store'dan temayı temizle
    themeStore.clearSelectedTheme();
  };

  const screenWidth = Dimensions.get('window').width - 32;

  // Eğer hiç tema yoksa
  if (themes.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Title title="Tema Analizi" />
        <Card.Content>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Henüz temalar hakkında yeterli veri bulunmamaktadır.
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  const chartData = {
    labels: chartThemes.map(t => t.name.substring(0, 5) + (t.name.length > 5 ? '...' : '')),
    datasets: [
      {
        data: chartThemes.map(t => t.value),
        colors: chartThemes.map(t => () => t.color),
      }
    ],
  };

  return (
    <Card style={styles.card}>
      <Card.Title 
        title="Tema Analizi" 
        subtitle={`Toplam ${themes.length} farklı tema`}
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />
      <Card.Content>
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Tema İsimleri</Text>
          <View style={styles.legendItems}>
            {chartThemes.map((theme, index) => (
              <TouchableOpacity 
                key={`legend-${index}`} 
                style={styles.legendItem}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedTheme(theme);
                  // Temayı store'a kaydet
                  themeStore.selectTheme(theme.name);
                  // Bileşenin render olması için önce bir gecikme ekle
                  setTimeout(() => {
                    // Sonra scroll işlemi yap (detailCardRef render edilmiş olacak)
                    scrollToDetailCard();
                  }, 100);
                  onThemePress && onThemePress(theme.name);
                }}
              >
                <View style={[styles.legendColor, { backgroundColor: theme.color }]} />
                <Text style={styles.legendText}>{theme.name} <Text style={styles.clickHint}>→</Text></Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            fromZero
            verticalLabelRotation={45}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
              labelColor: (opacity = 1) => theme.colors.text,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.55,
              showValuesOnTopOfBars: true,
              withInnerLines: false
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            onDataPointClick={handleBarPress}
          />
        </View>

        {selectedTheme && (
          <View 
            ref={detailCardRef}
            style={styles.detailsContainer}
          >
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>
                {selectedTheme.name}
              </Text>
              <TouchableOpacity onPress={closeDetails}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.detailsText}>
              Bu tema {selectedTheme.value} rüyada görüldü
            </Text>
            <View 
              style={[styles.detailsBar, { backgroundColor: selectedTheme.color }]} 
            />
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => onThemePress && onThemePress(selectedTheme.name)}
            >
              <Text style={styles.viewButtonText}>
                Bu tema ile ilgili rüyaları gör
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {chartThemes.length < themes.length && (
          <View style={styles.moreThemesContainer}>
            <Text style={styles.moreThemesTitle}>Diğer Temalar</Text>
            <View style={styles.moreThemesList}>
              {themes.slice(8).map((themeItem, index) => (
                <TouchableOpacity 
                  key={`more-theme-${index}`}
                  style={styles.moreThemeItem}
                  onPress={() => {
                    setSelectedTheme(themeItem);
                    // Temayı store'a kaydet
                    themeStore.selectTheme(themeItem.name);
                    // Bileşenin render olması için önce bir gecikme ekle
                    setTimeout(() => {
                      // Sonra scroll işlemi yap (detailCardRef render edilmiş olacak)
                      scrollToDetailCard();
                    }, 100);
                    onThemePress && onThemePress(themeItem.name);
                  }}
                >
                  <View 
                    style={[
                      styles.moreThemeColor, 
                      { backgroundColor: themeItem.color }
                    ]} 
                  />
                  <Text style={styles.moreThemeText}>
                    {themeItem.name} ({themeItem.value})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  cardSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  chartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(30, 30, 45, 0.7)',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  legendTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: theme.spacing.xs,
    paddingRight: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
  legendText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    flexShrink: 1,
  },
  clickHint: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  detailsContainer: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: 'rgba(30, 30, 45, 0.7)',
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
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
    color: theme.colors.primary,
  },
  closeButton: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
    opacity: 0.6,
  },
  detailsText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detailsBar: {
    height: 8,
    width: '100%',
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  viewButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  viewButtonText: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  moreThemesContainer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(30, 30, 45, 0.7)',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  moreThemesTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  moreThemesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moreThemeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: theme.spacing.sm,
  },
  moreThemeColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  moreThemeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
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

export default ThemesChart;
