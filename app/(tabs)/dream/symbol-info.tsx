import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getSymbolMeaning } from './_services/openai';

// Artık sembol anlamları doğrudan OpenAI'dan alınıyor
// const symbolMeanings: Record<string, string> = {...};


export default function SymbolInfoScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const [loading, setLoading] = useState(true);
  const [meaning, setMeaning] = useState<string>('');

  useEffect(() => {
    // Sembol anlamını AI'dan al
    const fetchSymbolMeaning = async () => {
      if (symbol && typeof symbol === 'string') {
        setLoading(true);
        try {
          const result = await getSymbolMeaning(symbol);
          setMeaning(result.meaning || 
            'Bu sembolün anlamı henüz veritabanımızda bulunmuyor. Rüya yorumlama sayfasında bu sembolle ilgili yorumlar alabilirsiniz.');
        } catch (error) {
          console.error('Error fetching symbol meaning:', error);
          setMeaning('Sembol anlamı alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchSymbolMeaning();
  }, [symbol]);

  return (
    <>
      <Stack.Screen 
        options={{
          title: `${symbol || 'Sembol'} Anlamı`,
          headerStyle: {
            backgroundColor: '#1e1e2d',
          },
          headerTintColor: '#fff',
        }} 
      />
      
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f1c40f" />
            <Text style={styles.loadingText}>Sembol bilgileri yükleniyor...</Text>
          </View>
        ) : (
          <ScrollView style={styles.contentContainer}>
            <View style={styles.symbolHeader}>
              <Ionicons name="book" size={28} color="#f1c40f" />
              <Text style={styles.symbolTitle}>{symbol} Sembolü</Text>
            </View>
            
            <View style={styles.meaningContainer}>
              <Text style={styles.meaningTitle}>Genel Anlam</Text>
              <Text style={styles.meaningText}>{meaning}</Text>
            </View>
            
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Bilgi</Text>
              <Text style={styles.tipsText}>
                Semboller kişisel deneyimlerinize göre farklı anlamlar taşıyabilir. 
                Bu bilgiler genel yorumlardır ve sizin kişisel bağlamınıza göre değişiklik gösterebilir.
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121220',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ecf0f1',
    marginTop: 15,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  symbolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  symbolTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginLeft: 10,
  },
  meaningContainer: {
    backgroundColor: '#1e1e2d',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  meaningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 10,
  },
  meaningText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ecf0f1',
  },
  tipsContainer: {
    backgroundColor: '#1e1e2d',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ecf0f1',
    fontStyle: 'italic',
  },
});
