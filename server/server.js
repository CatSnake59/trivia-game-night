// require modules
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// connect to MongoDB server
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    dbName: 'TriviaGameNight',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));

// import controllers
const questionsController = require('./controllers/questionsController');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');

const PORT = process.env.PORT || 3000;
const app = express();

// global middleware
app.use(express.json());
app.use(cors());
app.use(cors({ origin: '/questions' }));
app.use(express.static(path.resolve(__dirname, '../build')));

// GET route: handle JWT
app.get('/verifyJwt', authController.verifyJwt, (req, res) =>
  res.status(200).json(res.locals.user)
);

// GET route: obtain questions from DB
app.get('/questions', questionsController.getQuestions, (req, res) =>
  res.status(200).json(res.locals.questions)
);

// POST route: login as an existing user
app.post(
  '/log-in',
  userController.verifyUser,
  authController.setJwtToken,
  (req, res) => res.status(200).json(res.locals.secret)
);

// POST route: sign up for account
app.post(
  '/sign-up',
  userController.addUser,
  authController.setJwtToken,
  (req, res) => res.status(200).json(res.locals.secret)
);

// DELETE route: delete account from database
app.delete('/delete', userController.deleteUser, (req, res) =>
  res.status(200).json(res.locals.deleteMessage)
);

// global unknown route handler
app.use((req, res) =>
  res.status(404).send(`This is not the page you're looking for...`)
);

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught an unknown error.',
    status: 500,
    message: { err: 'An error occurred.' },
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

// const WebSocket = require('ws');

// const WSServer = WebSocket.Server;

// const server = require('http').createServer();

// const wss = new WSServer({
//   server,
//   perMessageDeflate: false,
// });

// server.on('request', app);

// server.listen(PORT, () => {
//   console.log(`Combo server listening on port ${PORT}...`);
// });

// // A new client connection request received
// wss.on('connection', function(connection) {
//   // Generate a unique code for every user
//   const userId = uuidv4();
//   console.log('Recieved a new connection');

//   // Store the new connection and handle messages
//   clients[userId] = connection;
//   console.log(`${userId} connected.`);
//   connection.on('message', (message) => handleMessage(message, userId));
//   // User disconnected
//   connection.on('close', () => handleDisconnect(userId));
// });


const { WebSocket, WebSocketServer } = require('ws');
const http = require('http');


// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });


//server.on('request', app);
//listening on different ports than the express server
server.listen(8000, () => {
  console.log(`WebSocket server is running on port ${8000}`);
});

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active users in this object
const users = {};
// The current editor content is maintained here.
let editorContent = null;
// User activity history.
let userActivity = [];

// Event types
const typesDef = {
  USER_EVENT: 'userevent',
  CONTENT_CHANGE: 'contentchange'
}

function broadcastMessage(json) {
  // We are sending the current data to all connected clients
  const data = JSON.stringify(json);
  for(let userId in clients) {
    let client = clients[userId];
    if(client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  };
}

function handleMessage(message, userId) {
  
  const dataFromClient = JSON.parse(message.toString());
  console.log('handleMessage dataFromClient', dataFromClient);
  const json = { type: dataFromClient.type };
  if (dataFromClient.type === typesDef.USER_EVENT) {
    users[userId] = dataFromClient;
    userActivity.push(`${dataFromClient.username} joined to edit the document`);
    json.data = { users, userActivity };
  } else if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
    editorContent = dataFromClient.content;
    json.data = { editorContent, userActivity };
  }
  broadcastMessage(json);
}

function handleDisconnect(userId) {
    console.log(`${userId} disconnected.`);
    const json = { type: typesDef.USER_EVENT };
    const username = users[userId]?.username || userId;
    userActivity.push(`${username} left the document`);
    json.data = { users, userActivity };
    delete clients[userId];
    delete users[userId];
    broadcastMessage(json);
}

// A new client connection request received
wsServer.on('connection', function(connection) {
  // Generate a unique code for every user
  const userId = uuidv4();
  console.log('Recieved a new connection');

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);
  connection.on('message', (message) => handleMessage(message, userId));
  // User disconnected
  connection.on('close', () => handleDisconnect(userId));
});