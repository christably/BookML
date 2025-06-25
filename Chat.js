let socket;
let username = "";
let room = "";

function joinChat() {
  username = document.getElementById('username').value.trim();
  room = document.getElementById('room').value.trim();

  if (!username || !room) return alert("Both fields are required!");

  document.getElementById('login').style.display = 'none';
  document.getElementById('chat').style.display = 'block';
  document.getElementById('roomHeader').innerText = `Room: ${room}`;

  socket = io();

  socket.emit('join', { username, room });

  socket.on('message', ({ username, message }) => {
    const div = document.createElement('div');
    div.textContent = `${username}: ${message}`;
    document.getElementById('chatBox').appendChild(div);
    document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
  });

  socket.on('typing', (user) => {
    document.getElementById('typing').textContent = `${user} is typing...`;
    setTimeout(() => {
      document.getElementById('typing').textContent = '';
    }, 2000);
  });

  document.getElementById('message').addEventListener('input', () => {
    socket.emit('typing', username);
  });

  document.getElementById('message').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
  });
}

function sendMessage() {
  const msg = document.getElementById('message').value.trim();
  if (!msg) return;

  socket.emit('message', { username, room, message: msg });
  document.getElementById('message').value = "";
}
