// src/api/diaryApi.ts
import { DiaryEntry, AIComment } from '../types';

const API_BASE_URL = 'https://api.example.com'; // ダミーURL

// 日記を保存するAPI (AIコメント生成もトリガーする)
export const saveDiaryEntry = async (
  entry: Omit<DiaryEntry, 'entryId' | 'date' | 'aiComment'>
): Promise<DiaryEntry> => {
  console.log('Saving diary entry:', entry);
  // 実際にはここで fetch や axios を使ってPOSTリクエストを送る
  // const response = await fetch(`${API_BASE_URL}/diaries`, { method: 'POST', ... });
  // const newEntry = await response.json();
  
  // ダミーレスポンス
  const newEntry: DiaryEntry = {
    ...entry,
    entryId: Math.random().toString(36).substr(2, 9),
    date: new Date(),
  };
  return newEntry;
};

// 特定の日記を取得するAPI (AIコメントも含む)
export const fetchDiaryEntry = async (entryId: string): Promise<DiaryEntry> => {
    console.log('Fetching diary entry:', entryId);
    // ダミーレスポンス。50%の確率でAIコメントが付与されるシミュレーション
    const hasAIComment = Math.random() > 0.5;
    const dummyEntry: DiaryEntry = {
        entryId,
        date: new Date(),
        content: '今日はとても良い一日だった。プロジェクトが進んで嬉しい。',
        emotionEmoji: '😊',
        displayImagePath: 'paper_style_1.png',
        aiComment: hasAIComment ? {
            commentId: 'comment-123',
            commentContent: 'プロジェクトの進捗、素晴らしいですね！その調子で頑張ってください。',
            createdAt: new Date()
        } : undefined
    };
    return dummyEntry;
};

// 日記の一覧を取得するAPI
export const fetchAllDiaries = async (): Promise<DiaryEntry[]> => {
    console.log('Fetching all diaries');
    // ダミーデータ
    return [
        { entryId: 'abc', date: new Date(2023, 10, 1), content: '一日目...', emotionEmoji: '🙂', displayImagePath: 'paper_style_1.png' },
        { entryId: 'def', date: new Date(2023, 10, 2), content: '二日目...', emotionEmoji: '😄', displayImagePath: 'paper_style_1.png' },
    ];
};