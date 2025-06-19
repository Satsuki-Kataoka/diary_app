import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [diaries, setDiaries] = useState([]);
  const [newDiaryText, setNewDiaryText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('😊');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // アプリ起動時に日記を読み込む
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/diaries`)
      .then(res => res.json())
      .then(data => setDiaries(data))
      .catch(err => console.error("Failed to fetch diaries:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDiaryText.trim() && !selectedEmotion) {
      setError('日記を書くか、感情を選んでください。');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/diaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newDiaryText, emotion: selectedEmotion }),
      });

      if (!response.ok) {
        throw new Error('日記の保存に失敗しました。');
      }

      const savedDiary = await response.json();
      setDiaries([savedDiary, ...diaries]);
      setNewDiaryText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>日記アプリ</h1>
      </header>

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