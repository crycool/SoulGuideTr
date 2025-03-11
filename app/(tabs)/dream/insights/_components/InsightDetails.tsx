import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { theme } from '../../../../theme';
import { insightHelpers } from '../../_utils/insightQuotes';

interface InsightDetailsProps {
  title: string;
  content: string;
  onClose: () => void;
  sourceType?: string;
  additionalInfo?: string;
}

/**
 * Detaylı içgörü görüntüleme bileşeni
 * Tam içgörü metnini ve ek bilgileri gösterir
 */
const InsightDetails: React.FC<InsightDetailsProps> = ({
  title,
  content,
  onClose,
  sourceType,
  additionalInfo
}) => {
  // Rastgele bir alıntı seç
  const [quote, setQuote] = useState(insightHelpers.getUniqueRandomQuote());
  
  // Bileşen her oluşturulduğunda yeni bir alıntı seç
  useEffect(() => {
    setQuote(insightHelpers.getUniqueRandomQuote());
  }, []);
  
  const getSourceIcon = () => {
    switch (sourceType) {
      case 'symbol':
        return 'star';
      case 'archetype':
        return 'person';
      case 'emotion':
        return 'heart';
      case 'pattern':
        return 'git-network';
      default:
        return 'analytics';
    }
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(31, 31, 48, 0.97)', 'rgba(31, 31, 48, 0.95)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>İçgörü Detayı</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View 
            animation="fadeIn"
            duration={600}
            style={styles.contentContainer}
          >
            {/* İçgörü başlığı */}
            <View style={styles.titleContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name={getSourceIcon() as any} size={22} color={theme.colors.primary} />
              </View>
              <Text style={styles.title}>{title}</Text>
            </View>
            
            {/* İçgörü içeriği */}
            <Text style={styles.content}>
              {content}
            </Text>
            
            {/* Ek bilgiler */}
            {additionalInfo && (
              <View style={styles.additionalContainer}>
                <View style={styles.additionalHeader}>
                  <Ionicons name="information-circle" size={18} color={theme.colors.info} />
                  <Text style={styles.additionalHeaderText}>Ek Bilgi</Text>
                </View>
                <Text style={styles.additionalContent}>
                  {additionalInfo}
                </Text>
              </View>
            )}
            
            {/* Dinamik alıntı */}
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>
                "{quote.text}"
              </Text>
              <Text style={styles.quoteAuthor}>
                - {quote.author}
              </Text>
            </View>
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
  },
  gradient: {
    width: '90%',
    height: '80%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...theme.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    left: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(31, 31, 48, 0.6)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 31, 48, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  content: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(31, 31, 48, 0.6)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  additionalContainer: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  additionalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  additionalHeaderText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.info,
    marginLeft: theme.spacing.xs,
  },
  additionalContent: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  quoteContainer: {
    backgroundColor: 'rgba(247, 203, 47, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  quoteText: {
    fontSize: theme.typography.fontSize.md,
    fontStyle: 'italic',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  quoteAuthor: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    textAlign: 'right',
  },
});

export default InsightDetails;