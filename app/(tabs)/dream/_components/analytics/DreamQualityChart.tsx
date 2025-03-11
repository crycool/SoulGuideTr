import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { QualityData } from '../../_services/dreamAnalyticsService';
import { theme } from '../../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DreamQualityChartProps {
  qualityData: QualityData[];
}

const DreamQualityChart: React.FC<DreamQualityChartProps> = ({ qualityData }) => {
  const [showMA, setShowMA] = useState(true);
  const [showClarity, setShowClarity] = useState(true);
  const [showSleepQuality, setShowSleepQuality] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<QualityData | null>(null);

  // Ekran genişliği
  const screenWidth = Dimensions.get('window').width - 32;

  // Tarih formatını düzenleme
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'd MMM', { locale: tr });
    } catch (e) {
      return dateString;
    }
  };

  // Veri noktalarına tıklama
  const handleDataPointClick = (data: any) => {
    const pointIndex = data.index;
    if (pointIndex >= 0 && pointIndex < qualityData.length) {
      setSelectedPoint(qualityData[pointIndex]);
    }
  };

  // Filtreleme seçeneklerini oluşturma
  const toggleSeries = (series: 'clarity' | 'sleepQuality' | 'ma') => {
    if (series === 'clarity') {
      setShowClarity(!showClarity);
    } else if (series === 'sleepQuality') {
      setShowSleepQuality(!showSleepQuality);
    } else if (series === 'ma') {
      setShowMA(!showMA);
    }
  };

  // Boş veri kontrolü
  if (qualityData.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Title title="Rüya Kalitesi Trendi" />
        <Card.Content>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Henüz rüya kalitesi trendi için yeterli veri bulunmamaktadır.
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  // Grafik için veri hazırlama
  // Boş veya eksik veri durumlarına karşı koruma ekleyelim
  const datasets = [];
  const legends = [];
  
  // Rüya netliği verisi
  if (showClarity) {
    datasets.push({
      data: qualityData.map(d => d.clarity),
      color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
      strokeWidth: 2
    });
    legends.push('Rüya Netliği');
  }
  
  // Uyku kalitesi verisi
  if (showSleepQuality) {
    datasets.push({
      data: qualityData.map(d => d.sleepQuality),
      color: (opacity = 1) => `rgba(234, 67, 53, ${opacity})`,
      strokeWidth: 2
    });
    legends.push('Uyku Kalitesi');
  }
  
  // Eğer hiçbir seri seçili değilse, bir varsayılan dahil et
  if (datasets.length === 0) {
    datasets.push({
      data: [0, 0],
      color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
      strokeWidth: 2
    });
    legends.push('Veri yok');
  }
  
  const chartData = {
    labels: qualityData.map(d => formatDate(d.date)),
    datasets,
    legend: legends
  };

  return (
    <Card style={styles.card}>
      <Card.Title 
        title="Rüya Kalitesi Trendi" 
        titleStyle={{color: theme.colors.primary, fontWeight: theme.typography.fontWeight.bold, fontSize: theme.typography.fontSize.lg}}
        subtitle={`Son ${qualityData.length} gün`}
        subtitleStyle={{color: theme.colors.textSecondary}}   
      />
      <Card.Content>
        {/* Filtre kontrolleri */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              { backgroundColor: showClarity ? 'rgba(66, 133, 244, 0.2)' : theme.colors.surface }
            ]}
            onPress={() => toggleSeries('clarity')}
          >
            <View style={styles.filterButtonContent}>
              <View style={[styles.colorIndicator, { backgroundColor: 'rgba(66, 133, 244, 1)' }]} />
              <Text style={styles.filterText}>Rüya Netliği</Text>
            </View>
            <MaterialCommunityIcons 
              name={showClarity ? "check-circle" : "circle-outline"} 
              size={18} 
              color="rgba(66, 133, 244, 1)" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              { backgroundColor: showSleepQuality ? 'rgba(234, 67, 53, 0.2)' : theme.colors.surface }
            ]}
            onPress={() => toggleSeries('sleepQuality')}
          >
            <View style={styles.filterButtonContent}>
              <View style={[styles.colorIndicator, { backgroundColor: 'rgba(234, 67, 53, 1)' }]} />
              <Text style={styles.filterText}>Uyku Kalitesi</Text>
            </View>
            <MaterialCommunityIcons 
              name={showSleepQuality ? "check-circle" : "circle-outline"} 
              size={18} 
              color="rgba(234, 67, 53, 1)" 
            />
          </TouchableOpacity>
          
          {/* Hareketli ortalama filtresi - şu an devre dışı */}
          {/* {'clarityMA' in qualityData[0] && (
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                { backgroundColor: showMA ? 'rgba(0, 0, 0, 0.1)' : theme.colors.surface }
              ]}
              onPress={() => toggleSeries('ma')}
            >
              <View style={styles.filterButtonContent}>
                <MaterialCommunityIcons name="chart-line" size={18} color={theme.colors.text} />
                <Text style={styles.filterText}>Hareketli Ortalama</Text>
              </View>
              <MaterialCommunityIcons 
                name={showMA ? "check-circle" : "circle-outline"} 
                size={18} 
                color={theme.colors.text} 
              />
            </TouchableOpacity>
          )} */}
        </View>

        {/* Grafik */}
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            fromZero
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
              labelColor: (opacity = 1) => theme.colors.text,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: theme.colors.surface
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: theme.colors.divider,
                strokeOpacity: 0.3
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
            onDataPointClick={handleDataPointClick}
            verticalLabelRotation={30}
          />
        </View>

        {/* Seçilen nokta detayları */}
        {selectedPoint && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>
                {formatDate(selectedPoint.date)}
              </Text>
              <TouchableOpacity onPress={() => setSelectedPoint(null)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.detailsMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Rüya Netliği:</Text>
                <Text style={[styles.metricValue, { color: 'rgba(66, 133, 244, 1)' }]}>
                  {selectedPoint.clarity.toFixed(1)}/5
                </Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Uyku Kalitesi:</Text>
                <Text style={[styles.metricValue, { color: 'rgba(234, 67, 53, 1)' }]}>
                  {selectedPoint.sleepQuality.toFixed(1)}/5
                </Text>
              </View>
              
              {/* Hareketli ortalama bilgisini geçici olarak gizledik */}
            </View>

            <Chip 
              mode="outlined" 
              style={styles.detailsChip}
              textStyle={{ color: theme.colors.primary }}
              icon="calendar"
            >
              Bu tarihteki rüyaları gör
            </Chip>
          </View>
        )}

        {/* Eğilimler - şu an hatalara neden olduğu için komple yorum satırı yapıldı */}
        {/* 
        <View style={styles.trendsContainer}>
          <Text style={styles.trendsTitle}>Eğilimler</Text>
          {qualityData.length >= 7 && (
            <View style={styles.trendsList}>
              {qualityData[qualityData.length - 1].clarityMA !== undefined && (
                <View style={styles.trendItem}>
                  <MaterialCommunityIcons 
                    name={
                      qualityData[qualityData.length - 1].clarityMA! > qualityData[0].clarityMA!
                        ? "trending-up"
                        : qualityData[qualityData.length - 1].clarityMA! < qualityData[0].clarityMA!
                        ? "trending-down"
                        : "trending-neutral"
                    } 
                    size={20} 
                    color={
                      qualityData[qualityData.length - 1].clarityMA! > qualityData[0].clarityMA!
                        ? 'green'
                        : qualityData[qualityData.length - 1].clarityMA! < qualityData[0].clarityMA!
                        ? 'red'
                        : 'grey'
                    } 
                  />
                  <Text style={styles.trendText}>
                    Rüya netliğiniz son 7 günde {
                      qualityData[qualityData.length - 1].clarityMA! > qualityData[0].clarityMA!
                        ? 'artıyor'
                        : qualityData[qualityData.length - 1].clarityMA! < qualityData[0].clarityMA!
                        ? 'azalıyor'
                        : 'sabit'
                    }
                  </Text>
                </View>
              )}
              
              {qualityData[qualityData.length - 1].sleepQualityMA !== undefined && (
                <View style={styles.trendItem}>
                  <MaterialCommunityIcons 
                    name={
                      qualityData[qualityData.length - 1].sleepQualityMA! > qualityData[0].sleepQualityMA!
                        ? "trending-up"
                        : qualityData[qualityData.length - 1].sleepQualityMA! < qualityData[0].sleepQualityMA!
                        ? "trending-down"
                        : "trending-neutral"
                    } 
                    size={20} 
                    color={
                      qualityData[qualityData.length - 1].sleepQualityMA! > qualityData[0].sleepQualityMA!
                        ? 'green'
                        : qualityData[qualityData.length - 1].sleepQualityMA! < qualityData[0].sleepQualityMA!
                        ? 'red'
                        : 'grey'
                    } 
                  />
                  <Text style={styles.trendText}>
                    Uyku kaliteniz son 7 günde {
                      qualityData[qualityData.length - 1].sleepQualityMA! > qualityData[0].sleepQualityMA!
                        ? 'artıyor'
                        : qualityData[qualityData.length - 1].sleepQualityMA! < qualityData[0].sleepQualityMA!
                        ? 'azalıyor'
                        : 'sabit'
                    }
                  </Text>
                </View>
              )}
              
              {qualityData[qualityData.length - 1].clarityMA !== undefined && 
                qualityData[qualityData.length - 1].sleepQualityMA !== undefined && (
                <View style={styles.trendItem}>
                  <MaterialCommunityIcons name="compare" size={20} color={theme.colors.text} />
                  <Text style={styles.trendText}>
                    Rüya netliği ve uyku kalitesi arasında {
                      Math.abs(
                        (qualityData[qualityData.length - 1].clarityMA! - qualityData[0].clarityMA!) -
                        (qualityData[qualityData.length - 1].sleepQualityMA! - qualityData[0].sleepQualityMA!)
                      ) < 1
                        ? 'güçlü bir ilişki'
                        : 'zayıf bir ilişki'
                    } var
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        */}
        
        {/* Basit eğilim mesajı */}
        <View style={styles.trendsContainer}>
          <Text style={styles.trendsTitle}>Eğilimler</Text>
          <View style={styles.trendsList}>
            <View style={styles.trendItem}>
              <MaterialCommunityIcons name="information-outline" size={20} color={theme.colors.text} />
              <Text style={styles.trendText}>
                {qualityData.length < 7 
                  ? 'Eğilim analizi için en az 7 günlük veri gereklidir.'
                  : 'Daha detaylı eğilim analizleri için daha fazla rüya kaydetmeye devam edin.'}
              </Text>
            </View>
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
  filtersContainer: {
    marginBottom: theme.spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    ...theme.shadows.sm,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  detailsContainer: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(30, 30, 45, 0.7)',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
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
  detailsMetrics: {
    marginBottom: theme.spacing.md,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  metricValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  detailsChip: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing.sm,
  },
  trendsContainer: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(30, 30, 45, 0.7)',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  trendsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  trendsList: {
    gap: theme.spacing.md,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
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

export default DreamQualityChart;