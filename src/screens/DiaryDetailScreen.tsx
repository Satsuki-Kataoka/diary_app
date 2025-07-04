// src/screens/DiaryDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import { useDiaries } from '../hooks/useDiaries';
import { AICommentView } from '../components/AICommentView';
import { DiaryEntry } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DiaryDetail'>;

// 紙のような背景画像のダミーパス
const paperBackground = require('../../assets/paper-background.png'); // プロジェクトのassetsフォルダに画像ファイルを配置

export const DiaryDetailScreen = ({ route }: Props) => {
  const { entryId } = route.params;
  const { getDiaryById } = useDiaries();

  const [diary, setDiary] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDiary = async () => {
      const fetchedDiary = await getDiaryById(entryId);
      if (fetchedDiary) {
        setDiary(fetchedDiary);
      }
      setIsLoading(false);
    };
    loadDiary();
  }, [entryId, getDiaryById]);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (!diary) {
    return <View style={styles.centered}><Text>日記が見つかりませんでした。</Text></View>;
  }

  return (
    <ImageBackground source={paperBackground} style={styles.imageBackground} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.date}>{new Date(diary.date).toLocaleDateString()}</Text>
        <Text style={styles.emotion}>{diary.emotionEmoji}</Text>
        <Text style={styles.content}>{diary.content}</Text>
        {diary.aiComment && <AICommentView comment={diary.aiComment} />}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emotion: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'serif', // 手書き風フォントなどを指定するとより雰囲気がでる
    color: '#333',
  },
});