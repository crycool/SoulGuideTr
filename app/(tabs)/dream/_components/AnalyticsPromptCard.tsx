import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../../theme';

interface AnalyticsPromptCardProps {
  onPress: () => void;
}

const AnalyticsPromptCard: React.FC<AnalyticsPromptCardProps> = ({ onPress }) => {
  return (
    <LinearGradient
      colors={['rgba(52, 152, 219, 0.2)', 'rgba(155, 89, 182, 0.2)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="chart-bar" size={30} color={theme.colors.analytics} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Rüya Analitikleri</Text>
        <Text style={styles.description}>
          Rüyalarınızdan elde edilen verilerle kişisel içgörüler kazanın. Duygusal örüntüler, semboller ve bilinçaltı eğilimleri hakkında detaylı bilgi edinin.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Analizlere Git</Text>
        <MaterialCommunityIcons name="arrow-right" size={18} color={theme.colors.text} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
    ...theme.shadows.md,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(52, 152, 219, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  contentContainer: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    marginRight: theme.spacing.xs,
  },
});

export default AnalyticsPromptCard;