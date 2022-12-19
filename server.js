import express from "express";
import { Server } from "socket.io";
import formatMessage from "./utils/messages.js";
import { botName } from "./utils/constants.js";
import { getCurrentUser, userJoin, userLeave, getRoomUsers } from "./utils/users.js";

const app = express();

const serverInstance = app.listen(5000, () => {
  console.log("server running on port 5000");
});

app.use(express.static("public"));

const io = new Server(serverInstance);

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    // 
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Broadcast when User Connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
    
    // Send User and Room Info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    })
  });

  // Listen For chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Run when user Disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

      // Send User and Room Info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }

  });
})

