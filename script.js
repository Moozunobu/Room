import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 画像の情報をここに反映させました
const firebaseConfig = {
  apiKey: "AIzaSyDjPKMYS1fgWO1DYJ6sZWDphpXHekHuJTk",
  authDomain: "realtime-database-cd4bb.firebaseapp.com",
  // Realtime Databaseを使う場合、以下のURLが必要です
  databaseURL: "https://realtime-database-cd4bb-default-rtdb.firebaseio.com", 
  projectId: "realtime-database-cd4bb",
  storageBucket: "realtime-database-cd4bb.firebasestorage.app",
  messagingSenderId: "1074762633292",
  appId: "1:1074762633292:web:103695db76a1178ea564e9",
  measurementId: "G-BNFL18VHMJ"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "chat");

// --- 以下、前回と同じ送受信ロジック ---
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
