// ライブラリの読み込み
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
require('dotenv').config(); // .envファイルから環境変数を読み込む

const app = express();
const port = 3000;

// JSONとURLエンコードされたリクエストを解析するためのミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// publicフォルダ内の静的ファイル（HTML, CSS, JS）を配信
app.use(express.static('public'));

// データベースのセットアップ
let db;
(async () => {
    db = await open({
        filename: './diary.db',
        driver: sqlite3.Database
    });

    // diariesテーブルがなければ作成する
    await db.exec(`
        CREATE TABLE IF NOT EXISTS diaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            emotion TEXT,
            content TEXT,
            ai_comment TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
})();

// 基本的なルート
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// サーバーを起動
app.listen(port, () => {
    console.log(`日記アプリが http://localhost:${port} で起動しました`);
});

// 変更点 1: Googleのライブラリを読み込む
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 変更点 2: GoogleのAIクライアントを初期化
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// API: 新しい日記を保存（AIコメント生成もここ）
app.post('/api/diaries', async (req, res) => {
    const { content, emotion } = req.body;
    const date = new Date().toISOString();
    
    let aiComment = '';
    
    // 内容がある場合のみAIにコメントを依頼
    if (content) {
        try {
            // 変更点 3: AIにコメントを依頼する部分をGemini用に書き換え
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `あなたは心優しいカウンセラーです。以下の日記に対して、共感的で、ポジティブになれるような短いコメントを日本語でしてください。\n\n日記の内容:\n「${content}」\n感情: ${emotion || '記載なし'}`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            aiComment = response.text().trim();

        } catch (error) {
            console.error("AIコメントの生成に失敗しました:", error);
            // AIが失敗しても日記の保存は続行する
        }
    }

    // データベースに保存
    try {
        await db.run(
            'INSERT INTO diaries (date, emotion, content, ai_comment) VALUES (?, ?, ?, ?)',
            [date, emotion, content, aiComment]
        );
        res.status(201).json({ message: '日記が保存されました。' });
    } catch (dbError) {
        console.error("データベースへの保存に失敗しました:", dbError);
        res.status(500).json({ message: 'データベースエラー' });
    }
});

// server.js の下の方に追記
const cron = require('node-cron');

// 毎日22:00にタスクを実行
cron.schedule('0 22 * * *', () => {
    console.log('------------------------------------');
    console.log('もうすぐ一日が終わりますね。今日の日記を書きませんか？');
    console.log('------------------------------------');
}, {
    timezone: "Asia/Tokyo"
});