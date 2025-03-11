import React, { useState, useEffect, useRef } from 'react';
import archetypeStore from '../../_utils/archetypeStore';
import { View, Text, StyleSheet, TouchableOpacity, AppState } from 'react-native';
import { Card } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../../theme';

export type ArchetypeData = { 
  name: string; 
  value: number; 
  color: string;
  description?: string;
};

interface ArchetypesChartProps {
  archetypes: ArchetypeData[];
  onArchetypePress?: (archetype: string) => void;
  scrollViewRef?: React.RefObject<any>; // ScrollView referansı için prop ekledim
}

const ArchetypesChart: React.FC<ArchetypesChartProps> = ({ archetypes: propArchetypes, onArchetypePress, scrollViewRef: parentScrollViewRef }) => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeData | null>(null);
  const [archetypes, setArchetypes] = useState<ArchetypeData[]>(propArchetypes || []);
  const router = useRouter();
  const params = useLocalSearchParams();
  const appState = useRef(AppState.currentState);
  
  // ScrollView referansı
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
    // Component props'tan gelen verileri kullan
    if (propArchetypes && propArchetypes.length > 0) {
      setArchetypes(propArchetypes);
      return;
    }
    
    // Props boşsa ve store'da arketipler varsa onları kullan
    const storedArchetypes = archetypeStore.getArchetypesSync();
    if (storedArchetypes && storedArchetypes.length > 0) {
      // Store'dan gelen arketipleri görsel veriye dönüştür
      const archetypeColors = [
        '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b',
        '#5a5c69', '#6f42c1', '#fd7e14', '#20c997', '#6610f2'
      ];
      
      const mappedArchetypes: ArchetypeData[] = storedArchetypes.map((name, index) => ({
        name,
        value: Math.floor(Math.random() * 10) + 1, // Geçici: Her arketip için 1-10 arası rastgele bir değer
        color: archetypeColors[index % archetypeColors.length]
      }));
      
      setArchetypes(mappedArchetypes);
    }
  }, [propArchetypes]);
  
  // store'dan seçilen arketipi kontrol et
  useEffect(() => {
    if (archetypes.length === 0) return;
    
    // Store'dan seçili arketipi al
    const selectedName = archetypeStore.getSelectedArchetype();
    if (selectedName) {
      // Bulup set et
      const foundArchetype = archetypes.find(a => a.name === selectedName);
      if (foundArchetype) {
        setSelectedArchetype(foundArchetype);
        // Gecikmeli scroll - daha uzun bekle (sayfa geçişleri için)
        setTimeout(() => {
          scrollToDetailCard();
        }, 700);
      }
    }
  }, [archetypes]);

  // Boş veri kontrolü
  if (archetypes.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Title 
          title="Jungian Arketipler" 
          titleStyle={{color: theme.colors.primary, fontWeight: theme.typography.fontWeight.bold, fontSize: theme.typography.fontSize.lg}}
        />
        <Card.Content>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Henüz arketip analizi için yeterli veri bulunmamaktadır.
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  const handleArchetypePress = (archetype: ArchetypeData) => {
    // Aynı arketipe tıklandığında toggle davranışı (kapat)
    if (selectedArchetype && selectedArchetype.name === archetype.name) {
      setSelectedArchetype(null);
      archetypeStore.clearSelectedArchetype();
      return;
    }
    
    // Arketipi store'a kaydet ve state'de göster
    archetypeStore.selectArchetype(archetype.name);
    setSelectedArchetype(archetype);
    
    // Bileşenin render olması için önce bir gecikme ekle
    setTimeout(() => {
      // Sonra scroll işlemi yap (detailCardRef render edilmiş olacak)
      scrollToDetailCard();
    }, 100);
  };

  const closeDetails = () => {
    setSelectedArchetype(null);
    archetypeStore.clearSelectedArchetype();
  };

  // Archetype kartları için boyut hesaplamaları (değere göre)
  const maxValue = Math.max(...archetypes.map(a => a.value));
  const minValue = Math.min(...archetypes.map(a => a.value));
  const valueRange = maxValue - minValue;
  
  const calculateSize = (value: number) => {
    // 65-100 piksel arasında boyut hesapla
    const minSize = 65;
    const maxSize = 100;
    const sizeRange = maxSize - minSize;
    
    if (valueRange === 0) return minSize; // Tüm değerler aynıysa
    
    const normalizedValue = (value - minValue) / valueRange;
    return minSize + (normalizedValue * sizeRange);
  };

  return (
    <Card style={styles.card}>
      <Card.Title 
        title="Jungian Arketipler" 
        titleStyle={{color: theme.colors.primary, fontWeight: theme.typography.fontWeight.bold, fontSize: theme.typography.fontSize.lg}}
        subtitle={`${archetypes.length} farklı arketip`}
        subtitleStyle={{color: theme.colors.textSecondary}}
      />
      <Card.Content>
        <View style={styles.archetypesContainer}>
          {archetypes.map((archetype, index) => {
            const size = calculateSize(archetype.value);
            return (
              <TouchableOpacity
                key={`archetype-${index}`}
                style={[
                  styles.archetypeItem,
                  { 
                    width: size, 
                    height: size,
                    backgroundColor: `${archetype.color}20`,
                    borderColor: archetype.color,
                  }
                ]}
                onPress={() => handleArchetypePress(archetype)}
              >
                <Text 
                  style={[
                    styles.archetypeName, 
                    { color: archetype.color }
                  ]}
                >
                  {archetype.name}
                </Text>
                <Text style={styles.archetypeCount}>{archetype.value}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedArchetype && (
          <Animated.View 
            ref={detailCardRef}
            style={styles.detailsContainer}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <View style={styles.detailsHeader}>
              <Text style={[styles.detailsTitle, { color: selectedArchetype.color }]}>
                {selectedArchetype.name}
              </Text>
              <TouchableOpacity onPress={closeDetails} style={styles.closeButtonContainer}>
                <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.detailsText}>
              Bu arketip {selectedArchetype.value} rüyanızda tespit edildi.
            </Text>
            <View style={styles.detailsActions}>
              <TouchableOpacity 
                style={[styles.optionButton, { backgroundColor: '#3498db' }]} 
                onPress={() => {
                  router.push({
                    pathname: '/(tabs)/dream/archetype-info',
                    params: { archetype: selectedArchetype.name }
                  });
                }}
              >
                <Ionicons name="book-outline" size={22} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Arketip Hakkında Bilgi</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.optionButton, { backgroundColor: '#9b59b6' }]} 
                onPress={() => {
                  // Arketip içeren rüyaları görmek için arşiv sayfasına yönlendir
                  if (onArchetypePress) {
                    // Parent component'ten gelen onArchetypePress fonksiyonunu çağır
                    onArchetypePress(selectedArchetype.name);
                  } else {
                    // Parent component'ten fonksiyon gelmezse direkt router kullan
                    router.push({
                      pathname: '/(tabs)/dream/archive',
                      params: { 
                        filter: 'tag', 
                        value: selectedArchetype.name
                      }
                    });
                    // Not: Arketipi store'a zaten kaydettik, URL parametresine gerek yok
                  }
                }}
              >
                <Ionicons name="list-outline" size={22} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Arketipi İçeren Rüyalar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        
        <View style={styles.legendContainer}>
          <View style={styles.legendRow}>
            <MaterialCommunityIcons name="information-outline" size={16} color={theme.colors.text} />
            <Text style={styles.legendText}>
              Arketip boyutu sıklığa göre değişir. Büyük arketipler daha sık görülür.
            </Text>
          </View>
          <View style={styles.legendRow}>
            <MaterialCommunityIcons name="sigma" size={16} color={theme.colors.text} />
            <Text style={styles.legendText}>
              Jung psikolojisinde arketipler, kolektif bilinçdışındaki evrensel sembolik şablonlardır.
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
  archetypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.sm,
    minHeight: 180,
    gap: theme.spacing.sm,
  },
  archetypeItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100, // Tam daire
    borderWidth: 1,
    margin: theme.spacing.xs,
    padding: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  archetypeName: {
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 4,
  },
  archetypeCount: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
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

export default ArchetypesChart;