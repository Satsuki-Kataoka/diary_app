// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001'; // バックエンドのURL

function App() {
  const [diaries, setDiaries] = useState([]);
  const [newDiary, setNewDiary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 最初に日記を読み込む
  useEffect(() => {
    fetch(`${API_URL}/api/diaries`)
      .then(res => res.json())
      .then(data => setDiaries(data.reverse())); // 新しい順に表示
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDiary.trim()) return;

    setIsLoading(true);

    const response = await fetch(`${API_URL}/api/diaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newDiary }),
    });

    const savedDiary = await response.json();
    setDiaries([savedDiary, ...diaries]);
    setNewDiary('');
    setIsLoading(false);
  };

  return (
    <div className="App">
      <h1>日記アプリ</h1>
      <form onSubmit={handleSubmit} className="diary-form">
        <textarea
          value={newDiary}
          onChange={(e) => setNewDiary(e.target.value)}
          placeholder="今日あったことを書こう"
          rows="5"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : '日記を保存する'}
        </button>
      </form>

      <div className="diary-list">
        <h2>過去の日記</h2>
        {diaries.map(diary => (
          <div key={diary.id} className="diary-entry">
            <p>{diary.content}</p>
            {diary.aiComment && (
              <div className="ai-comment">
                <strong>AIからのコメント:</strong> {diary.aiComment}
              </div>
            )}
            <small>{new Date(diary.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;