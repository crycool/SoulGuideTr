import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../../theme';
import { AnalyticsSummary as AnalyticsSummaryType } from '../../_services/dreamAnalyticsService';

interface AnalyticsSummaryProps {
  summary: AnalyticsSummaryType;
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ summary }) => {
  const renderStatItem = (
    icon: string,
    label: string,
    value: string | number,
    color: string = theme.colors.primary
  ) => (
    <View style={styles.statItem}>
      <MaterialCommunityIcons name={icon as any} size={24} color={color} style={styles.statIcon} />
      <View style={styles.statTextContainer}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
    </View>
  );

  // Rüya kalitesi için metin ve renk belirleme
  const getQualityInfo = (quality: number) => {
    if (quality >= 8) return { text: 'Mükemmel', color: '#4CAF50' };
    if (quality >= 6) return { text: 'İyi', color: '#8BC34A' };
    if (quality >= 4) return { text: 'Orta', color: '#FFC107' };
    if (quality >= 2) return { text: 'Zayıf', color: '#FF9800' };
    return { text: 'Çok Zayıf', color: '#F44336' };
  };

  const qualityInfo = getQualityInfo(summary.avgQuality);
  const qualityText = `${qualityInfo.text} (${summary.avgQuality.toFixed(1)}/10)`;

  // Rüya tip dağılımı
  const dreamTypesText = Object.entries(summary.dreamTypes)
    .map(([type, count]) => `${type}: ${count}`)
    .join(', ');

  return (
    <Card style={styles.card}>
      <Card.Title title="Rüya Analitik Özeti" titleStyle={styles.cardTitle} />
      <Card.Content>
        <View style={styles.statsGrid}>
          {renderStatItem('counter', 'Toplam Rüya', summary.totalDreams, theme.colors.primary)}
          {renderStatItem('calendar-range', 'Kayıtlı Günler', summary.recordedDays, theme.colors.secondary)}
          {renderStatItem('star-half-full', 'Ortalama Netlik', qualityText, qualityInfo.color)}
          {renderStatItem('emoticon-outline', 'Baskın Duygu', summary.topEmotion, '#FF6D01')}
          {renderStatItem('theme-light-dark', 'Baskın Tema', summary.topTheme, '#7F5DF0')}
          {renderStatItem('calendar-clock', 'Son Rüya', summary.lastDreamDate, theme.colors.tertiary)}
        </View>

        <View style={styles.typesContainer}>
          <Text style={styles.typesLabel}>Rüya Tipleri:</Text>
          <Text style={styles.typesValue}>{dreamTypesText}</Text>
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
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginVertical: theme.spacing.sm,
    backgroundColor: 'rgba(30, 30, 45, 0.7)',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
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
  },
  statValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  typesContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  typesLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  typesValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
});

export default AnalyticsSummary;