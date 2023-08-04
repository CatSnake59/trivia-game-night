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

const { WebSocket, WebSocketServer } = require('ws');
const http = require('http');
const server = http.createServer();
const wsServer = new WebSocketServer({ server });

// listen on port 8000
server.listen(8000, () => {
  console.log(`WebSocket server is running on port ${8000}`);
});

const clients = {}; // manage client connections

// event types
const typesDef = {
  USER_EVENT: 'userevent',
  BUZZER_EVENT: 'buzzerevent'
}

// broadcast message to all subscribers (clients)
const broadcastMessage = (json) => {
  const data = JSON.stringify(json)

  // send data to all clients in 'clients' object
  for(let userId in clients) {
    let client = clients[userId];
    if(client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  };
}

// handle updates in 'messages'
const handleMessage = (message, userId, connection) => {
  const dataFromClient = JSON.parse(message.toString());
  const json = { type: dataFromClient.type };
  if (dataFromClient.type === typesDef.BUZZER_EVENT) {
    msg = dataFromClient.content;
    json.data = { msg, color: dataFromClient.color }; // assign color k-v pair to json.data
  }
  broadcastMessage(json);
}

// handle user disconnections
const handleDisconnect = (userId) => {
  console.log(`${userId} disconnected.`);
  delete clients[userId];
}

// handle client connection requests
wsServer.on('connection', (connection) => {
  const userId = uuidv4(); // generate unique code for every user
  console.log('Recieved a new connection');

  clients[userId] = connection; // store new connection in 'clients' object
  console.log(`${userId} connected.`);

  connection.on('message', (message) => handleMessage(message, userId)); // listen for events
  connection.on('close', () => handleDisconnect(userId)); // listen for user disconnections
});