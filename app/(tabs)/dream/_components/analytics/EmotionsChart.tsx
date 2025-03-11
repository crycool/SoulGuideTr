import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { EmotionData } from '../../_services/dreamAnalyticsService';
import { theme } from '../../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EmotionsChartProps {
  emotions: EmotionData[];
  onEmotionPress?: (emotion: string) => void;
}

const EmotionsChart: React.FC<EmotionsChartProps> = ({ emotions, onEmotionPress }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // Rastgele canlı renk oluşturma fonksiyonu
  const generateBrightColor = () => {
    // HSL renk uzayında parlak renk oluştur
    const h = Math.floor(Math.random() * 360); // Renk tonu (0-360)
    const s = Math.floor(Math.random() * 30) + 70; // Doygunluk (70-100) - canlı renkler
    const l = Math.floor(Math.random() * 20) + 50; // Parlaklık (50-70) - ne çok açık ne çok koyu
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  // Duygu için ikon seçimi
  const getEmotionIcon = (emotion: string): string => {
    const emotionIcons: Record<string, string> = {
      'mutluluk': 'emoticon-happy',
      'sevinç': 'emoticon-happy-outline',
      'üzüntü': 'emoticon-sad',
      'hüzün': 'emoticon-sad-outline',
      'korku': 'ghost',
      'endişe': 'alert-circle',
      'şaşkınlık': 'emoticon-surprised',
      'heyecan': 'lightning-bolt',
      'öfke': 'fire',
      'kızgınlık': 'emoticon-angry',
      'utanma': 'emoticon-frown',
      'suçluluk': 'handcuffs',
      'umut': 'star',
      'merak': 'magnify',
      'huzur': 'heart-pulse',
      'sevgi': 'heart',
      // Varsayılan ikon
      'diğer': 'dots-horizontal',
    };
    
    const normalizedEmotion = emotion.toLowerCase();
    return emotionIcons[normalizedEmotion] || 'emoticon-neutral';
  };

  useEffect(() => {
    // En çok 8 kategori göster, kalanları "Diğer" olarak grupla
    const totalEmotions = emotions.reduce((sum, emotion) => sum + emotion.value, 0);
    setTotalCount(totalEmotions);

    // Duygular için daha canlı renkler
    const emotionColors: Record<string, string> = {
      'mutluluk': '#FFD700', // Altın sarısı
      'sevinç': '#FFA500', // Turuncu
      'korku': '#9932CC', // Mor
      'endişe': '#9370DB', // Açık mor
      'heyecan': '#FF4500', // Turuncu-kırmızı
      'öfke': '#FF0000', // Kırmızı
      'umut': '#00BFFF', // Açık mavi
      'sürpriz': '#40E0D0', // Türkuaz
      'suçluluk': '#5F9EA0', // Kadetmavisi
      'huzur': '#98FB98', // Açık yeşil
      'sevgi': '#FF69B4', // Pembe
      'üzüntü': '#4169E1', // Mavi
      'utanma': '#FF9999', // Açık pembe
      'nostalji': '#DDA0DD', // Açık mor
      'neşe': '#F4A460', // Koyu kehribar
      'kıskançlık': '#32CD32', // Lime yeşil
      'gurur': '#DA70D6', // Orkide
      'utanmış': '#FF6347', // Domates rengi
      'tatmin': '#87CEFA', // Açık gökyüzü mavisi
      'merak': '#7FFFD4', // Aquamarine
      'panik': '#FF6347', // Domates kırmızısı
      'kaygı': '#BA55D3', // Orta orkide
      'stres': '#FF4500', // OrangeRed 
      'ümitsizlik': '#6A5ACD', // Slate mavisi
      'belirsiz': '#B0C4DE', // Açık çelik mavisi
      'diğer': '#D3D3D3'  // Açık gri
    };

    if (emotions.length <= 8) {
      setChartData(
        emotions.map(emotion => ({
          name: emotion.name,
          count: emotion.value,
          percentage: ((emotion.value / totalEmotions) * 100).toFixed(1),
          color: emotionColors[emotion.name.toLowerCase()] || emotion.color || generateBrightColor(),
          legendFontColor: theme.colors.text,
          legendFontSize: 12
        }))
      );
    } else {
      const mainEmotions = emotions.slice(0, 7);
      const otherEmotions = emotions.slice(7);
      
      const otherCount = otherEmotions.reduce((sum, emotion) => sum + emotion.value, 0);
      
      const chartDataWithOthers = [
        ...mainEmotions.map(emotion => ({
          name: emotion.name,
          count: emotion.value,
          percentage: ((emotion.value / totalEmotions) * 100).toFixed(1),
          color: emotionColors[emotion.name.toLowerCase()] || emotion.color || generateBrightColor(),
          legendFontColor: theme.colors.text,
          legendFontSize: 12
        })),
        {
          name: 'Diğer',
          count: otherCount,
          percentage: ((otherCount / totalEmotions) * 100).toFixed(1),
          color: '#D3D3D3',  // Açık gri
          legendFontColor: theme.colors.text,
          legendFontSize: 12
        }
      ];
      
      setChartData(chartDataWithOthers);
    }
  }, [emotions]);

  const handleSlicePress = (index: number) => {
    const emotion = chartData[index];
    if (emotion.name === 'Diğer') {
      return; // Diğer kategorisi için detay gösterme
    }
    
    const emotionData = emotions.find(e => e.name === emotion.name) || null;
    setSelectedEmotion(emotionData);
    
    if (onEmotionPress && emotionData) {
      onEmotionPress(emotionData.name);
    }
  };

  const closeDetails = () => {
    setSelectedEmotion(null);
  };

  const screenWidth = Dimensions.get('window').width - 64;

  // Eğer hiç veri yoksa
  if (emotions.length === 0) {
    // Örnek duygu verileri oluştur
    const dummyData = [
      { name: 'Mutluluk', value: 45, color: '#FFD700' },
      { name: 'Korku', value: 25, color: '#9932CC' },
      { name: 'Heyecan', value: 15, color: '#FF4500' },
      { name: 'Endişe', value: 10, color: '#9370DB' },
      { name: 'Umut', value: 5, color: '#00BFFF' }
    ];

    return (
      <Card style={styles.card}>
        <Card.Title 
          title="Duygu Dağılımı" 
          titleStyle={styles.cardTitle}
          subtitle="Henüz yeterli veri yok - Örnek görünüm"
          subtitleStyle={styles.cardSubtitle}
          left={(props) => <MaterialCommunityIcons {...props} name="emoticon-outline" size={30} color={theme.colors.primary} />}
        />
        <Card.Content>
          <View style={styles.chartContainer}>
            <PieChart
              data={dummyData.map(emotion => ({
                name: emotion.name,
                count: emotion.value,
                percentage: emotion.value.toString(),
                color: emotion.color,
                legendFontColor: theme.colors.text,
                legendFontSize: 12
              }))}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
                labelColor: (opacity = 1) => theme.colors.text,
                style: {
                  borderRadius: 16
                },
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend={false}
              center={[screenWidth / 4, 0]}
              avoidFalseZero
              style={{
                marginBottom: 16,
                backgroundColor: 'rgba(30, 30, 45, 0.7)',
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                ...theme.shadows.sm,
              }}
            />
            
            <View style={styles.legendContainer}>
              {dummyData.map((data, index) => (
                <View
                  key={`emotion-${index}`}
                  style={styles.legendItem}
                >
                  <View style={styles.legendLeftContainer}>
                    <View 
                      style={[
                        styles.legendColor, 
                        { backgroundColor: data.color }
                      ]} 
                    />
                    <MaterialCommunityIcons 
                      name={getEmotionIcon(data.name)} 
                      size={16} 
                      color={data.color} 
                      style={styles.emotionIcon} 
                    />
                  </View>
                  <Text style={styles.legendText}>
                    {data.name} ({data.value}%)
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.noteContainer}>
              <MaterialCommunityIcons name="information-outline" size={18} color={theme.colors.primary} />
              <Text style={styles.noteText}>
                Bu örnek bir görünümdür. Gerçek veriler için daha fazla rüya kaydetmelisiniz.
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Title 
        title="Duygu Dağılımı" 
        titleStyle={styles.cardTitle}
        subtitle={`Toplam ${totalCount} duygu kaydı`}
        subtitleStyle={styles.cardSubtitle}
        left={(props) => <MaterialCommunityIcons {...props} name="emoticon-outline" size={30} color={theme.colors.primary} />}
      />
      <Card.Content>
        <View style={styles.chartContainer}>
          <Animatable.View 
            animation="fadeIn" 
            duration={800}
            delay={300}
            style={styles.chartWrapper}
          >
            <LinearGradient
              colors={['rgba(31, 31, 48, 0.95)', 'rgba(31, 31, 48, 0.85)']}
              style={styles.chartBackground}
            >
              <PieChart
                data={chartData}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: 'rgba(31, 31, 48, 0.1)',
                  backgroundGradientTo: 'rgba(31, 31, 48, 0.1)',
                  color: (opacity = 1) => `rgba(247, 203, 47, ${opacity})`,
                  labelColor: (opacity = 1) => theme.colors.text,
                  style: {
                    borderRadius: 16
                  },
                  propsForLabels: {
                    fontSize: '10',
                  },
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend={false}
                center={[screenWidth / 4, 0]}
                avoidFalseZero
                style={{
                  marginBottom: 0,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing.sm,
                }}
                onPressSlice={handleSlicePress}
              />
            </LinearGradient>
          </Animatable.View>
          
          <Animatable.View 
            animation="fadeIn" 
            duration={800}
            delay={500}
            style={styles.legendContainer}
          >
            {chartData.map((data, index) => (
              <TouchableOpacity
                key={`emotion-${index}`}
                style={styles.legendItem}
                onPress={() => handleSlicePress(index)}
                activeOpacity={0.7}
              >
                <Animatable.View 
                  animation="fadeInRight" 
                  duration={400}
                  delay={index * 100}
                  style={styles.legendInnerContainer}
                >
                  <View style={styles.legendLeftContainer}>
                    <View 
                      style={[
                        styles.legendColor, 
                        { backgroundColor: data.color }
                      ]} 
                    />
                    <MaterialCommunityIcons 
                      name={getEmotionIcon(data.name)} 
                      size={16} 
                      color={data.color} 
                      style={styles.emotionIcon} 
                    />
                  </View>
                  <Text style={styles.legendText}>
                    {data.name} ({data.percentage}%)
                  </Text>
                </Animatable.View>
              </TouchableOpacity>
            ))}
          </Animatable.View>

          {selectedEmotion && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailsHeader}>
                <View style={styles.detailsTitleContainer}>
                  <MaterialCommunityIcons 
                    name={getEmotionIcon(selectedEmotion.name)} 
                    size={24} 
                    color={selectedEmotion.color} 
                    style={{marginRight: theme.spacing.sm}} 
                  />
                  <Text style={[styles.detailsTitle, {color: selectedEmotion.color}]}>
                    {selectedEmotion.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={closeDetails}>
                  <Text style={styles.closeButton}>X</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.detailsText}>
                Toplam {selectedEmotion.value} rüyada görüldü
                ({((selectedEmotion.value / totalCount) * 100).toFixed(1)}%)
              </Text>
              <Chip 
                mode="outlined" 
                style={[styles.detailsChip, { borderColor: selectedEmotion.color }]}
                textStyle={{ color: selectedEmotion.color }}
                icon="magnify"
              >
                Bu duygu ile ilgili rüyaları gör
              </Chip>
            </View>
          )}
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
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
    overflow: 'hidden',
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
    position: 'relative',
  },
  chartWrapper: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  chartBackground: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  legendItem: {
    width: '50%',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  },
  legendInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 31, 48, 0.5)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  legendLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.xs,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.xs,
  },
  emotionIcon: {
    marginRight: theme.spacing.xs,
  },
  legendText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    flex: 1,
  },
  detailsContainer: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: 'rgba(30, 30, 45, 0.8)',
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  detailsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
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
    marginBottom: theme.spacing.md,
  },
  detailsChip: {
    alignSelf: 'flex-start',
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
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.2)',
  },
  noteText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
});

export default EmotionsChart;
