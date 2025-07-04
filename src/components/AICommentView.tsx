// src/components/AICommentView.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AIComment } from '../types';

interface Props {
  comment: AIComment;
}

export const AICommentView = ({ comment }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AIからのコメント</Text>
      <Text style={styles.content}>{comment.commentContent}</Text>
      <Text style={styles.date}>{comment.createdAt.toLocaleDateString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f8ff', // 薄い青色
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#add8e6',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005f73',
    marginBottom: 5,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 10,
  }
});