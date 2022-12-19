const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

// Get username and room from URL
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Join Server
socket.emit('joinRoom', { username, room });

// Catch 'message' Event from Server
socket.on('message', message => {
  outputMessage(message);

  // Every time message is received, scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message Submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Emit Chat to Server
  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);
  // CLEAR INPUT
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// Output Message to DOM
function outputMessage(message) {
  console.log(message.time)
  const div = document.createElement("div")
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">${message.text}</p>`

  document.querySelector('.chat-messages').appendChild(div);
}

