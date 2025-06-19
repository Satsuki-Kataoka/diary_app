require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const Diary = require('./models/diary');

const app = express();
const port = process.env.PORT || 5000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// Google AIの初期化
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// データベース接続
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// --- APIエンドポイント ---

// GET: すべての日記を取得
app.get('/api/entries', async (req, res) => {
    try {
        const entries = await Diary.find().sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching entries' });
    }
});

// POST: 新しい日記を作成
app.post('/api/entries', async (req, res) => {
    try {
        const { text, emotion } = req.body;

        // 1. AIモデルを選択
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // 2. AIへの指示を作成
        const prompt = `あなたはユーザーの日記に優しく寄り添う友人です。以下の日記に対して、短く、ポジティブで共感的なコメントを返してください。\n\n日記の内容：\n「${text}」`;

        // 3. AIからコメントを生成
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiComment = response.text();

        // 4. 新しい日記をデータベースに保存
        const newEntry = new Diary({
            text,
            emotion,
            aiComment,
        });
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);

    } catch (error) {
        console.error('Error creating entry:', error);
        res.status(500).json({ message: 'Error creating entry' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});