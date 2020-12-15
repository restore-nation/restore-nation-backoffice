const express = require('express');

function Apis(opts) {

  const clients = opts.clients;

  const router = express.Router();

  function markOrderAsInProgress(req, res) {
    clients.orders.searchOne({ filter: { restaurant: req.params.restId, uid: req.params.ordId } }).then(order => {
      if (order) {
        // TODO: send mail
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
        // TODO: send mail
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
        // TODO: send mail
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
    // TODO: call oto
    clients.restaurants.searchOne({ filter: { uid: req.params.restId, owner: req.user.uid } }).then(restaurant => {
      if (restaurant) {
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

  function createRestaurant(req, res) {
    // TODO: call oto
    clients.restaurants.create({ ...req.body, owner: req.user.uid }).then(restaurant => {
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