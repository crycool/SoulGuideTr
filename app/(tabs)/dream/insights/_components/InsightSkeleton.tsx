import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { theme } from '../../../../theme';

const { width } = Dimensions.get('window');

interface InsightSkeletonProps {
  type?: 'header' | 'card' | 'list';
  count?: number;
}

/**
 * İçgörüler yüklenirken gösterilecek iskelet yükleniyor bileşeni
 */
const InsightSkeleton: React.FC<InsightSkeletonProps> = ({
  type = 'card',
  count = 1
}) => {
  // Shimmering efekti için animasyon değeri
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  
  // Komponent mount edildiğinde animasyonu başlat
  useEffect(() => {
    const shimmerAnimation = startShimmerAnimation();
    return () => shimmerAnimation.stop();
  }, []);
  
  // Shimmering animasyonu
  const startShimmerAnimation = () => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false
      })
    );
    
    animation.start();
    return animation;
  };
  
  // Animasyon interpolasyonu
  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width]
  });
  
  // Kart iskeleti render fonksiyonu
  const renderCardSkeleton = () => (
    <View style={styles.cardContainer}>
      <View style={styles.shimmerOverlay}>
        <Animated.View 
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslate }]
            }
          ]}
        />
      </View>
      <View style={styles.cardIcon} />
      <View style={styles.cardTitle} />
      <View style={styles.cardContent} />
      <View style={styles.cardFooter} />
    </View>
  );
  
  // Başlık iskeleti render fonksiyonu
  const renderHeaderSkeleton = () => (
    <View style={styles.headerContainer}>
      <View style={styles.shimmerOverlay}>
        <Animated.View 
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslate }]
            }
          ]}
        />
      </View>
      <View style={styles.headerTop}>
        <View style={styles.headerIcon} />
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerLabel} />
          <View style={styles.headerTitle} />
        </View>
      </View>
      
      <View style={styles.headerBottomRow}>
        <View style={styles.headerCount} />
        <View style={styles.headerButton} />
      </View>
    </View>
  );
  
  // Liste iskeleti render fonksiyonu
  const renderListSkeleton = () => (
    <View style={styles.listContainer}>
      <View style={styles.shimmerOverlay}>
        <Animated.View 
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslate }]
            }
          ]}
        />
      </View>
      <View style={styles.listTitle} />
      <View style={styles.listLine} />
      <View style={styles.listLine} />
      <View style={styles.listLine} />
    </View>
  );
  
  // İskelet tipine göre uygun renderı seç
  const renderSkeleton = () => {
    switch (type) {
      case 'header':
        return renderHeaderSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'card':
      default:
        return renderCardSkeleton();
    }
  };
  
  // Birden fazla iskelet oluştur
  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <View key={index} style={{ marginBottom: theme.spacing.md }}>
            {renderSkeleton()}
          </View>
        ))}
      </>
    );
  }
  
  return renderSkeleton();
};

const styles = StyleSheet.create({
  // Ortak stiller
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shimmer: {
    width: '30%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
  },
  
  // Kart iskeleti stiller
  cardContainer: {
    backgroundColor: 'rgba(31, 31, 48, 0.6)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    height: 180,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    width: '70%',
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  cardContent: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  cardFooter: {
    width: '50%',
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.sm,
    marginTop: 'auto',
  },
  
  // Başlık iskeleti stiller
  headerContainer: {
    backgroundColor: 'rgba(31, 31, 48, 0.6)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: theme.spacing.md,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerLabel: {
    width: '30%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  headerTitle: {
    width: '90%',
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.sm,
  },
  headerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCount: {
    width: '40%',
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.sm,
  },
  headerButton: {
    width: '25%',
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.md,
  },
  
  // Liste iskeleti stiller
  listContainer: {
    backgroundColor: 'rgba(31, 31, 48, 0.6)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  listTitle: {
    width: '50%',
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  listLine: {
    width: '100%',
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
});

export default InsightSkeleton;