// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './diary_app/diary_app/src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}