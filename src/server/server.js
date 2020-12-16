const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const { otoroshiMiddleware } = require('./oto');
const { schema } = require('./schema');
const { Clients } = require('./client');
const { Apis } = require('./api');

const port = process.env.PORT || 8080;
const mode = process.env.MODE || 'dev';

const app = express();

const views = {};

const clients = Clients({
  root: process.env.API_ROOT,
  entities: schema.entities,
  auth: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  }
})

function user() {
  return (req, res, next) => {
    if (req.get('x-user-uid')) {
      clients.users.searchOne({ filter: { uid: req.get('x-user-uid') }}).then(user => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(400).send({ error: 'no user ! 1' })
        }
      });
    } else if (req.token.user || (req.token.apikey && req.token.apikey.metadata.email)) {
      const _user = req.token.user ? req.token.user : { email: req.token.apikey.metadata.email };
      clients.users.searchOne({ filter: { email: _user.email }}).then(user => {
        if (user) {
          req.user = user;
          next();
        } else {
          clients.users.create({
            ..._user
          }).then(user => {
            req.user = user;
            next();
          });
        }
      });
    } else {
      res.status(400).send({ error: 'no user ! 2' })
    }
  };
}

function ensureUser() {
  return (req, res, next) => {
    if (!req.user) {
      res.status(400).send({ error: 'no user ! 3' })
    } else {
      next();
    }
  }
}

function serveIndex(req, res) {
  const filePath = path.resolve('./src/views/index.html');
  let view = views[filePath];
  if (!view) {
    view = fs.readFileSync(filePath).toString('utf8');
  }
  view = view
    .replace('$jsurl', mode === 'prod' ? '/dist/client.min.js' : 'http://127.0.0.1:3000/client.js')
    .replace('$cssurl', mode === 'prod' ? '/dist/client.min.css' : 'http://127.0.0.1:3000/client.css');
  res.type('html').send(view);
}

app.use(bodyParser.json({ limit: '100mb' }));
app.use('/assets', express.static('assets'));
app.use('/dist', express.static('dist'));
app.use(otoroshiMiddleware());
app.use(user());
app.use(ensureUser());

app.get('/me', (req, res) => {
  // res.status(200).send(req.token.user || req.token.apikey);
  res.status(200).send(req.user);
});
app.put('/me', (req, res) => {
  clients.users.update(req.user.uid, req.body).then(user => {
    res.status(200).send(req.user);
  });
});
app.use('/apis', Apis({ clients }))
app.get('/index.html', serveIndex);
app.get('/*', serveIndex);

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).type('application/json').send({ error: `server error`, root: err });
});

app.listen(port, () => {
  console.log('app listening on http://0.0.0.0:' + port);
});

