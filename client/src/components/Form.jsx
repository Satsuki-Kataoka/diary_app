import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ onNewEntry }) => {
    const [text, setText] = useState('');
    const [emotion, setEmotion] = useState('ok'); // デフォルト感情

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) {
            alert('日記を入力してください。');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/entries', { text, emotion });
            onNewEntry(res.data); // 親コンポーネントに新しい日記データを渡す
            setText(''); // フォームを空にする
        } catch (error) {
            console.error('Error submitting diary', error);
            alert('日記の投稿に失敗しました。');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="diary-form">
            <h3>今日の日記を書くページ</h3>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="今日の出来事や感じたことを自由に入力してください。"
                rows="6"
            ></textarea>
            {/* TODO: 感情選択ボタンをここに追加 */}
            <button type="submit">日記を記録する</button>
        </form>
    );
};

export default Form;