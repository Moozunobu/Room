import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, update, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 画像から取得した正確な値を反映しました
const firebaseConfig = {
    apiKey: "AIzaSyDjPKMYS1fgWO1DYJ6sZWDphpXHekHuJTk",
    authDomain: "room-91a4c.firebaseapp.com",
    databaseURL: "https://room-91a4c-default-rtdb.firebaseio.com",
    projectId: "room-91a4c",
    storageBucket: "room-91a4c.firebasestorage.app",
    messagingSenderId: "1074762633292",
    appId: "1:1074762633292:web:103695db76a1178ea564e9",
    measurementId: "G-BNFL18VHMJ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "chat");

const messageArea = document.getElementById("message-area");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");

// IPアドレス取得
async function getIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch (e) { return "unknown"; }
}

// 送信処理
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = messageInput.value;
    if (!text) return;

    const ip = await getIP();
    const now = new Date();
    // 時刻のフォーマット (例: 12:05)
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    push(dbRef, {
        text: text,
        sender: "me", // TODO: ユーザー識別機能を追加するとさらに良くなります
        time: timeStr,
        ip: ip,
        isRead: false
    });

    messageInput.value = "";
});

// 受信・表示処理
onChildAdded(dbRef, (data) => {
    const v = data.val();
    const key = data.key;
    
    const div = document.createElement("div");
    div.classList.add("msg-container");
    div.innerHTML = `
        <div class="msg ${v.sender === 'me' ? 'sent' : 'received'}">
            <div class="text"></div>
            <div class="info">
                <span class="time">${v.time}</span>
                ${v.sender === 'me' ? `<span class="status" id="status-${key}">${v.isRead ? '既読' : '未読'}</span>` : ''}
            </div>
        </div>
    `;
    // セキュリティ対策（XSS対策）としてテキストは別途挿入
    div.querySelector('.text').textContent = v.text;
    messageArea.appendChild(div);

    // 相手のメッセージを表示したら既読にする
    if (v.sender !== "me") {
        update(ref(db, `chat/${key}`), { isRead: true });
    }

    // 既読状態のリアルタイム監視
    if (v.sender === "me") {
        onValue(ref(db, `chat/${key}/isRead`), (snapshot) => {
            const statusEl = document.getElementById(`status-${key}`);
            if (statusEl && snapshot.val() === true) {
                statusEl.innerText = "既読";
            }
        });
    }
    
    messageArea.scrollTop = messageArea.scrollHeight;
});
