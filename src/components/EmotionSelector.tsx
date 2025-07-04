// src/components/EmotionSelector.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const EMOTIONS = ['😊', '😄', '🙂', '😐', '😔', '😭', '😠'];

interface Props {
  selectedEmotion: string;
  onSelect: (emotion: string) => void;
}

export const EmotionSelector = ({ selectedEmotion, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      {EMOTIONS.map((emoji) => (
        <TouchableOpacity
          key={emoji}
          style={[
            styles.emojiWrapper,
            selectedEmotion === emoji && styles.selectedEmojiWrapper,
          ]}
          onPress={() => onSelect(emoji)}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginVertical: 10,
  },
  emojiWrapper: {
    padding: 8,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedEmojiWrapper: {
    borderColor: '#007AFF', // iOSの標準的な青色
    backgroundColor: '#eaf4ff',
  },
  emoji: {
    fontSize: 30,
  },
});