import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { theme } from '../../theme';

const CustomNavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Tab'in aktif olup olmadığını kontrol et - useCallback ile optimize edildi
  const isActive = useCallback((path: string) => {
    return pathname.startsWith(path);
  }, [pathname]);

  const navigateTo = useCallback((path: string) => {
    // Native platformlarda taşma sorununu önlemek için navigasyon yığınını yönet
    // Aynı tipteki sayfalar arasında geçiş yaparken replace kullan
    if (pathname.startsWith(path)) {
      // Zaten aynı tip sayfadayız, sadece yenile
      return;
    }
    
    // Ana sekme geçişleri için replace kullan
    if (path.startsWith('/home') || 
        path.startsWith('/dream/chat') || 
        path.startsWith('/dream/archive') || 
        path.startsWith('/dream/analytics') || 
        path.startsWith('/(tabs)/dream/insights')) {
      router.replace(path);
    } else {
      router.push(path);
    }
  }, [router, pathname]);

  // Tab yapılandırması - useMemo ile optimize edildi
  const tabs = useMemo(() => [
    {
      path: '/home',
      label: 'Anasayfa',
      icon: 'home',
      IconComponent: Ionicons
    },
    {
      path: '/dream/chat',
      label: 'Rüya Yorumu',
      icon: 'moon',
      IconComponent: Ionicons
    },
    {
      path: '/dream/archive',
      label: 'Geçmiş',
      icon: 'book-open-variant',
      IconComponent: MaterialCommunityIcons
    },
    {
      path: '/dream/analytics',
      label: 'Analizler',
      icon: 'chart-bar',
      IconComponent: MaterialCommunityIcons
    },
    {
      path: '/(tabs)/dream/insights',
      label: 'İçgörüler',
      icon: 'eye-outline',
      IconComponent: Ionicons
    }
  ], []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        {tabs.map((tab, index) => {
          const active = isActive(tab.path);
          const { IconComponent } = tab;
          
          return (
            <TouchableOpacity 
              key={tab.path}
              style={[styles.tabItem, active && styles.activeTab]} 
              onPress={() => navigateTo(tab.path)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <IconComponent
                  name={tab.icon}
                  size={24}
                  color={active ? theme.colors.primary : theme.colors.inactiveTab}
                />
                <Text style={[styles.tabText, active && styles.activeText]}>
                  {tab.label}
                </Text>
              </View>
              
              {active && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: { paddingBottom: 20 },
      android: { paddingBottom: 0 }
    }),
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 31, 48, 0.95)',
    height: 65,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    ...theme.shadows.lg,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(247, 203, 47, 0.1)',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  tabText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.inactiveTab,
    marginTop: 4,
  },
  activeText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default CustomNavigationBar;