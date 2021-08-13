const express = require('express');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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

app.use(cookieParser());

app.get('/', function (req, res) {
  res.render('home')
})

app.get('/tofi-home', function (req, res) {
  const options = {
    url: 'http://flip1.engr.oregonstate.edu:8000',
    json: true
  };


  let items;
  const zipCode = req.query.zipCode || '94582';
  request.get(options, function (error, response, body) {
    items = body
    request.get({
      url: 'https://f4d4dbf4b7df.ngrok.io/weatherget/' + zipCode,
      json: true
    }, function (error, response, body) {
      items.weather = body
      res.cookie('zipCode', zipCode)

      res.render('tofi-home', items)
    })
  });
});

app.get('/search', function (req, res) {
  const options = {
    url: `http://flip1.engr.oregonstate.edu:8000/search?value=${req.query.value}&type=${req.query.type}`,
    json: true
  };

  let items;
  const zipCode = req.cookies.zipCode || '94582';
  request.get(options, function (error, response, body) {
    items = body
    request.get({
      url: 'https://f4d4dbf4b7df.ngrok.io/weatherget/' + zipCode,
      json: true
    }, function (error, response, body) {
      items.weather = body

      res.render('searchResults', items);
    })
  });
});

app.get('/category', function (req, res) {
  const options = {
    url: `http://flip1.engr.oregonstate.edu:8000/category?categoryId=${req.query.categoryId}`,
    json: true
  };

  let items;
  const zipCode = req.cookies.zipCode || '94582';
  request.get(options, function (error, response, body) {
    items = body
    request.get({
      url: 'https://f4d4dbf4b7df.ngrok.io/weatherget/' + zipCode,
      json: true
    }, function (error, response, body) {
      items.weather = body
      res.render('category', items);
    })
  });
});

app.get('/playlist', function (req, res) {
  const options = {
    url: `http://flip1.engr.oregonstate.edu:8000/playlist?playlistId=${req.query.playlistId}`,
    json: true
  };

  let items;
  const zipCode = req.cookies.zipCode || '94582';
  request.get(options, function (error, response, body) {
    items = body
    request.get({
      url: 'https://f4d4dbf4b7df.ngrok.io/weatherget/' + zipCode,
      json: true
    }, function (error, response, body) {
      items.weather = body
      res.render('playlist', items);
    })
  });
});

console.log('Listening on http://localhost:8888');
app.listen(8888);