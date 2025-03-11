import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { ExternalLink } from './ExternalLink';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text style={styles.getStartedText}>
          SoulGuide ile ruhsal yolculuğunuz başlıyor
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>
            Rüyalarınızı anlamak için AI destekli analiz sistemimizi kullanın
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
    color: '#FFD700',
  },
});