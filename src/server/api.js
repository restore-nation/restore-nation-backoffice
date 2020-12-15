const express = require('express');
const fetch = require('node-fetch');
const faker = require('faker');
const { URLSearchParams } = require('url');

function Apis(opts) {

  const clients = opts.clients;

  const router = express.Router();

  function sendMail(status) {
    const params = new URLSearchParams();
    params.append('from', 'Restore Nation <rn@restore-nation.site>');
    params.append('to', order.to);
    params.append('subject', 'Mise à jour du status de votre commande');
    params.append('html', 'L\'état de votre commande est desormais: ' + status);
    fetch(`https://api.eu.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_APIKEY}`).toString('base64')}`
      },
      body: params
    })
  }

  function markOrderAsInProgress(req, res) {
    clients.orders.searchOne({ filter: { restaurant: req.params.restId, uid: req.params.ordId } }).then(order => {
      if (order) {
        sendMail('En cours de préparation');
        clients.orders.update(order.uid, { ...order, status: 'IN_PROGRESS', restaurant: req.params.restId }).then(order => {
          res.status(200).send(order);
        });
      } else {
        res.status(404).send({ error: 'order not found'})
      }
    });
  }

  function markOrderAsDone(req, res) {
    clients.orders.searchOne({ filter: { restaurant: req.params.restId, uid: req.params.ordId } }).then(order => {
      if (order) {
        sendMail('Prête');
        clients.orders.update(order.uid, { ...order, status: 'DONE', restaurant: req.params.restId }).then(order => {
          res.status(200).send(order);
        });
      } else {
        res.status(404).send({ error: 'order not found'})
      }
    });
  }

  function markOrderAsArchived(req, res) {
    clients.orders.searchOne({ filter: { restaurant: req.params.restId, uid: req.params.ordId } }).then(order => {
      if (order) {
        clients.orders.update(order.uid, { ...order, status: 'ARCHIVED', restaurant: req.params.restId }).then(order => {
          res.status(200).send(order);
        });
      } else {
        res.status(404).send({ error: 'order not found'})
      }
    });
  }

  function getOrders(req, res) {
    clients.restaurants.searchOne({ filter: { uid: req.params.restId, owner: req.user.uid } }).then(restaurant => {
      if (restaurant) {
        clients.orders.search({ filter: { restaurant: restaurant.uid } }).then(orders => {
          res.status(200).send(orders);
        });
      } else {
        res.status(404).send({ error: 'restaurant not found'})
      }
    });
  }

  function getRestaurant(req, res) {
    clients.restaurants.searchOne({ filter: { uid: req.params.restId, owner: req.user.uid } }).then(restaurant => {
      if (restaurant) {
        res.status(200).send(restaurant);
      } else {
        res.status(404).send({ error: 'restaurant not found'})
      }
    });
  }

  function updateRestaurant(req, res) {
    clients.restaurants.searchOne({ filter: { uid: req.params.restId, owner: req.user.uid } }).then(restaurant => {
      if (restaurant) {
        clients.restaurants.update(restaurant.uid, { ...req.body, owner: req.user.uid }).then(restaurant => {
          res.status(200).send(restaurant);
        });
      } else {
        res.status(404).send({ error: 'restaurant not found'})
      }
    });
  }

  function deleteRestaurant(req, res) {
    clients.restaurants.searchOne({ filter: { uid: req.params.restId, owner: req.user.uid } }).then(restaurant => {
      if (restaurant) {
        deleteServiceDescriptor(restaurant.uid)
        clients.restaurants.deleteById(restaurant.uid).then(() => {
          res.status(200).send({ done: true });
        });
      } else {
        res.status(404).send({ error: 'restaurant not found'})
      }
    });
  }

  function getRestaurants(req, res) {
    clients.restaurants.search({ filter: { owner: req.user.uid } }).then(restaurants => {
      res.status(200).send(restaurants || []);
    });
  }

  function deleteServiceDescriptor(uid) {
    return fetch(`https://otoroshi-api-cb6de59824751b28.restore-nation.site/api/services/restore-nation-data-for-${uid}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
      }
    }).then(r => r.json())
  }

  function createServiceDescriptor(uid, domain) {
    return fetch(`https://otoroshi-api-cb6de59824751b28.restore-nation.site/api/services/_template`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
      }
    }).then(r => r.json()).then(template => {
      return fetch(`https://otoroshi-api-cb6de59824751b28.restore-nation.site/api/services`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
        },
        body: JSON.stringify({
          ...template,
          id: 'restore-nation-data-for-' + uid,
          name: uid + '-data',
          "env": "prod",
          "domain": "restore-nation.site",
          "subdomain": domain + "-v2",
          "root": "/apis/restaurants/" + uid,
          "matchingRoot": "/data.json",
          "targets": [
            {
              "host": "app-ae24c7f8-b006-475b-922c-ba3b152ef880.cleverapps.io",
              "scheme": "https",
              "weight": 1,
              "mtlsConfig": {
                "certs": [],
                "trustedCerts": [],
                "mtls": false,
                "loose": false,
                "trustAll": false
              },
              "protocol": "HTTP/1.1",
              "predicate": {
                "type": "AlwaysMatch"
              },
              "ipAddress": null
            }
          ],
          "sendStateChallenge": false,
          "enforceSecureCommunication": true,
          "secComVersion": 1,
          "secComSettings": {
            "type": "HSAlgoSettings",
            "size": 512,
            "secret": "secret",
            "base64": false
          }
        })
      }).then(r => {
        r.text().then(js => {
          console.log('create service', r.status, js)
        })
      })
    });
  }

  function createApikey(uid, email, clientId, clientSecret) {
    fetch(`https://otoroshi-api-cb6de59824751b28.restore-nation.site/api/apikeys`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
        },
        body: JSON.stringify({
          "clientId": clientId,
          "clientSecret": clientSecret,
          "clientName":"apikey-for-" + uid,
          "authorizedEntities":[
            "service_8phvGctxcywsMNGdNINA5CJtIcySZt0QCee2napWpuhIOpcqJsKRyF0i4YTJK2NC"
          ],
          "enabled":true,
          "metadata":{
            "email": email,
            "resto": uid
          }
        })
      }).then(r => {
        r.text().then(js => {
          console.log('create apikey', r.status, js)
        })
      })
  }

  function createRestaurant(req, res) {
    const clientId = faker.random.alphaNumeric(32);
    const clientSecret = faker.random.alphaNumeric(32);
    clients.restaurants.create({ ...req.body, owner: req.user.uid, access: { clientId, clientSecret } }).then(restaurant => {
      createServiceDescriptor(restaurant.uid, restaurant.domain);
      createApikey(restaurant.uid, req.user.email, clientId, clientSecret);
      res.status(201).send(restaurant);
    });
  }

  router.post('/restaurants/:restId/orders/:ordId/_inprogress', markOrderAsInProgress);
  router.post('/restaurants/:restId/orders/:ordId/_done', markOrderAsDone);
  router.post('/restaurants/:restId/orders/:ordId/_archived', markOrderAsArchived);
  router.get('/restaurants/:restId/orders', getOrders);

  router.get('/restaurants/:restId', getRestaurant)
  router.put('/restaurants/:restId', updateRestaurant)
  router.delete('/restaurants/:restId', deleteRestaurant)
  router.get('/restaurants', getRestaurants)
  router.post('/restaurants', createRestaurant)

  return router;
}

exports.Apis = Apis;