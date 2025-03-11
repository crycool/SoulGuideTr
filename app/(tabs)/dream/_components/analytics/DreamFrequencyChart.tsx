import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card, SegmentedButtons } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { FrequencyData } from '../../_services/dreamAnalyticsService';
import { theme } from '../../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DreamFrequencyChartProps {
  frequencyData: FrequencyData[];
}

const DreamFrequencyChart: React.FC<DreamFrequencyChartProps> = ({ frequencyData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [periodData, setPeriodData] = useState<FrequencyData[]>([]);
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [{ data: [] }]
  });

  // Ekran genişliği
  const screenWidth = Dimensions.get('window').width - 32;

  // Seçilen periyoda göre veriyi filtrele
  useEffect(() => {
    // Seçilen periyoda göre filtrele
    let filteredData = [...frequencyData];
    
    // Yalnızca toplam verilerini göster (type belirtilmemiş olanlar)
    filteredData = filteredData.filter(item => !item.type);
    
    // Veriyi periyoda uygun olarak biçimlendir
    const formattedData = filteredData.map(item => {
      let label = '';
      
      if (selectedPeriod === 'week') {
        // 2023-W01 formatını W01 olarak kısalt
        const match = item.period.match(/\d{4}-W(\d{2})/);
        label = match ? `H${match[1]}` : item.period;
      } else {
        // 2023-01 formatını Oca olarak kısalt
        const match = item.period.match(/\d{4}-(\d{2})/);
        const monthNum = match ? parseInt(match[1]) : 0;
        const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        label = monthNum > 0 && monthNum <= 12 ? monthNames[monthNum - 1] : item.period;
      }
      
      return {
        ...item,
        formattedLabel: label
      };
    });
    
    setPeriodData(formattedData);
    
    // Grafik verisini oluştur
    if (formattedData.length > 0) {
      setChartData({
        labels: formattedData.map(d => d.formattedLabel),
        datasets: [{
          data: formattedData.map(d => d.count),
          colors: formattedData.map(() => () => theme.colors.primary)
        }]
      });
    }
  }, [frequencyData, selectedPeriod]);

  // Periyot değiştirme
  const handlePeriodChange = (value: 'week' | 'month') => {
    setSelectedPeriod(value);
  };

  // Boş veri kontrolü
  if (frequencyData.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Title title="Rüya Kayıt Sıklığı" />
        <Card.Content>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Henüz rüya sıklığı analizi için yeterli veri bulunmamaktadır.
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  // Grafik için renk konfigürasyonu
  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16
    },
    barPercentage: 0.8,
  };

  // İstatistikler
  const totalDreams = periodData.reduce((sum, item) => sum + item.count, 0);
  const avgPerPeriod = totalDreams / (periodData.length || 1);
  const maxDreams = Math.max(...periodData.map(item => item.count), 0);
  const periodWithMostDreams = periodData.find(item => item.count === maxDreams);

  return (
    <Card style={styles.card}>
      <Card.Title 
        title="Rüya Kayıt Sıklığı" 
        subtitle={`Toplam ${totalDreams} rüya`}
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />
      <Card.Content>
        {/* Periyot seçimi */}
        <View style={styles.periodSelectorContainer}>
          <SegmentedButtons
            value={selectedPeriod}
            onValueChange={(value) => handlePeriodChange(value as 'week' | 'month')}
            buttons={[
              { value: 'week', label: 'Haftalık' },
              { value: 'month', label: 'Aylık' }
            ]}
            style={styles.segmentedButtons}
          />
        </View>
        
        {/* Grafik */}
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
            showValuesOnTopOfBars
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        
        {/* İstatistikler */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="book-open-variant" size={22} color={theme.colors.primary} style={styles.statIcon} />
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>
                Toplam Rüya
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {totalDreams}
              </Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="chart-timeline-variant" size={22} color="#3498db" style={styles.statIcon} />
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>
                Ortalama / {selectedPeriod === 'week' ? 'Hafta' : 'Ay'}
              </Text>
              <Text style={[styles.statValue, { color: "#3498db" }]}>
                {avgPerPeriod.toFixed(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="arrow-up-bold" size={22} color="#2ecc71" style={styles.statIcon} />
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>
                En Yüksek
              </Text>
              <Text style={[styles.statValue, { color: "#2ecc71" }]}>
                {maxDreams}
              </Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="calendar-clock" size={22} color="#9b59b6" style={styles.statIcon} />
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>
                En Aktif Dönem
              </Text>
              <Text style={[styles.statValue, { color: "#9b59b6" }]}>
                {periodWithMostDreams?.formattedLabel || '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Aktivite İpuçları */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsHeader}>
            <MaterialCommunityIcons name="lightbulb-outline" size={22} color={theme.colors.primary} />
            <Text style={styles.tipsTitle}>Aktivite İpuçları</Text>
          </View>
          
          <View style={styles.tipsContent}>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={theme.colors.primary} style={{marginRight: 8}} />
              <Text style={styles.tipText}>
                {avgPerPeriod < 1 
                  ? 'Rüyalarınızı daha düzenli kaydetmeyi deneyin. Günlük hatırlatıcılar ayarlayabilirsiniz.'
                  : avgPerPeriod < 3
                  ? 'İyi gidiyorsunuz! Rüya günlüğü tutmaya devam edin ve hatırlamaya çalışın.'
                  : 'Harika bir rüya kayıt sıklığınız var! Daha derinlemesine analizler için rüya detaylarını zenginleştirmeyi deneyin.'}
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={theme.colors.primary} style={{marginRight: 8}} />
              <Text style={styles.tipText}>
                Uyumadan önce "rüyamı hatırlayacağım" niyetini belirlemek rüya hatırlama oranınızı artırabilir.
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={theme.colors.primary} style={{marginRight: 8}} />
              <Text style={styles.tipText}>
                {selectedPeriod === 'week' 
                  ? 'Haftanın belirli günlerinde daha fazla rüya hatırlıyor olabilirsiniz. Hafta içi/sonu uyku düzeninizi gözlemleyin.'
                  : 'Mevsimsel değişimler ve ay döngüleri rüya görme sıklığınızı etkileyebilir.'}
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
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  cardSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  periodSelectorContainer: {
    marginBottom: theme.spacing.md,
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(30, 30, 45, 0.7)',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  statItem: {
    width: '48%',
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: theme.spacing.sm,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  tipsContainer: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(30, 30, 45, 0.7)',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    paddingBottom: theme.spacing.sm,
  },
  tipsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  tipsContent: {
    gap: theme.spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
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

export default DreamFrequencyChart;
