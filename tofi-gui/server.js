const express = require('express');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});

app.use(express.static(__dirname + '/public'))
  .use(cors());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', function (req, res) {
  const options = {
    url: 'http://flip1.engr.oregonstate.edu:8000',
    json: true
  };

  request.get(options, function (error, response, body) {
    res.render('home', body);
  });
});

app.get('/search', function (req, res) {
  const options = {
    url: `http://flip1.engr.oregonstate.edu:8000/search?value=${req.query.value}&type=${req.query.type}`,
    json: true
  };

  request.get(options, function (error, response, body) {
    res.render('searchResults', body);
  });
});

app.get('/category', function (req, res) {
  const options = {
    url: `http://flip1.engr.oregonstate.edu:8000/category?categoryId=${req.query.categoryId}`,
    json: true
  };

  request.get(options, function (error, response, body) {
    res.render('category', body);
  });
});

app.get('/playlist', function (req, res) {
  const options = {
    url: `http://flip1.engr.oregonstate.edu:8000/playlist?playlistId=${req.query.playlistId}`,
    json: true
  };

  request.get(options, function (error, response, body) {
    res.render('playlist', body);
  });
});

console.log('Listening on http://localhost:8888');
app.listen(8888);