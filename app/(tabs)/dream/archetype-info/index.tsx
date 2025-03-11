import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';
import { getArchetypeMeaning } from '../_utils/archetypes';

export default function ArchetypeInfoScreen() {
  const { archetype } = useLocalSearchParams<{ archetype: string }>();
  const [loading, setLoading] = useState(true);
  const [meaning, setMeaning] = useState<{ title: string; description: string; examples: string[] }>({
    title: '',
    description: '',
    examples: []
  });
  const router = useRouter();

  useEffect(() => {
    if (archetype && typeof archetype === 'string') {
      setLoading(true);
      // Arketip anlamını getir
      const archetypeInfo = getArchetypeMeaning(archetype);
      setMeaning(archetypeInfo);
      setLoading(false);
    }
  }, [archetype]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Jung Arketipi</Text>
        
        <View style={styles.placeholder} />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f1c40f" />
          <Text style={styles.loadingText}>Arketip bilgileri yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          <View style={styles.archetypeHeader}>
            <MaterialCommunityIcons name="account-group" size={28} color="#8e44ad" />
            <Text style={styles.archetypeTitle}>{meaning.title}</Text>
          </View>
          
          <View style={styles.meaningContainer}>
            <Text style={styles.meaningTitle}>Jung Psikolojisinde {archetype}</Text>
            <Text style={styles.meaningText}>{meaning.description}</Text>
          </View>
          
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Rüyalarda Görünümü</Text>
            <View style={styles.examplesList}>
              {meaning.examples.map((example, index) => (
                <View key={index} style={styles.exampleItem}>
                  <Ionicons name="ios-checkmark-circle-outline" size={20} color="#8e44ad" style={styles.bulletIcon} />
                  <Text style={styles.exampleText}>{example}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Carl Jung'un Arketipler Teorisi</Text>
            <Text style={styles.infoText}>
              Carl Jung, kolektif bilinçdışı teorisinde arketipleri, insanlığın ortak psikolojik mirasını oluşturan ve rüyalarda, mitlerde ve sanat eserlerinde ortaya çıkan evrensel sembolik şablonlar olarak tanımlar. Bu arketipler, tüm insanlarda ortak deneyimleri ve motifleri temsil eder.
            </Text>
            <Text style={styles.infoText}>
              Jung'a göre arketiplerin bilincine varmak, bireyin kişisel ve kolektif bilinçdışını bütünleştirme sürecinin (bireyleşme) önemli bir parçasıdır. Rüyalarda arketiplerin ortaya çıkışı, kişinin psişik gelişiminde önemli mesajlar taşır.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  placeholder: {
    width: 24, // Geri butonu ile dengelemek için
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
  archetypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  archetypeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8e44ad',
    marginLeft: 10,
  },
  meaningContainer: {
    backgroundColor: '#1e1e2d',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(142, 68, 173, 0.3)',
  },
  meaningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9b59b6',
    marginBottom: 10,
  },
  meaningText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ecf0f1',
  },
  examplesContainer: {
    backgroundColor: '#1e1e2d',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(142, 68, 173, 0.3)',
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9b59b6',
    marginBottom: 15,
  },
  examplesList: {
    marginTop: 10,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ecf0f1',
    flex: 1,
  },
  infoContainer: {
    backgroundColor: '#1e1e2d',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(142, 68, 173, 0.3)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9b59b6',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ecf0f1',
    marginBottom: 10,
  }
});
