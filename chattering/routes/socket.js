const io = require('socket.io')();
const userNames = (function () {
  const names = {};

  const claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  const getGuestName = function () {
    let name;
    let nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  const get = function () {
    return Object.keys(names);
  };

  const free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim,
    free,
    get,
    getGuestName,
  };
})();

const chatRooms = {};
const roomMessages = {};
const plans = [];

const createRoom = function (roomName) {
  if (!chatRooms[roomName]) {
    chatRooms[roomName] = [];
    roomMessages[roomName] = [];
    return true;
  }
  return false;
};

const joinRoom = function (io, socket, roomName) {
  if (!chatRooms[roomName]) {
    chatRooms[roomName] = [];
    roomMessages[roomName] = []; 
  }
  if (socket.room && socket.room !== roomName) {
    leaveRoom(io, socket, socket.room);
  }
  if (!chatRooms[roomName].some(u => u.userId === socket.user.userId)) {
    chatRooms[roomName].push(socket.user);
    socket.join(roomName);
    console.log(`User ${socket.user.userId} has joined room ${roomName}`);
    console.log(`Current users in ${roomName}:`, chatRooms[roomName]);
    
    io.to(roomName).emit('user:join', { users: chatRooms[roomName].map(u => u.userId) });
  }
  socket.room = roomName;
};

const leaveRoom = function (io, socket, roomName) {
  if (chatRooms[roomName]) {
    chatRooms[roomName] = chatRooms[roomName].filter(user => user.userId !== socket.user.userId);
    socket.leave(roomName);
    if (chatRooms[roomName].length === 0) {
      console.log(`Room ${roomName} is now empty`);
    } else {
      console.log(`User ${socket.user.userId} has left room ${roomName}`);
      console.log(`Current users in ${roomName}:`, chatRooms[roomName]);
      io.to(roomName).emit('user:left', { users: chatRooms[roomName].map(u => u.userId) });
      console.log('user:left event sent', { users: chatRooms[roomName].map(u => u.userId) }); 
    }
  }
};

let users = [
  { userId: 'user1', password: 'pass1' },
  { userId: 'user2', password: 'pass2' },
];

module.exports = function (io) {
  io.on('connection', function (socket) {
    socket.on('login', function (data) {
      const authenticatedUser = users.find(u => u.userId === data.username && u.password === data.password);
      if (authenticatedUser) {
        socket.user = authenticatedUser;
        socket.emit('loginSuccess', { name: socket.user.userId, rooms: Object.keys(chatRooms), plans });
        console.log('User logged in:', socket.user);
      } else {
        socket.emit('loginError', { error: '로그인에 실패했습니다.' });
      }
    });

    socket.on('signup', function (data, callback) {
      const existingUser = users.find(user => user.userId === data.username);
      if (existingUser) {
        callback({ success: false, message: '이미 존재하는 아이디입니다.' });
      } else {
        users.push({ userId: data.username, password: data.password });
        callback({ success: true });
      }
    });

    socket.on('create:room', function (roomName, fn) {
      if (createRoom(roomName)) {
        io.emit('room:created', roomName);
        if (typeof fn === 'function') {
          fn(true);
        }
      } else {
        if (typeof fn === 'function') {
          fn(false);
        }
      }
    });

    socket.on('join:room', function (newRoom, callback) {
      if (!socket.user) {
        console.error('User not defined');
        return;
      }
      joinRoom(io, socket, newRoom);
      if (typeof callback === 'function') {
        callback({ room: newRoom, messages: roomMessages[newRoom], users: chatRooms[newRoom].map(u => u.userId) });
      }
      console.log(`${socket.user.userId} has joined room: ${newRoom}`);
    });

    socket.on('send:message', function (data) {
      const message = {
        user: data.user,
        text: data.text,
        timestamp: data.timestamp,
        room: data.room
      };
      if (chatRooms[data.room]) {
        roomMessages[data.room].push(message);
        io.to(data.room).emit('send:message', message);
      }
    });

    socket.on('get:rooms', function (callback) {
      if (typeof callback === 'function') {
        callback(Object.keys(chatRooms));
      }
    });

    // 일정추가
    socket.on('add:plan', function (plan) {
      plan.id = plans.length ? plans[plans.length - 1].id + 1 : 1; 
      plan.user = socket.user.userId;
      plans.push(plan);
      io.emit('plan:added', plan); 
    });

    // 일정 수정
    socket.on('edit:plan', function (updatedPlan) {
      const planIndex = plans.findIndex(plan => plan.id === updatedPlan.id);
      if (planIndex !== -1) {
        updatedPlan.user = socket.user.userId;
        plans[planIndex] = updatedPlan;
        io.emit('plan:edited', updatedPlan); 
      }
    });

    // 일정 삭제
    socket.on('delete:plan', function (planId) {
      const planIndex = plans.findIndex(plan => plan.id === planId);
      if (planIndex !== -1) {
        plans.splice(planIndex, 1);
        io.emit('plan:deleted', planId);
      }
    });

    socket.on('disconnect', function () {
      if (socket.user && socket.room) {
        leaveRoom(io, socket, socket.room);
      }
      if (socket.user) {
        userNames.free(socket.user.userId);
      }
    });
  });
};
