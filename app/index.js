'use strict';

// Constants
const packageInfo = require('./../package.json');

// Libs
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  debugFactory = require('debug');

// Create the app
const app = express(bodyParser.json()),
  debug = debugFactory('pokedexexp'),
  db = require('./common/db');

// Some useful middleware
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// A version endpoint for testing and sanity check
app.get('/version', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(packageInfo.version);
});

module.exports = app;