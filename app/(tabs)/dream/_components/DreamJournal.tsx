import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { DreamAnalysis } from '../_utils/messageTypes';
import DreamStats from './DreamStats';
import DreamInsights from './DreamInsights';

interface DreamJournalProps {
  dreams: DreamAnalysis[];
  onSelectDream: (dream: DreamAnalysis) => void;
}

const calculateStats = (dreams: DreamAnalysis[]) => {
  const totalDreams = dreams.length;
  const lucidDreams = dreams.filter(d => d.isLucid).length;
  
  // Duygu analizi
  const emotionCounts = dreams.reduce((acc, dream) => {
    dream.emotions.forEach(emotion => {
      if (!acc[emotion.type]) acc[emotion.type] = [];
      acc[emotion.type].push(emotion.intensity);
    });
    return acc;
  }, {} as Record<string, number[]>);

  const emotions = Object.entries(emotionCounts)
    .map(([label, values]) => ({
      label,
      value: values.reduce((a, b) => a + b, 0) / (values.length * 10)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Sembol analizi
  const symbolCounts = dreams.reduce((acc, dream) => {
    dream.symbols.forEach(symbol => {
      if (!acc[symbol.name]) acc[symbol.name] = 0;
      acc[symbol.name]++;
    });
    return acc;
  }, {} as Record<string, number>);

  const patterns = Object.entries(symbolCounts)
    .map(([text, count]) => ({
      icon: getSymbolIcon(text),
      text,
      frequency: (count / totalDreams) * 100
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);

  return {
    patterns,
    emotions,
    lucidityRate: lucidDreams / totalDreams,
    totalDreams
  };
};

// Sembol türüne göre ikon seçimi
const getSymbolIcon = (symbolName: string): string => {
  const lowercaseSymbol = symbolName.toLowerCase();
  if (lowercaseSymbol.includes('su') || lowercaseSymbol.includes('deniz')) return 'water';
  if (lowercaseSymbol.includes('gökyüzü') || lowercaseSymbol.includes('uçmak')) return 'airplane';
  if (lowercaseSymbol.includes('ev') || lowercaseSymbol.includes('bina')) return 'home';
  if (lowercaseSymbol.includes('ağaç') || lowercaseSymbol.includes('orman')) return 'leaf';
  if (lowercaseSymbol.includes('insan') || lowercaseSymbol.includes('kişi')) return 'people';
  return 'star';
};

export default function DreamJournal({ dreams, onSelectDream }: DreamJournalProps) {
  const [selectedTab, setSelectedTab] = useState<'journal' | 'stats'>('journal');
  const [stats, setStats] = useState(calculateStats(dreams));

  useEffect(() => {
    setStats(calculateStats(dreams));
  }, [dreams]);

  const renderDreamItem = ({ item }: { item: DreamAnalysis }) => (
    <Animatable.View
      animation="fadeIn"
      duration={500}
      style={styles.dreamCard}
    >
      <TouchableOpacity 
        onPress={() => onSelectDream(item)}
        style={styles.dreamContent}
      >
        <View style={styles.dreamHeader}>
          <Text style={styles.dreamDate}>
            {new Date(item.timestamp).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long'
            })}
          </Text>
          {item.isLucid && (
            <Ionicons name="star" size={20} color="#FFD700" />
          )}
        </View>
        
        <Text style={styles.dreamTheme}>{item.mainTheme}</Text>
        
        <Text 
          style={styles.dreamText}
          numberOfLines={2}
        >
          {item.content}
        </Text>

        <View style={styles.dreamFooter}>
          {item.emotions.slice(0, 3).map((emotion, index) => (
            <View key={index} style={styles.emotionBadge}>
              <Text style={styles.emotionText}>
                {emotion.type} ({emotion.intensity}/10)
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'journal' && styles.activeTab]}
          onPress={() => setSelectedTab('journal')}
        >
          <Text style={[styles.tabText, selectedTab === 'journal' && styles.activeTabText]}>
            Günlük
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'stats' && styles.activeTab]}
          onPress={() => setSelectedTab('stats')}
        >
          <Text style={[styles.tabText, selectedTab === 'stats' && styles.activeTabText]}>
            İstatistikler
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'journal' ? (
        <FlatList
          data={dreams}
          renderItem={renderDreamItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.dreamList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <DreamStats 
              patterns={stats.patterns}
              emotions={stats.emotions}
              lucidityRate={stats.lucidityRate}
              totalDreams={stats.totalDreams}
            />
          )}
          ListFooterComponent={() => (
            dreams.length > 0 && <DreamInsights analysis={dreams[dreams.length - 1]} />
          )}
          data={[]}
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1810',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  activeTabText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  dreamList: {
    padding: 15,
  },
  dreamCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dreamContent: {
    padding: 15,
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dreamDate: {
    color: '#FFD700',
    fontSize: 14,
  },
  dreamTheme: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dreamText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
  dreamFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  emotionBadge: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  emotionText: {
    color: '#FFD700',
    fontSize: 12,
  },
});