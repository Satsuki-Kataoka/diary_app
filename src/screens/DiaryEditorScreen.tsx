// src/screens/DiaryEditorScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from 'react-native';
import { useDiaries } from '../hooks/useDiaries';
import { EmotionSelector } from '../components/EmotionSelector';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DiaryEditor'>;

export const DiaryEditorScreen = ({ navigation, route }: Props) => {
  const entryToEdit = route.params?.entry;
  const { addDiary } = useDiaries(); // ここではaddDiaryのみ使用（編集機能は別途実装）

  const [content, setContent] = useState(entryToEdit?.content || '');
  const [emotion, setEmotion] = useState(entryToEdit?.emotionEmoji || '😊');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (content.trim() === '' && !emotion) {
      alert('何か入力するか、感情を選択してください。');
      return;
    }
    setIsSaving(true);
    try {
      // 現状は新規作成のみ。編集の場合は別のAPI関数を呼ぶ
      await addDiary({
        content,
        emotionEmoji: emotion,
        displayImagePath: 'paper_style_default.png',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save diary:', error);
      alert('保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>今日の出来事</Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="どんな一日でしたか？"
        value={content}
        onChangeText={setContent}
      />

      <Text style={styles.label}>今の気分は？</Text>
      <EmotionSelector selectedEmotion={emotion} onSelect={setEmotion} />

      <View style={styles.buttonContainer}>
        <Button title="キャンセル" onPress={() => navigation.goBack()} color="#888" />
        <Button title={isSaving ? "保存中..." : "保存する"} onPress={handleSave} disabled={isSaving} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  textInput: {
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  }
});