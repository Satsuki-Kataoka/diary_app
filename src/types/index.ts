// src/types/index.ts

// User クラスに対応
export interface User {
  userId: string;
  name: string;
  email: string;
  settings: NotificationSettings;
}

// NotificationSettings クラスに対応
export interface NotificationSettings {
  isEnabled: boolean;
  notificationTime: string; // "HH:mm" 形式の文字列などで表現
}

// AIComment クラスに対応
export interface AIComment {
  commentId: string;
  commentContent: string;
  createdAt: Date;
}

// DiaryEntry クラスに対応
export interface DiaryEntry {
  entryId: string;
  date: Date;
  content: string;
  emotionEmoji: string;
  displayImagePath: string; // "paper_style_1.png" など
  aiComment?: AIComment; // AIコメントは後から付与されるためオプショナル
}

// WeeklySummary クラスに対応
export interface WeeklySummary {
  summaryId: string;
  startDate: Date;
  endDate: Date;
  summaryContent: string;
}