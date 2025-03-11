import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';

export default function ChatHeader() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[theme.colors.surface, '#2C2C3E']}
      style={styles.header}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Rüya Yorumu</Text>
        <Text style={styles.subtitle}>AI Asistan</Text>
      </View>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => router.push('/dream/archive')}
      >
        <Ionicons name="library-outline" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    ...theme.shadows.md,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    opacity: 0.8,
  },
  menuButton: {
    padding: theme.spacing.xs,
  },
});