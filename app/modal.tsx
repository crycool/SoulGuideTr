import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { Text, View } from './_components/Themed';
import { Stack } from 'expo-router';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'SoulGuide' }} />
      <Text style={styles.title}>Rüya Analizi</Text>
      <View style={styles.content}>
        <Text style={styles.description}>
          Rüyalarınızı analiz etmek için yapay zeka destekli sistemimizi kullanabilirsiniz.
        </Text>
      </View>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2C1810',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  description: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});