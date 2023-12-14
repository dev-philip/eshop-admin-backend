import bodyParser from 'body-parser';
import logger from './config/logger';
import adminUserRoutes from "./routes/adminUserRoutes";
import categoryRoutes from "./routes/categoryRoutes";

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const ip = require('ip');
const knex = require('knex');
const knexConfig = require('../knexfile');
var socket = require("socket.io");
var connection = require("./config/connection");
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const socketIo = socket(server, {
  cors: {
    origin: '*',  // Replace with your allowed origin(s)
    methods: ['GET', 'POST'],
  },
});

// Middleware to parse JSON data
app.use(bodyParser.json());

// Use CORS middleware
const corsOptions = {
  origin: '*',
  // origin: 'http://localhost:4200',
  //origin: 'http://example.com', // replace with your allowed origin
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));


const environment = process.env.NODE_ENV || 'development';
const connectionConfig = knexConfig[environment];

const db = knex(connectionConfig);

// Get the local IP address
const localIp = ip.address();
const port = process.env.PORT;

app.get('/', (req:any, res:any) => {
  res.send('Hello, Node.js!');
});

// Routes
const baseAPi = process.env.BASE_URL || "/api/v1";
app.use(baseAPi, adminUserRoutes);
app.use(baseAPi, categoryRoutes);

 server.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port} and ${localIp}:${port}`);
});



socketIo.on("connection", (socket: any) => {
    console.log("A connection has been created with " + socket.id);
    // socket.on(connection.change, (changes: any) => {
    //   socketIo.sockets.emit(connection.change, changes);
    // });

    // socket.on(connection.create, (newData: any) => {
    //   socketIo.sockets.emit(connection.change, newData);
    // });
})

export { app, socketIo }; 