import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 【重要】Firebaseコンソールの「プロジェクトの設定」にある値に書き換えてください
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // ここを書き換え
  authDomain: "room-91a4c.firebaseapp.com",
  databaseURL: "https://room-91a4c-default-rtdb.firebaseio.com", // ←画像で見せてくれたURLです！
  projectId: "room-91a4c",
  storageBucket: "room-91a4c.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID", // ここを書き換え
  appId: "YOUR_APP_ID" // ここを書き換え
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "chat");

const messageArea = document.getElementById("message-area");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = messageInput.value;
    if (msg) {
        push(dbRef, { text: msg, sender: "me", time: Date.now() });
        messageInput.value = "";
    }
});

onChildAdded(dbRef, (data) => {
    const v = data.val();
    const div = document.createElement("div");
    div.classList.add("msg", v.sender === "me" ? "sent" : "received");
    div.textContent = v.text;
    messageArea.appendChild(div);
    messageArea.scrollTop = messageArea.scrollHeight;
});
