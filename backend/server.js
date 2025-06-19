// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json()); // リクエストのbodyをJSONとして解析

// ★AIのセットアップ
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// データベースの代わりのインメモリ配列（簡単のため）
// 本来はここにPostgreSQLなどのデータベース処理が入ります
let diaries = [];
let nextId = 1;

// ヘルスチェック用
app.get('/', (req, res) => {
  res.send('Diary App API is running!');
});

// 日記の一覧を取得するAPI
app.get('/api/diaries', (req, res) => {
  res.json(diaries);
});

// 新しい日記を投稿するAPI
app.post('/api/diaries', async (req, res) => {
  const { content, emotion } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  // ★AIコメント生成処理
  let aiComment = '';
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `以下の日記に対して、友達のように優しく短いコメントをしてください。\n\n日記：${content}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    aiComment = response.text();
  } catch (error) {
    console.error("AI comment generation failed:", error);
    aiComment = "コメントを生成できませんでした。";
  }

  const newDiary = {
    id: nextId++,
    content,
    emotion,
    createdAt: new Date(),
    aiComment: aiComment, // AIのコメントも一緒に保存
  };

  diaries.push(newDiary);
  console.log('New diary added:', newDiary);
  res.status(201).json(newDiary);
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});