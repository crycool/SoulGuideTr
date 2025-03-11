import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

interface DreamInsightsProps {
  analysis: {
    emotions: Array<{type: string, intensity: number, context: string}>,
    symbols: Array<{name: string, meaning: string}>,
    insights: string[],
    suggestions: string[],
    mainTheme: string
  };
}

export default function DreamInsights({ analysis }: DreamInsightsProps) {
  return (
    <Animatable.View
      animation="fadeIn"
      style={styles.insightsContainer}
    >
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>{analysis.mainTheme}</Text>
        
        <Text style={styles.sectionTitle}>Duygusal Analiz</Text>
        {analysis.emotions.map((emotion, index) => (
          <View key={index} style={styles.emotionItem}>
            <Text style={styles.emotionType}>{emotion.type}</Text>
            <Text style={styles.emotionContext}>{emotion.context}</Text>
            <View style={[styles.intensityBar, { width: `${emotion.intensity * 10}%` }]} />
          </View>
        ))}

        <Text style={styles.sectionTitle}>Semboller</Text>
        {analysis.symbols.map((symbol, index) => (
          <View key={index} style={styles.symbolItem}>
            <Text style={styles.symbolName}>{symbol.name}</Text>
            <Text style={styles.symbolMeaning}>{symbol.meaning}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>İçgörüler</Text>
        {analysis.insights.map((insight, index) => (
          <Text key={index} style={styles.insightText}>• {insight}</Text>
        ))}
      </View>

      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationTitle}>Öneriler</Text>
        {analysis.suggestions.map((suggestion, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Ionicons 
              name={index % 2 === 0 ? 'leaf' : 'book'} 
              size={24} 
              color="#FFD700" 
            />
            <Text style={styles.recommendationText}>{suggestion}</Text>
          </View>
        ))}
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  insightsContainer: {
    padding: 20,
  },
  insightCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  insightTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  insightText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  recommendationCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
  },
  recommendationTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  recommendationText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});