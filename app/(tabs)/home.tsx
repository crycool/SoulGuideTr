import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Rüya Rehberi',
          headerStyle: {
            backgroundColor: '#1e1e2d',
          },
          headerTintColor: '#f1c40f',
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Karşılama Kartı - Animasyonlu */}
        <Animatable.View 
          animation="fadeInDown"
          duration={800}
          style={styles.welcomeCardContainer}
        >
          <LinearGradient
            colors={['rgba(31, 31, 48, 0.95)', 'rgba(31, 31, 48, 0.85)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.welcomeCard}
          >
            <Animatable.Text 
              animation="fadeIn"
              delay={400}
              style={styles.welcomeTitle}
            >
              Hoş Geldiniz!
            </Animatable.Text>
            
            <Animatable.Text 
              animation="fadeIn"
              delay={600}
              style={styles.welcomeText}
            >
              Rüyalarınızı keşfedin, anlamlandırın ve hayatınızı zenginleştirin.
            </Animatable.Text>
            
            <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
              <TouchableOpacity 
                style={styles.welcomeButton}
                onPress={() => router.push('/dream/chat')}
                activeOpacity={0.8}
              >
                <Text style={styles.welcomeButtonText}>Rüyanızı Yorumlayın</Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </Animatable.View>
          </LinearGradient>
        </Animatable.View>
        
        {/* Ana Özellikler - Animasyonlu */}
        <Animatable.Text 
          animation="fadeIn"
          delay={800}
          style={styles.sectionTitle}
        >
          Neler Yapabilirsiniz?
        </Animatable.Text>
        
        <View style={styles.featuresContainer}>
          {[
            {
              icon: <Ionicons name="moon" size={32} color="#38a1ec" />,
              title: "Rüya Yorumu",
              text: "Rüyalarınızı anında yorumlayın ve anlamlarını keşfedin.",
              route: "/dream/chat",
              color: "#38a1ec",
              delay: 900
            },
            {
              icon: <MaterialCommunityIcons name="book-open-variant" size={32} color="#e74c3c" />,
              title: "Rüya Arşivi",
              text: "Kaydettiğiniz tüm rüyalarınızı görüntüleyin ve inceleyin.",
              route: "/dream/archive",
              color: "#e74c3c",
              delay: 1100
            },
            {
              icon: <MaterialCommunityIcons name="chart-bar" size={32} color="#2ecc71" />,
              title: "Rüya Analizleri",
              text: "Rüya örüntülerinizi analiz edin ve içgörüler kazanın.",
              route: "/dream/analytics",
              color: "#2ecc71",
              delay: 1300
            },
            {
              icon: <Ionicons name="eye" size={32} color="#9c59b6" />,
              title: "İçgörüler",
              text: "Bilinçaltınızın derinliklerinden gelen mesajları ve yaşam örüntülerinizi keşfedin.",
              route: "/dream/insights",
              color: "#9c59b6",
              delay: 1500
            }
          ].map((feature, index) => (
            <Animatable.View 
              key={index}
              animation="fadeInUp"
              delay={feature.delay}
              duration={800}
            >
              <TouchableOpacity 
                style={[styles.featureCard, { borderLeftColor: feature.color }]}
                onPress={() => router.push(feature.route)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['rgba(31, 31, 48, 0.95)', 'rgba(31, 31, 48, 0.85)']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.featureCardGradient}
                >
                  {feature.icon}
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>
        
        {/* İpuçları Kartı - Animasyonlu */}
        <Animatable.Text 
          animation="fadeIn"
          delay={1500}
          style={styles.sectionTitle}
        >
          Rüya Günlüğü İpuçları
        </Animatable.Text>
        
        <Animatable.View 
          animation="fadeInUp"
          delay={1700}
          duration={800}
        >
          <LinearGradient
            colors={['rgba(31, 31, 48, 0.95)', 'rgba(31, 31, 48, 0.85)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.tipsCard}
          >
            {[
              {
                icon: <FontAwesome5 name="book" size={18} color={theme.colors.primary} />,
                text: "Rüyalarınızı uyandıktan hemen sonra kaydedin.",
                delay: 1800
              },
              {
                icon: <FontAwesome5 name="bed" size={18} color={theme.colors.primary} />,
                text: "Uyumadan önce rüya görmek istediğinizi kendinize hatırlatın.",
                delay: 1900
              },
              {
                icon: <FontAwesome5 name="moon" size={18} color={theme.colors.primary} />,
                text: "Tekrarlayan sembollere ve temalara dikkat edin.",
                delay: 2000
              }
            ].map((tip, index) => (
              <Animatable.View 
                key={index}
                animation="fadeInLeft"
                delay={tip.delay}
                style={styles.tipItem}
              >
                {tip.icon}
                <Text style={styles.tipText}>{tip.text}</Text>
              </Animatable.View>
            ))}
          </LinearGradient>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  welcomeCardContainer: {
    marginBottom: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  welcomeCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(247, 203, 47, 0.35)',
    overflow: 'hidden',
  },
  welcomeTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  welcomeButton: {
    backgroundColor: theme.colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  welcomeButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    marginRight: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  featuresContainer: {
    flexDirection: 'column',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  featureCard: {
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  featureCardGradient: {
    padding: theme.spacing.md,
    borderTopRightRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  featureText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  tipsCard: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: 'rgba(31, 31, 48, 0.5)',
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  tipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    flex: 1,
    lineHeight: 20,
  },
});
