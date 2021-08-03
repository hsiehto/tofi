/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
require('dotenv').config();

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const bodyParser = require('body-parser'); // body-parser parses the body of POST requests

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret

const app = express();

const handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});

app.use(express.static(__dirname + '/public'))
  .use(cors());

// SETTING THE TEMPLATING ENGINE
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// SETTING UP BODY-PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', function (req, res) {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };
  
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
  
      // use the access token to access the Spotify Web API
      const token = body.access_token;
      let items = {}

      const categoriesOptions = {
        url: 'https://api.spotify.com/v1/browse/categories?limit=12',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        json: true
      };

      request.get(categoriesOptions, function(error, response, body) {
        const categoryItems = body.categories.items;

        for (let item of categoryItems) {
          item.icon = item.icons[0]
        }

        items.categories = body

        const playlistOptions = {
          url: 'https://api.spotify.com/v1/users/jmperezperez/playlists',
          headers: {
            'Authorization': 'Bearer ' + token,
          },
          json: true
        };
  
        request.get(playlistOptions, function(error, response, body) {
          const playlistItems = body.items;
  
          for (let item of playlistItems) {
            item.image = item.images[0]
          }
  
          items.playlists = body
          items.playlists.playlistOwner = playlistItems[0].owner.display_name

          res.render('home', items);
        });
      });
    }
  });
});

app.get('/search', function (req, res) {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };
  console.log('request====', req.body)

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
  
      // use the access token to access the Spotify Web API
      const token = body.access_token;
      console.log('request====', req.body)

      const searchOptions = {
        url: `https://api.spotify.com/v1/search?q=${req.query.value}&type=${req.query.type}`,
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        json: true
      };

      request.get(searchOptions, function(error, response, body) {
        const searchItems = body
        console.log('search----', searchItems)
        res.render('searchResults', searchItems)
      });
    }
  });
});

app.get('/category', function (req, res) {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };
  
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
  
      // use the access token to access the Spotify Web API
      const token = body.access_token;

      const categoryOptions = {
        url: `https://api.spotify.com/v1/browse/categories/${req.query.categoryId}/playlists`,
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        json: true
      };
      request.get(categoryOptions, function(error, response, body) {
        res.render('category', body)
      });
    }
  });
});

app.get('/playlist', function (req, res) {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };
  
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
  
      // use the access token to access the Spotify Web API
      const token = body.access_token;

      const categoryOptions = {
        url: `https://api.spotify.com/v1/playlists/${req.query.playlistId}`,
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        json: true
      };
      request.get(categoryOptions, function(error, response, body) {
        console.log('playlist', body)
        res.render('playlist', body)
      });
    }
  });
});

console.log('Listening on http://localhost:8888');
app.listen(8888);