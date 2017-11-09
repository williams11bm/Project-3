require('dotenv').config({
  silent: true
});
let express = require('express')
let app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');

let http = require('http');
let server = http.Server(app);
let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

var messages = require('./routes/messages');
var users = require('./routes/users');
var groups = require('./routes/groups');
var messages = require('./routes/messages');

//MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/api/messages', messages);
app.use('/api/users', users);
app.use('/api/groups', groups);

// error handler
app.use((err, req, res, next) => {
  let errStatus = err.status || 500;
  let errMessage = 'Server Error';
  if (err.name === 'UnauthorizedError') {
    errStatus = 401;
    errMessage = 'Not Authorized';
  }
  res.status(errStatus).json({
    status: errStatus,
    message: errMessage
  });
});

// We are going to implement a JWT middleware that will ensure the validity of our token. We'll require each protected route to have a valid access_token sent in the Authorization header

// SOCKET IO INSTANCE. run ng serve to connect to socket
io.on('connection', (socket) => {
  console.log('user connected')
  // console.log('socket', socket)
  console.log('socket id', socket.id)
  var socketId = socket.id;
  socket.on('new-message', (message) => {
    console.log(message.message);
    var senderId = 1 //placeholder
    //sending to client(s)
    // socket.broadcast.emit('message', {
    //   message: message,
    //   sender: senderId,
    //   socketId: socketId
    // });
    console.log(message.sender_id)
    io.sockets.in(message.group_id).emit('message', {
      content: message.content,
      sender_id: message.sender_id,
      group_id: message.group_id
    })
    console.log('emit to ', message.group_id)
    // io.sockets.emit('message', {message:message, sender: senderId, socketId:socketId}); //sends to all sockets connected to server
  })

  // socket.on('send-notifications', (message) => {
  //   io.sockets.in(message.group_id).emit('notifcation', {
  //     content: message.content
  //   })
  // })

  socket.on('group-connection', (groups) => {
    console.log('group-connection', groups);
    groups.groups.forEach((group) => {
      console.log(group.id)
      socket.join(group.id)
    })
  })
  socket.on('update-groups', (emitSenderOnly) => {
    if (emitSenderOnly) {
      socket.emit('groups') //sends to sender only
    } else {
      io.sockets.emit('groups') //TODO:fix to only send to invited members
    }
  })
});


server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
