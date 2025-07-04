// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Platform } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker'; // 時間選択UIに必要

export const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState(new Date());
  // const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    // const currentDate = selectedDate || notificationTime;
    // setShowTimePicker(Platform.OS === 'ios');
    // setNotificationTime(currentDate);
    // ここで通知スケジュールを更新するロジックを呼ぶ
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.label}>通知を有効にする</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={setNotificationsEnabled}
          value={notificationsEnabled}
        />
      </View>

      {notificationsEnabled && (
        <View style={styles.settingRow}>
          <Text style={styles.label}>通知時刻</Text>
          {/* 
            DateTimePickerはセットアップが少し複雑なためコメントアウト。
            実際にはここで時間選択UIを表示する。
          */}
          <Text style={styles.timeText}>
            {notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 18,
    },
    timeText: {
      fontSize: 18,
      color: '#007AFF',
      fontWeight: 'bold',
    }
});