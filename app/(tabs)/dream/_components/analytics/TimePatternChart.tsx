import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card, SegmentedButtons } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TimePatternData } from '../../_services/dreamAnalyticsService';
import { theme } from '../../../../theme';

interface TimePatternChartProps {
  timePatterns: TimePatternData;
}

const TimePatternChart: React.FC<TimePatternChartProps> = ({ timePatterns }) => {
  const [activeTab, setActiveTab] = useState<'day' | 'time'>('day');
  
  // Ekran genişliği
  const screenWidth = Dimensions.get('window').width - 32;
  
  // Grafik verisi oluşturma
  const formatDayData = () => {
    // Haftanın günleri için doğru sıralama
    const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    
    const labels = dayNames;
    const values = dayNames.map(day => timePatterns.dayOfWeek[day] || 0);
    
    return {
      labels,
      datasets: [{
        data: values,
        colors: dayNames.map((_, i) => {
          return () => {
            // Hafta içi/hafta sonu için farklı renkler
            return i < 5 ? 'rgba(66, 133, 244, 0.8)' : 'rgba(234, 67, 53, 0.8)';
          }
        })
      }]
    };
  };
  
  const formatTimeData = () => {
    // Zaman dilimleri için doğru sıralama
    const timeSlots = {
      'Gece Yarısı (01:00-04:59)': 'Gece Yarısı',
      'Sabah (05:00-08:59)': 'Sabah',
      'Öğle (09:00-12:59)': 'Öğle',
      'İkindi (13:00-16:59)': 'İkindi',
      'Akşam (17:00-20:59)': 'Akşam',
      'Gece (21:00-00:59)': 'Gece'
    };
    
    const slotKeys = Object.keys(timeSlots);
    const labels = slotKeys.map(slot => timeSlots[slot]);
    const values = slotKeys.map(slot => timePatterns.timeOfDay[slot] || 0);
    
    return {
      labels,
      datasets: [{
        data: values,
        colors: slotKeys.map((slot, i) => {
          return () => {
            // Gündüz/gece için farklı renkler
            const isNight = slot.includes('Gece') || slot.includes('Yarısı');
            return isNight ? 'rgba(75, 0, 130, 0.8)' : 'rgba(255, 165, 0, 0.8)';
          }
        })
      }]
    };
  };
  
  const chartData = activeTab === 'day' ? formatDayData() : formatTimeData();
  
  // İstatistikler oluşturma
  const getDayStats = () => {
    const days = Object.keys(timePatterns.dayOfWeek);
    const counts = Object.values(timePatterns.dayOfWeek);
    
    if (counts.length === 0) return { max: 'Veri yok', maxCount: 0, total: 0 };
    
    const maxIndex = counts.indexOf(Math.max(...counts));
    const maxDay = maxIndex !== -1 ? days[maxIndex] : 'Veri yok';
    const maxCount = Math.max(...counts);
    const total = counts.reduce((sum, c) => sum + c, 0);
    
    const weekdayTotal = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
      .reduce((sum, day) => sum + (timePatterns.dayOfWeek[day] || 0), 0);
    
    const weekendTotal = ['Cumartesi', 'Pazar']
      .reduce((sum, day) => sum + (timePatterns.dayOfWeek[day] || 0), 0);
      
    return { 
      max: maxDay, 
      maxCount, 
      total,
      weekdayTotal,
      weekendTotal,
      weekdayAvg: weekdayTotal / 5,
      weekendAvg: weekendTotal / 2
    };
  };
  
  const getTimeStats = () => {
    const slots = Object.keys(timePatterns.timeOfDay);
    const counts = Object.values(timePatterns.timeOfDay);
    
    if (counts.length === 0) return { max: 'Veri yok', maxCount: 0, total: 0 };
    
    const maxIndex = counts.indexOf(Math.max(...counts));
    const maxSlot = maxIndex !== -1 ? slots[maxIndex] : 'Veri yok';
    const maxCount = Math.max(...counts);
    const total = counts.reduce((sum, c) => sum + c, 0);
    
    const nightSlots = ['Gece Yarısı (01:00-04:59)', 'Gece (21:00-00:59)'];
    const daySlots = ['Sabah (05:00-08:59)', 'Öğle (09:00-12:59)', 'İkindi (13:00-16:59)', 'Akşam (17:00-20:59)'];
    
    const nightTotal = nightSlots.reduce((sum, slot) => sum + (timePatterns.timeOfDay[slot] || 0), 0);
    const dayTotal = daySlots.reduce((sum, slot) => sum + (timePatterns.timeOfDay[slot] || 0), 0);
    
    return { 
      max: maxSlot, 
      maxCount, 
      total,
      nightTotal,
      dayTotal,
      nightPercentage: (nightTotal / (total || 1)) * 100,
      dayPercentage: (dayTotal / (total || 1)) * 100
    };
  };
  
  const dayStats = getDayStats();
  const timeStats = getTimeStats();
  
  // Boş veri kontrolü
  const hasNoData = Object.values(timePatterns.dayOfWeek).every(v => v === 0) && 
                    Object.values(timePatterns.timeOfDay).every(v => v === 0);
  
  if (hasNoData) {
    return (
      <Card style={styles.card}>
        <Card.Title title="Rüya Zamanı Analizi" />
        <Card.Content>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Henüz rüya zamanı analizi için yeterli veri bulunmamaktadır.
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Title 
        title="Rüya Zamanı Analizi" 
        subtitle="Rüyalarınızın zaman örüntüleri"
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />
      <Card.Content>
        {/* Tab seçimi */}
        <View style={styles.tabContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'day' | 'time')}
            buttons={[
              { value: 'day', label: 'Haftanın Günleri', icon: 'calendar-week' },
              { value: 'time', label: 'Günün Saatleri', icon: 'clock-outline' }
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
            chartConfig={{
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
            }}
            verticalLabelRotation={30}
            fromZero
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        
        {/* İstatistikler */}
        {activeTab === 'day' ? (
          <View style={styles.statsContainer}>
            <View style={styles.statGroup}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>En Aktif Gün</Text>
                <Text style={styles.statValue}>{dayStats.max}</Text>
                <Text style={styles.statSubtext}>{dayStats.maxCount} rüya</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Hafta İçi / Hafta Sonu</Text>
                <View style={styles.compareContainer}>
                  <View style={styles.compareItem}>
                    <Text style={styles.compareValue}>{dayStats.weekdayAvg.toFixed(1)}</Text>
                    <Text style={styles.compareLabel}>Hafta İçi Ort.</Text>
                  </View>
                  <View style={[styles.compareDivider, { backgroundColor: theme.colors.border }]} />
                  <View style={styles.compareItem}>
                    <Text style={styles.compareValue}>{dayStats.weekendAvg.toFixed(1)}</Text>
                    <Text style={styles.compareLabel}>Hafta Sonu Ort.</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.insightContainer}>
              <MaterialCommunityIcons name="lightbulb-outline" size={18} color={theme.colors.accent} />
              <Text style={styles.insightText}>
                {dayStats.weekdayAvg > dayStats.weekendAvg 
                  ? 'Hafta içi daha fazla rüya hatırlıyorsunuz. İş günlerinde uyku düzeniniz daha düzenli olabilir.'
                  : 'Hafta sonu daha fazla rüya hatırlıyorsunuz. Daha uzun uyumanız REM uykusunu artırabilir.'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.statsContainer}>
            <View style={styles.statGroup}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>En Aktif Zaman</Text>
                <Text style={styles.statValue}>{timeStats.max.split(' ')[0]}</Text>
                <Text style={styles.statSubtext}>{timeStats.maxCount} rüya</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Gündüz / Gece</Text>
                <View style={styles.compareContainer}>
                  <View style={styles.compareItem}>
                    <Text style={styles.compareValue}>{timeStats.dayPercentage.toFixed(0)}%</Text>
                    <Text style={styles.compareLabel}>Gündüz</Text>
                  </View>
                  <View style={[styles.compareDivider, { backgroundColor: theme.colors.border }]} />
                  <View style={styles.compareItem}>
                    <Text style={styles.compareValue}>{timeStats.nightPercentage.toFixed(0)}%</Text>
                    <Text style={styles.compareLabel}>Gece</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.insightContainer}>
              <MaterialCommunityIcons name="lightbulb-outline" size={18} color={theme.colors.accent} />
              <Text style={styles.insightText}>
                {timeStats.nightPercentage > 50 
                  ? 'Gece saatlerinde daha fazla rüya görmeniz, derin uyku ve REM dönemlerinin bu saatlerde yoğunlaştığını gösterebilir.'
                  : 'Gündüz saatlerinde rüya görmeniz, gün içi kısa uyku (şekerleme) alışkanlığınız olabileceğini gösterir.'}
              </Text>
            </View>
          </View>
        )}
        
        {/* Tavsiyeler */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Uyku Düzeni Tavsiyeleri</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Düzenli bir uyku programı takip edin, hafta içi ve hafta sonu aynı saatlerde yatın ve kalkın.
              </Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                Yatmadan önce ekranlardan (telefon, bilgisayar, TV) en az 1 saat uzak durun.
              </Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.tipText}>
                {activeTab === 'day' && dayStats.weekendAvg > dayStats.weekdayAvg 
                  ? 'Hafta içi uyku kalitenizi artırmak için stres azaltıcı teknikler deneyin.'
                  : 'Uyku ritminizi korumak için her gün aynı saatte yatağa girin.'}
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
  tabContainer: {
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
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(30, 30, 45, 0.7)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  statGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    width: '48%',
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  statSubtext: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  compareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  compareItem: {
    alignItems: 'center',
    width: '45%',
  },
  compareValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  compareLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  compareDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.divider,
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.2)',
  },
  insightText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    lineHeight: 18,
  },
  tipsContainer: {
    backgroundColor: 'rgba(30, 30, 45, 0.7)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  tipsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  tipsList: {
    gap: theme.spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    lineHeight: 18,
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

export default TimePatternChart;