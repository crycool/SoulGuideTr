import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, ActivityIndicator, View, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import DreamCard from './DreamCard';
import InsightPromptBanner from './InsightPromptBanner';
import { DreamRecord } from '../_utils/messageTypes';
import { theme } from '../../../theme';

interface DreamArchiveListProps {
  dreams: DreamRecord[];
  onDreamPress: (dreamId: string) => void;
  onDreamDelete: (dreamId: string) => void;
  isLoading: boolean;
}

const DreamArchiveList: React.FC<DreamArchiveListProps> = ({
  dreams,
  onDreamPress,
  onDreamDelete,
  isLoading
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Animatable.View>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={500}
      delay={index * 100}
      useNativeDriver={true}
    >
      <DreamCard
        dream={item}
        onPress={() => onDreamPress(item.id)}
        onLongPress={() => onDreamDelete(item.id)}
      />
    </Animatable.View>
  );

  return (
    <FlatList
      data={dreams}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      initialNumToRender={8}
      maxToRenderPerBatch={5}
      windowSize={10}
      removeClippedSubviews={Platform.OS === 'android'}
      ListHeaderComponent={<InsightPromptBanner dreamCount={dreams.length} />}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 3,
  },
  separator: {
    height: theme.spacing.md,
  }
});

export default DreamArchiveList;