let recognition;
let isRecording = false;

// Web Speech API'yi başlat
function initializeSpeechRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        const notes = document.getElementById('notes');
        notes.value += transcript + ' ';
    };
}

function startRecording() {
    if (!isRecording) {
        recognition.start();
        isRecording = true;
        document.getElementById('startRecord').disabled = true;
        document.getElementById('stopRecord').disabled = false;
    }
}

function stopRecording() {
    if (isRecording) {
        recognition.stop();
        isRecording = false;
        document.getElementById('startRecord').disabled = false;
        document.getElementById('stopRecord').disabled = true;
    }
}

function toggleForms() {
    document.getElementById('register-form').classList.toggle('hidden');
    document.getElementById('login-form').classList.toggle('hidden');
}

function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(user => user.email === email)) {
        alert('Bu e-posta adresi zaten kayıtlı!');
        return false;
    }

    users.push({ username, email, password, notes: '' });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Kayıt başarılı! Lütfen giriş yapın.');
    toggleForms();
    return false;
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showNotepad();
    } else {
        alert('Geçersiz e-posta veya şifre!');
    }
    return false;
}

function showNotepad() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('auth-forms').classList.add('hidden');
    document.getElementById('notepad').classList.remove('hidden');
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('notes').value = user.notes;
}

function saveNotes() {
    const notes = document.getElementById('notes').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.notes = notes;

    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    users[userIndex] = currentUser;

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('Notlar başarıyla kaydedildi!');
}

function logout() {
    stopRecording();
    localStorage.removeItem('currentUser');
    document.getElementById('notepad').classList.add('hidden');
    document.getElementById('auth-forms').classList.remove('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

// Sayfa yüklendiğinde
window.onload = function() {
    initializeSpeechRecognition();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showNotepad();
    }
}
