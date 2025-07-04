// src/components/DiaryListItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DiaryEntry } from '../types';

interface Props {
  item: DiaryEntry;
  onPress: (entryId: string) => void;
}

export const DiaryListItem = ({ item, onPress }: Props) => {
  const formattedDate = item.date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item.entryId)}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{item.emotionEmoji}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.contentText} numberOfLines={2}>
          {item.content || '（感情のみの日記）'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  emojiContainer: {
    marginRight: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
  },
  emoji: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  contentText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 21,
  },
});