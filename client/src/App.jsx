import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from './components/Form';
import './App.css';

function App() {
    const [entries, setEntries] = useState([]);

    // 最初に日記データをサーバーから読み込む
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/entries');
                setEntries(res.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchEntries();
    }, []);

    // 新しい日記が追加されたときの処理
    const handleNewEntry = (newEntry) => {
        setEntries([newEntry, ...entries]); // リストの先頭に新しい日記を追加
    };

    return (
        <div className="App">
            <header>
                <h1>日記アプリ</h1>
            </header>

            <div className="feature-list">
                <div className="sticky-note">文章入力</div>
                <div className="sticky-note">一日の最後に忘れないように通知</div>
                <div className="sticky-note">感情を選択するだけでもOK</div>
                <div className="sticky-note">1週間ごとにまとめ表示</div>
                <div className="sticky-note">AIが日記に対してコメントしてくれる</div>
                <div className="sticky-note">紙の日記のような画面表示</div>
            </div>

            <main>
                <Form onNewEntry={handleNewEntry} />
                
                <div className="diary-list">
                    <h2>過去の日記を見る</h2>
                    {entries.length > 0 ? (
                        entries.map(entry => (
                            <div key={entry._id} className="diary-entry sticky-note">
                                <p className="entry-date">{new Date(entry.createdAt).toLocaleDateString()}</p>
                                <p className="entry-text">{entry.text}</p>
                                {entry.aiComment && (
                                    <p className="ai-comment"><strong>AIからのコメント:</strong> {entry.aiComment}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>まだ日記はありません。</p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;