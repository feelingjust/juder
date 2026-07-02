const firebaseConfig = {
    apiKey: "AIzaSyAe9HxA15vJmWzlQ5ylseqL2UkeRFl_Y3c",
    authDomain: "kerjagmael.firebaseapp.com",
    databaseURL: "https://kerjagmael-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kerjagmael",
    storageBucket: "kerjagmael.firebasestorage.app",
    messagingSenderId: "547899627063",
    appId: "1:547899627063:web:1145b35ecbf6edb5efd1b2",
    measurementId: "G-7Z91LF3289"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

try {
    firebase.analytics();
} catch (err) {
    console.warn('Firebase Analytics tidak aktif di browser ini:', err);
}

window.currentUser = null;
window.globalData = { tasks: [], users: {}, withdraws: [], chats: {} };

window.pushDataToCloud = function() {
    db.collection("platform_data").doc("central_storage").set(window.globalData);
};

window.processWork = function(user, act) {
    if(act === 'approve') {
        const t = window.globalData.tasks.find(task => task.id === window.globalData.users[user].taskId);
        window.globalData.users[user].status = 'done';
        window.globalData.users[user].saldo = (window.globalData.users[user].saldo || 0) + (t ? t.reward : 0);
    } else if(act === 'reject') {
        window.globalData.users[user].status = 'failed';
    } else {
        window.globalData.users[user].taskId = null;
        window.globalData.users[user].status = 'pending';
        window.globalData.users[user].workNotes = '';
    }
    window.pushDataToCloud();
};

window.processWd = function(idx, act) {
    if(act === 'approve') {
        window.globalData.withdraws[idx].status = 'success';
    } else {
        const wd = window.globalData.withdraws[idx];
        if(window.globalData.users[wd.username]) {
            window.globalData.users[wd.username].saldo += wd.amount;
        }
        window.globalData.withdraws.splice(idx, 1);
    }
    window.pushDataToCloud();
};

window.deleteTask = function(idx) {
    window.globalData.tasks.splice(idx, 1);
    window.pushDataToCloud();
};

window.deleteUser = function(user) {
    delete window.globalData.users[user];
    delete window.globalData.chats[user];
    window.globalData.withdraws = window.globalData.withdraws.filter(w => w.username !== user);
    window.pushDataToCloud();
};