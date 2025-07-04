// src/screens/HomeScreen.tsx
import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useDiaries } from '../hooks/useDiaries';
import { DiaryListItem } from '../components/DiaryListItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons'; // アイコンライブラリの例

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const { diaries, isLoading, error, refreshDiaries } = useDiaries();

  // ヘッダーに設定ボタンを配置
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (isLoading && diaries.length === 0) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>エラーが発生しました: {error.message}</Text>
        <Button title="再試行" onPress={refreshDiaries} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={diaries}
        keyExtractor={(item) => item.entryId}
        renderItem={({ item }) => (
          <DiaryListItem 
            item={item} 
            onPress={(id) => navigation.navigate('DiaryDetail', { entryId: id })} 
          />
        )}
        onRefresh={refreshDiaries}
        refreshing={isLoading}
        ListEmptyComponent={
            <View style={styles.centered}>
                <Text>まだ日記がありません。</Text>
                <Text>最初の日記を書いてみましょう！</Text>
            </View>
        }
      />
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('DiaryEditor', {})}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Androidの影
    shadowColor: '#000', // iOSの影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
});