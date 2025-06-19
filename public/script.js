document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-btn');
    const diaryContent = document.getElementById('diary-content');
    const diariesList = document.getElementById('diaries-list');
    const emotionButtons = document.querySelectorAll('.emotion-btn');
    const selectedEmotionInput = document.getElementById('selected-emotion');

    // 感情ボタンの選択処理
    emotionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            emotionButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedEmotionInput.value = btn.dataset.emotion;
        });
    });

    // 日記を保存する機能
    saveBtn.addEventListener('click', async () => {
        const content = diaryContent.value;
        const emotion = selectedEmotionInput.value;

        if (!content && !emotion) {
            alert('日記の内容か感情のどちらかを入力してください。');
            return;
        }

        const response = await fetch('/api/diaries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, emotion })
        });

        if (response.ok) {
            diaryContent.value = '';
            selectedEmotionInput.value = '';
            emotionButtons.forEach(b => b.classList.remove('selected'));
            loadDiaries(); // 保存後にリストを再読み込み
        } else {
            alert('日記の保存に失敗しました。');
        }
    });

    // 過去の日記を読み込む機能
    async function loadDiaries() {
        const response = await fetch('/api/diaries');
        const diaries = await response.json();
        
        diariesList.innerHTML = ''; // リストをクリア
        diaries.forEach(diary => {
            const card = document.createElement('div');
            card.className = 'diary-card';
            card.innerHTML = `
                <h3>${new Date(diary.date).toLocaleDateString()} ${diary.emotion || ''}</h3>
                <p>${diary.content.replace(/\n/g, '<br>')}</p>
                ${diary.ai_comment ? `<div class="ai-comment"><strong>AIからのコメント:</strong> ${diary.ai_comment}</div>` : ''}
            `;
            diariesList.appendChild(card);
        });
    }

    // ページ読み込み時に日記を読み込む
    loadDiaries();
});