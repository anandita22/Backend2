require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const { initSocket } = require('./config/sockets');

const tournamentTimer = require('./utils/tournamentTimer');

const app = express();

const socketApp = http.createServer(app);

global.io = socketIO(socketApp);

// app.use(helmet());
app.use(express.static('public'));

// CORS
app.use(function (req, res, next) {
  const origin = req.headers.origin;

  const allowedDomains = process.env.WHITELIST_DOMAINS.split(',');
  if (allowedDomains.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Authorization, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.disable('X-Powered-By');
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require('./db/dbConfig');

const apiRouter = require('./routes/apiRouter');
const userRouter = require('./routes/userRouter');
const gameCategoryRouter = require('./routes/gameCategoryRouter');
const gameRouter = require('./routes/gameRouter');
const authRouter = require('./routes/authRouter');
const leaderboardRouter = require('./routes/leaderboardRouter');
const tournamentRouter = require('./routes/tournamentRouter');

// Routes
app.use('/api/v1/tournament', tournamentRouter);
app.use('/api/v1/leaderboard', leaderboardRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/game', gameRouter);
app.use('/api/v1/category', gameCategoryRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1', apiRouter);

socketApp.listen(process.env.PORT, () => {
  db.connect();
  tournamentTimer.startTimer();
  initSocket(global.io);
  console.log(
    `The server is started and listening to port ${process.env.PORT}!`
  );
});
