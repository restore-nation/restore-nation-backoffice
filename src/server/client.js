const _ = require('lodash');
const fetch = require('node-fetch');

exports.Clients = (opts) => {

  const authHeaders = opts.auth ? {
    'Authorization': `Basic ${Buffer.from(opts.auth.clientId + ':' + opts.auth.clientSecret).toString('base64')}`
  } : {}

  const addHeaders = opts.headers || {};

  function clientFor(entity) {

    function create(body = {}, query = {}) {
      const queryStr = _.isEmpty(query) ? '' : `?${_.entries(query).map(i => `${i[0]}=${i[1]}`).join('&')}`
      return fetch(`${opts.root}/${entity.namespace}/${entity.version}/${entity.names.plural}${queryStr}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
          ...addHeaders
        },
        body: JSON.stringify(body)
      }).then(r => r.json());
    }

    function update(id, body = {}, query = {}) {
      const queryStr = _.isEmpty(query) ? '' : `?${_.entries(query).map(i => `${i[0]}=${i[1]}`).join('&')}`
      return fetch(`${opts.root}/${entity.namespace}/${entity.version}/${entity.names.plural}/${id}${queryStr}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
          ...addHeaders
        },
        body: JSON.stringify(body)
      }).then(r => r.json());
    }

    function upsert(id, body = {}, query = {}) {
      const queryStr = _.isEmpty(query) ? '' : `?${_.entries(query).map(i => `${i[0]}=${i[1]}`).join('&')}`
      return fetch(`${opts.root}/${entity.namespace}/${entity.version}/${entity.names.plural}/${id}${queryStr}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
          ...addHeaders
        },
        body: JSON.stringify(body)
      }).then(r => r.json());
    }

    function patch(id, body = [], query = {}) {
      const queryStr = _.isEmpty(query) ? '' : `?${_.entries(query).map(i => `${i[0]}=${i[1]}`).join('&')}`
      return fetch(`${opts.root}/${entity.namespace}/${entity.version}/${entity.names.plural}/${id}${queryStr}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
          ...addHeaders
        },
        body: JSON.stringify(body)
      }).then(r => r.json());
    }

    function deleteById(id, query = {}) {
      const queryStr = _.isEmpty(query) ? '' : `?${_.entries(query).map(i => `${i[0]}=${i[1]}`).join('&')}`
      return fetch(`${opts.root}/${entity.namespace}/${entity.version}/${entity.names.plural}/${id}${queryStr}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...authHeaders,
          ...addHeaders
        }
      }).then(r => {
        if (r.status === 204) {
          return null;
        } else {
          return r.json()
        }
      });
    }

    function deleteAll(query = {}) {
      const queryStr = _.isEmpty(query) ? '' : `?${_.entries(query).map(i => `${i[0]}=${i[1]}`).join('&')}`
      return fetch(`${opts.root}/${entity.namespace}/${entity.version}/${entity.names.plural}${queryStr}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...authHeaders,
          ...addHeaders
        }
      }).then(r => {
        if (r.status === 204) {
          return null;
        } else {
          return r.json()
        }
      });
    }

    function findById(id, query = {}) {
      const queryStr = _.isEmpty(query) ? '' : `?${_.entries(query).map(i => `${i[0]}=${i[1]}`).join('&')}`
      return fetch(`${opts.root}/${entity.namespace}/${entity.version}/${entity.names.plural}/${id}${queryStr}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...authHeaders,
          ...addHeaders
        }
      }).then(r => r.json());
    }

    function findAll(filter = {}, sort = {}, query = {}) {
      const params = [
        ..._.entries(query).map(i => `${i[0]}=${i[1]}`),
        ..._.entries(filter).map(i => `filter=${i[0]}:${i[1]}`),
        ..._.entries(sort).map(i => `sort=${i[0]}:${i[1]}`)
      ];
      const queryStr = _.isEmpty(params) ? '' : `?${params.join('&')}`
      return fetch(`${opts.root}/${entity.namespace}/${entity.version}/${entity.names.plural}${queryStr}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...authHeaders,
          ...addHeaders
        }
      }).then(r => {
        if (r.status !== 200) {
          r.text().then(t => console.log(r.status, t));
          return [];
        } else {
          return r.json();
        }
      });
    }

    function count() {
      return fetch(`${opts.root}/${entity.namespace}/${entity.version}/${entity.names.plural}/_count`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...authHeaders,
          ...addHeaders
        }
      }).then(r => r.json()).then(r => r.count);
    }

    function search(query = {}) {
      const queryStr = query.raw ? `?raw=true` : '';
      return fetch(`${opts.root}/${entity.namespace}/${entity.version}/${entity.names.plural}/_search${queryStr}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
          ...addHeaders
        },
        body: JSON.stringify(query)
      }).then(r => {
        if (r.status !== 200) {
          return [];
        } else {
          return r.json();
        }
      });
    }

    function searchOne(query = {}) {
      return search({ ...query, limit: 1 }).then(items => {
        if (items.length > 0) {
          return items[0];
        } else {
          return null
        }
      });
    }

    return {
      create,
      update,
      upsert,
      patch,
      deleteById,
      deleteAll,
      findById,
      findAll,
      searchOne,
      search,
      count,
    };
  }

  if (!opts.root) {
    opts.root = '/apis';
  }

  const clients = {};

  (opts.entities || []).map(entity => {
    clients[entity.names.plural] = clientFor(entity);
  });

  return clients;
};