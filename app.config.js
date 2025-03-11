import 'dotenv/config';

export default {
  expo: {
    name: 'SoulGuide',
    slug: 'SoulGuide',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/app-icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0a0a18'
    },
    android12: {
      splash: {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#0a0a18'
      }
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.muyufa.soulguide'
    },
    android: {
      package: "com.muyufa.soulguide",
      adaptiveIcon: {
        foregroundImage: './assets/app-icon.png',
        backgroundColor: '#000000'
      },
      splash: {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#0a0a18'
      },
      permissions: ["INTERNET"]
    },
    web: {
      favicon: './assets/images/favicon.png'
    },
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      eas: {
        projectId: "cd1bfc72-9b1a-4b7d-9fd5-1bf3b97b66f0"
      }
    },
    plugins: [
      [
        'expo-router',
        {
          asyncRoutes: {
            asyncRoutesMaxAge: 60 * 1000, 
            asyncRoutesMinAge: 0,
            enablePrefetch: true,
            enablePreload: true,
            prefetchOnAppLoad: true
          }
        }
      ]
    ]
  }
};