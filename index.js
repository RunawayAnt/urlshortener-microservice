require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const _url = require('url');

// const autoIncrement = require('mongoose-auto-increment');
// const { Schema } = mongoose;

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extend: false }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const validateURL = (url) => {
  try {
    const _url = new URL(url);
    return _url;
  } catch (err) {
    return false;
  }
};

const findAndCreateURL = require("./actions.js").findAndCreateURL;

app.post('/api/shorturl', function(req, res, next) {
  const { url } = req.body;
  const verified_url = validateURL(url);

  if (verified_url) {
    findAndCreateURL(verified_url, (err, data) => {
      if (err) req.data = err;
      req.data = data;
      next();
    });
  } else {
    req.data = { error: "Invalid URL" };
    next();
  }
}, function(req, res) {
  const { original_url, short_url, error } = req.data;
  res.json({ original_url, short_url, error });
});

const findURL = require("./actions.js").findURL;

app.get('/api/shorturl/:id', function(req, res, next) {
  let { id } = req.params;

  if (+id) {
    let _dataURL = findURL(id, (err, data) => {
      if (err) {
        return err;
      }
      if (data) {
        req.data = data;
      } else {
        req.data = { error: 'No short URL found for the given input' };
      }
      next();
    });
  } else {
    req.data = { error: 'Wrong format' };
    next();
  }
  // console.log(id);
}, function(req, res) {
  // console.log(req.data);
  const { original_url, error } = req.data;
  if (error) {
    res.json({ error });
  }
  res.redirect(original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
