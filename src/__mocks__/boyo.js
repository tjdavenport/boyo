/**
 * @jest-environment node
 */
const cors = require('cors');
const app = require('../lib/app');
const express = require('express');
const config = require('./config');
const socketIo = require('socket.io');

const boyo = express();

boyo.set('config', config);
boyo.set('bus', socketIo(1227));
boyo.set('log', {
  auth: msg => boyo.emit('log', msg)
});
boyo.use(cors());
app(boyo);

module.exports = boyo;
