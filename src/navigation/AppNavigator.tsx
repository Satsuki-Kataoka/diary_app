// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// 各画面のコンポーネントをインポート
import { HomeScreen } from '../screens/HomeScreen';
import { DiaryEditorScreen } from '../screens/DiaryEditorScreen';
import { DiaryDetailScreen } from '../screens/DiaryDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

import { DiaryEntry } from '../types'; // パラメータの型定義に使用

// 1. 各画面が受け取るパラメータの型を定義
export type RootStackParamList = {
  Home: undefined; // Home画面はパラメータを受け取らない
  DiaryDetail: { entryId: string }; // DiaryDetail画面はentryIdを必須パラメータとして受け取る
  DiaryEditor: { entry?: DiaryEntry }; // DiaryEditorは編集のために既存のDiaryEntryをオプショナルで受け取る
  Settings: undefined;
};

// 2. スタックナビゲーターを作成
const Stack = createNativeStackNavigator<RootStackParamList>();

// 3. ナビゲーターコンポーネントを定義
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        initialRouteName="Home" // アプリ起動時に最初に表示する画面
        screenOptions={{
          // 全画面に共通のヘッダースタイルなどを設定可能
          headerStyle: {
            backgroundColor: '#f8f8f8',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'マイダイアリー' }} // ヘッダーに表示されるタイトル
        />
        <Stack.Screen
          name="DiaryDetail"
          component={DiaryDetailScreen}
          options={{ title: '日記の詳細' }}
        />
        <Stack.Screen
          name="DiaryEditor"
          component={DiaryEditorScreen}
          options={{ 
            title: '日記を書く',
            presentation: 'modal', // 編集画面は下からスライドアップするモーダル表示にする
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: '設定' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};