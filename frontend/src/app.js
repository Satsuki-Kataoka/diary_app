import React, { useState, useEffect } from 'react';
import './App.css'; // Appコンポーネント専用のCSSを読み込む

// バックエンドサーバーのURL
const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [diaries, setDiaries] = useState([]); // 日記リストの状態
  const [newDiaryText, setNewDiaryText] = useState(''); // 入力中の日記テキストの状態
  const [selectedEmotion, setSelectedEmotion] = useState('😊'); // 選択中の感情の状態
  const [isLoading, setIsLoading] = useState(false); // データ送信中の状態
  const [error, setError] = useState(''); // エラーメッセージの状態

  // この関数は、アプリが最初に表示されたときに一度だけ実行される
  useEffect(() => {
    // バックエンドから日記データを取得する
    fetch(`${API_BASE_URL}/api/diaries`)
      .then(res => res.json())
      .then(data => {
        // 取得したデータをdiariesの状態にセットする
        setDiaries(data);
      })
      .catch(err => {
        console.error("日記の読み込みに失敗しました:", err);
        setError("サーバーから日記を読み込めませんでした。");
      });
  }, []); // 空の配列[]は「最初の一回だけ実行」を意味する

  // 「日記を保存する」ボタンが押されたときの処理
  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルトの送信動作をキャンセル

    // 何も入力されていなければ何もしない
    if (!newDiaryText.trim() && !selectedEmotion) {
      setError('日記を書くか、感情を選んでください。');
      return;
    }

    setIsLoading(true); // ローディング開始
    setError(''); // 前のエラーをクリア

    try {
      // バックエンドに日記データを送信する
      const response = await fetch(`${API_BASE_URL}/api/diaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newDiaryText,
          emotion: selectedEmotion,
        }),
      });

      // サーバーからの応答がエラーでないかチェック
      if (!response.ok) {
        throw new Error('日記の保存に失敗しました。');
      }

      // 保存が成功したら、サーバーから返された新しい日記データを取得
      const savedDiary = await response.json();

      // 現在の日記リストの先頭に、新しい日記を追加して画面を更新
      setDiaries([savedDiary, ...diaries]);
      
      // 入力フォームを空にする
      setNewDiaryText('');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // ローディング終了
    }
  };

  // ここから下が画面に表示される内容 (JSX)
  return (
    <div className="container">
      <header>
        <h1>日記アプリ</h1>
      </header>

      {/* 日記入力フォーム */}
      <form onSubmit={handleSubmit} className="card input-card">
        <div className="emotion-selector">
          <h3>今日の気分は？</h3>
          <div>
            {['😊', '😄', '😐', '😢', '😠'].map(emo => (
              <span
                key={emo}
                className={`emotion ${selectedEmotion === emo ? 'selected' : ''}`}
                onClick={() => setSelectedEmotion(emo)}
              >
                {emo}
              </span>
            ))}
          </div>
        </div>
        <textarea
          value={newDiaryText}
          onChange={(e) => setNewDiaryText(e.target.value)}
          placeholder="今日あったことを書いてみよう（感情を選ぶだけでもOK！）"
          rows="4"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : '日記を保存する'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* 日記リスト */}
      <div className="diary-list">
        {diaries.map(diary => (
          <div key={diary.id} className="card diary-entry">
            <div className="diary-header">
              <span className="diary-emotion">{diary.emotion}</span>
              <span className="diary-date">{new Date(diary.createdAt).toLocaleString('ja-JP')}</span>
            </div>
            {diary.content && <p className="diary-content">{diary.content}</p>}
            <div className="ai-comment">
              <strong>AIより:</strong> {diary.aiComment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;