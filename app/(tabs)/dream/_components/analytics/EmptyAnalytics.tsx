import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { theme } from '../../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EmptyAnalyticsProps {
  onPress: () => void;
}

const EmptyAnalytics: React.FC<EmptyAnalyticsProps> = ({ onPress }) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <MaterialCommunityIcons
          name="chart-line-variant"
          size={80}
          color={theme.colors.analytics}
          style={styles.icon}
        />

        <Text style={styles.title}>Henüz yeterli rüya veriniz yok</Text>
        
        <Text style={styles.description}>
          Rüya analitiklerini görmek için en az 3 rüya kaydetmeniz gerekiyor. 
          Rüyalarınızı kaydettikçe, duygusal örüntüler, tekrarlayan temalar ve
          zaman içindeki değişimler hakkında içgörüler kazanacaksınız.
        </Text>
        
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitRow}>
            <View style={styles.checkCircle}>
              <MaterialCommunityIcons name="check" size={16} color={theme.colors.text} />
            </View>
            <Text style={styles.benefitText}>Duygusal örüntüleri anlama</Text>
          </View>
          <View style={styles.benefitRow}>
            <View style={styles.checkCircle}>
              <MaterialCommunityIcons name="check" size={16} color={theme.colors.text} />
            </View>
            <Text style={styles.benefitText}>Tekrarlayan sembolleri keşfetme</Text>
          </View>
          <View style={styles.benefitRow}>
            <View style={styles.checkCircle}>
              <MaterialCommunityIcons name="check" size={16} color={theme.colors.text} />
            </View>
            <Text style={styles.benefitText}>Uyku ve rüya kalitesini takip etme</Text>
          </View>
          <View style={styles.benefitRow}>
            <View style={styles.checkCircle}>
              <MaterialCommunityIcons name="check" size={16} color={theme.colors.text} />
            </View>
            <Text style={styles.benefitText}>Bilinçaltı eğilimleri görselleştirme</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
        >
          <MaterialCommunityIcons name="plus" size={20} color={theme.colors.background} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Rüya Kaydet</Text>
        </TouchableOpacity>
        
        <Text style={styles.tip}>
          İpucu: Rüyalarınızı sabah uyanır uyanmaz kaydetmek, hatırlama oranınızı artırır.
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.md,
  },
  content: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  icon: {
    marginBottom: theme.spacing.xl,
    opacity: 0.9,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  benefitsContainer: {
    alignSelf: 'stretch',
    marginBottom: theme.spacing.xl,
    backgroundColor: 'rgba(30, 30, 45, 0.5)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.analytics,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  benefitText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.analytics,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  buttonIcon: {
    marginRight: theme.spacing.xs,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  tip: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default EmptyAnalytics;