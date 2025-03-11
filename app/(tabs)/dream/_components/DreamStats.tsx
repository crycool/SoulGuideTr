import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

interface DreamPattern {
  icon: string;
  text: string;
  frequency: number;
}

interface EmotionStat {
  label: string;
  value: number;
}

interface DreamStatsProps {
  patterns: DreamPattern[];
  emotions: EmotionStat[];
  lucidityRate: number;
  totalDreams: number;
}

export default function DreamStats({ patterns, emotions, lucidityRate, totalDreams }: DreamStatsProps) {
  return (
    <Animatable.View
      animation="fadeIn"
      style={styles.statsContainer}
    >
      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Genel İstatistikler</Text>
        <View style={styles.generalStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalDreams}</Text>
            <Text style={styles.statLabel}>Toplam Rüya</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{`${(lucidityRate * 100).toFixed(0)}%`}</Text>
            <Text style={styles.statLabel}>Lucid Rüya</Text>
          </View>
        </View>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Rüya Örüntüleri</Text>
        <View style={styles.patternList}>
          {patterns.map((pattern, index) => (
            <View key={index} style={styles.pattern}>
              <Ionicons name={pattern.icon} size={24} color="#FFD700" />
              <Text style={styles.patternText}>{pattern.text}</Text>
              <Text style={styles.patternFreq}>{`${pattern.frequency}%`}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Duygusal Analiz</Text>
        <View style={styles.emotionBars}>
          {emotions.map((emotion, index) => (
            <View key={index} style={styles.emotionBar}>
              <Text style={styles.emotionLabel}>{emotion.label}</Text>
              <View style={styles.barBackground}>
                <View 
                  style={[styles.barContainer, { width: `${emotion.value * 100}%` }]} 
                />
              </View>
              <Text style={styles.emotionValue}>{`${(emotion.value * 100).toFixed(0)}%`}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  generalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
  },
  patternFreq: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 'auto',
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  emotionValue: {
    color: '#FFD700',
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
  statsContainer: {
    padding: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  statTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  patternList: {
    gap: 10,
  },
  pattern: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  patternText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  emotionBars: {
    gap: 15,
  },
  emotionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emotionLabel: {
    color: '#FFFFFF',
    width: 80,
  },
  barContainer: {
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
});