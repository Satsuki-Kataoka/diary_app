require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Google AIの初期化
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in .env file");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 本来はデータベースを使うが、簡単のためメモリ上の配列でデータを保持
let diaries = []; 
let nextId = 1;

// API: 日記の一覧を取得
app.get('/api/diaries', (req, res) => {
  // 新しいものが上に来るようにソートして返す
  res.json([...diaries].sort((a, b) => b.id - a.id));
});

// API: 新しい日記を投稿
app.post('/api/diaries', async (req, res) => {
  const { content, emotion } = req.body;

  if (!content && !emotion) {
    return res.status(400).json({ error: 'Content or emotion is required' });
  }

  // AIに渡すためのテキストを準備
  const promptText = content || `今日は${emotion}な気分の1日でした。`;

  // AIによるコメント生成
  let aiComment = '';
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `以下の日記に対して、友達のように優しく短いコメントをしてください。\n\n日記：${promptText}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    aiComment = response.text();
  } catch (error) {
    console.error("AI comment generation failed:", error);
    aiComment = "AIからのコメントの取得に失敗しました。";
  }

  const newDiary = {
    id: nextId++,
    content: content,
    emotion: emotion,
    aiComment: aiComment,
    createdAt: new Date(),
  };

  diaries.push(newDiary);
  res.status(201).json(newDiary);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});