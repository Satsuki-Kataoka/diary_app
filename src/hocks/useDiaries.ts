// src/hooks/useDiaries.ts
import { useState, useEffect, useCallback } from 'react';
import { DiaryEntry } from '../types';
import { fetchAllDiaries, fetchDiaryEntry, saveDiaryEntry } from '../api/diaryApi';

// このフックが返す値の型を定義
interface UseDiariesReturn {
  diaries: DiaryEntry[];
  isLoading: boolean;
  error: Error | null;
  addDiary: (newDiaryData: Omit<DiaryEntry, 'entryId' | 'date' | 'aiComment'>) => Promise<void>;
  getDiaryById: (id: string) => Promise<DiaryEntry | undefined>;
  refreshDiaries: () => void;
}

export const useDiaries = (): UseDiariesReturn => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 日記一覧を取得するメインの関数
  const loadDiaries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedDiaries = await fetchAllDiaries();
      setDiaries(fetchedDiaries);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // フックがマウントされた時に一度だけ日記を読み込む
  useEffect(() => {
    loadDiaries();
  }, [loadDiaries]);

  // 新しい日記を追加する関数
  const addDiary = useCallback(async (
    newDiaryData: Omit<DiaryEntry, 'entryId' | 'date' | 'aiComment'>
  ) => {
    try {
      // APIを呼び出してサーバーに保存
      const savedEntry = await saveDiaryEntry(newDiaryData);
      // フロントエンドの状態も更新
      setDiaries((prevDiaries) => [savedEntry, ...prevDiaries]);
    } catch (e) {
      console.error('Failed to add diary:', e);
      // エラーを呼び出し元に投げることで、UI側でエラーハンドリングできる
      throw e;
    }
  }, []);
  
  // 特定のIDの日記を取得する関数
  // 注意: これは詳細画面用のフックに分離する方がより良い設計の場合もある
  const getDiaryById = useCallback(async (id: string): Promise<DiaryEntry | undefined> => {
      // まずはローカルのキャッシュ（state）から探す
      const cachedDiary = diaries.find(d => d.entryId === id);
      if (cachedDiary) {
          // AIコメントがなければ最新のデータを取得しにいく
          if(!cachedDiary.aiComment) {
              const freshDiary = await fetchDiaryEntry(id);
              // ローカルのstateも更新
              setDiaries(prev => prev.map(d => d.entryId === id ? freshDiary : d));
              return freshDiary;
          }
          return cachedDiary;
      }
      
      // キャッシュになければAPIから取得
      try {
          const fetchedDiary = await fetchDiaryEntry(id);
          return fetchedDiary;
      } catch (e) {
          console.error(`Failed to fetch diary with id ${id}:`, e);
          return undefined;
      }
  }, [diaries]);

  // 手動で一覧をリフレッシュする関数（Pull-to-Refreshなどで使用）
  const refreshDiaries = useCallback(() => {
    loadDiaries();
  }, [loadDiaries]);


  return {
    diaries,
    isLoading,
    error,
    addDiary,
    getDiaryById,
    refreshDiaries,
  };
};