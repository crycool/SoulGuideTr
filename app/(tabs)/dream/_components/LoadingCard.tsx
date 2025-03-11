import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../theme';

interface LoadingCardProps {
  steps: Array<{
    text: string;
    done: boolean;
  }>;
  currentStep: number;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ steps, currentStep }) => {
  return (
    <Animatable.View 
      animation="fadeIn" 
      duration={500} 
      style={styles.container}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="brain" size={24} color={theme.colors.primary} />
        <Text style={styles.title}>Rüya Analizi Yapılıyor</Text>
      </View>
      
      <View style={styles.stepsList}>
        {steps.map((step, index) => (
          <Animatable.View 
            key={index}
            animation={index === currentStep ? "pulse" : undefined}
            iterationCount={index === currentStep ? "infinite" : undefined}
            duration={1000}
            style={styles.stepItem}
          >
            <View style={[
              styles.stepIcon,
              step.done ? styles.stepDone : (index === currentStep ? styles.stepActive : styles.stepPending)
            ]}>
              {step.done ? (
                <MaterialCommunityIcons name="check" size={16} color="#fff" />
              ) : index === currentStep ? (
                <Animatable.View animation="rotate" easing="linear" iterationCount="infinite" duration={1500}>
                  <MaterialCommunityIcons name="autorenew" size={16} color="#fff" />
                </Animatable.View>
              ) : (
                <MaterialCommunityIcons name="circle-outline" size={16} color="#fff" />
              )}
            </View>
            <Text style={[
              styles.stepText,
              step.done ? styles.stepTextDone : (index === currentStep ? styles.stepTextActive : styles.stepTextPending)
            ]}>
              {step.text}
            </Text>
          </Animatable.View>
        ))}
      </View>
      
      <Text style={styles.footer}>
        Rüya analizleri Jung psikolojisi temelinde yapılmaktadır
      </Text>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(30, 30, 45, 0.95)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.3)',
    ...theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  stepsList: {
    marginVertical: theme.spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  stepActive: {
    backgroundColor: theme.colors.accent,
  },
  stepDone: {
    backgroundColor: theme.colors.success,
  },
  stepPending: {
    backgroundColor: 'rgba(189, 195, 199, 0.3)',
  },
  stepText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  stepTextActive: {
    color: theme.colors.accent,
  },
  stepTextDone: {
    color: theme.colors.success,
  },
  stepTextPending: {
    color: theme.colors.textSecondary,
  },
  footer: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});

export default LoadingCard;