import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class App extends Component {

  render() {
    return (
      <Router>
        <header>
          <nav className="navbar fixed-top navbar-dark bg-dark shadow-sm">
            <div className="container d-flex justify-content-between">
              <a href="/" className="navbar-brand d-flex align-items-center">
                <i className="fas fa-ustensils"></i>
                <strong className="resto-name">Restore Nation - Backoffice</strong>
              </a>
            </div>
          </nav>
        </header>
        <main role="main" style={{ marginTop: '60px' }}>
          <Switch>
            <Route path="/about">
              <h1>About</h1>
            </Route>
            <Route path="/users">
              <h1>Users</h1>
            </Route>
            <Route path="/restaurants/:restId/orders/:ordId" component={(props) => <Order id={props.match.params.restId} order={props.match.params.ordId} {...props} />} />
            <Route path="/restaurants/:restId/orders" component={(props) => <Orders id={props.match.params.restId} {...props} />} />
            <Route path="/restaurants/:restId" component={(props) => <Restaurant id={props.match.params.restId} {...props} />} />
            <Route path="/" exact component={(props) => <Home {...props} />} />
          </Switch>
        </main>
        <footer className="text-muted"></footer>
      </Router>
    );
  }
}

class Restaurant extends Component {

  state = { restaurant: null }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    fetch('/apis/restaurants/' + this.props.id, {
      method: 'GET',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json'
      }
    }).then(r => r.json()).then(restaurant => this.setState({ restaurant }))
  }

  render() {
    if (!this.state.restaurant) {
      return null;
    }
    return (
      <>
        <section className="jumbotron text-center ">
          <div className="container">
            <h1 className="resto-name">{this.state.restaurant.name}</h1>
            <p class="lead text-muted resto-description">{this.state.restaurant.description}</p>
            <div className="btn-group">
              <button type="button" className="btn btn-info" onClick={this.addDish}><i className="fas fa-file-alt" /> voir les commandes</button>
              <button type="button" className="btn btn-success" onClick={this.editRestaurant}><i className="fas fa-edit" /> editer</button>
              <button type="button" className="btn btn-danger" onClick={this.deleteRestaurant}><i className="fas fa-trash" /> supprimer</button>
            </div>
          </div>
        </section>
        <div className="album py-5 bg-light">
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <h3>Les menus</h3>
            <button style={{ marginLeft: 10 }} type="button" className="btn btn-success btn-sm"><i className="fas fa-plus"/></button>
          </div>
          <div className="container">
            <table className="table table-striped table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Prix</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.restaurant.menus.map((menu, idx) => {
                  return (
                    <tr key={menu.uid}>
                      <th scope="row">{idx + 1}</th>
                      <td>{menu.name}</td>
                      <td>{menu.price} €</td>
                      <td>
                        <div className="btn-group">
                          <button type="button" className="btn btn-sm btn-success" onClick={e => this.editMenu(menu.uid)}><i className="fas fa-edit" /></button>
                          <button type="button" className="btn btn-sm btn-danger" onClick={e => this.deleteMenu(menu.uid)}><i className="fas fa-trash" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="album py-5 bg-light">
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <h3>Les plats</h3>
            <button style={{ marginLeft: 10 }} type="button" className="btn btn-success btn-sm"><i className="fas fa-plus"/></button>
          </div>
          <div className="container">
            <table className="table table-striped table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Prix</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.restaurant.carte.map((dish, idx) => {
                  return (
                    <tr key={dish.uid}>
                      <th scope="row">{idx + 1}</th>
                      <td>{dish.name}</td>
                      <td>{dish.price} €</td>
                      <td>
                        <div className="btn-group">
                          <button type="button" className="btn btn-sm btn-success" onClick={e => this.editDish(dish.uid)}><i className="fas fa-edit" /></button>
                          <button type="button" className="btn btn-sm btn-danger" onClick={e => this.deleteDish(dish.uid)}><i className="fas fa-trash" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

function Orders(props) {
  return <h1>Orders for {props.id}</h1>
}

function Order(props) {
  return <h1>Order for {props.order}</h1>
}

class Home extends Component {

  state = { restaurants: [] }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    fetch('/apis/restaurants', {
      method: 'GET',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json'
      }
    }).then(r => r.json()).then(restaurants => this.setState({ restaurants }))
  }

  deleteRestaurant = (uid) => {
    fetch('/apis/restaurants/' + uid, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json'
      }
    }).then(r => this.reload());
  }

  addRestaurant = () => {
    const name = window.prompt('Nom du restaurant ?');
    fetch('/apis/restaurants', {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "name": name,
        "description": "un petit resto qu'il est bien sympa",
        "phone": "0606060606",
        "email": "chez.bobby@restore-nation.site",
        "website": "https://chezbobby.restore-nation.site",
        "address": "1 rue de la dalle 86000 Poitiers",
        "location": { "lat": 46.5802545686478, "lng": 0.3408495398778302 },
        "photos": [],
        "domain": name.toLowerCase().replace(/ /g, '-'),
        "hours": {
          "monday": [{ "from": "12h00", "to": "15h00" }, { "from": "19h00", "to": "23h00" }],
          "tuesday": [{ "from": "12h00", "to": "15h00" }, { "from": "19h00", "to": "23h00" }],
          "wednesday": [{ "from": "12h00", "to": "15h00" }, { "from": "19h00", "to": "23h00" }],
          "thursday": [{ "from": "12h00", "to": "15h00" }, { "from": "19h00", "to": "23h00" }],
          "friday": [{ "from": "12h00", "to": "15h00" }, { "from": "19h00", "to": "23h00" }],
          "saturday": [{ "from": "12h00", "to": "15h00" }, { "from": "19h00", "to": "23h00" }],
          "sunday": [{ "from": "12h00", "to": "15h00" }, , { "from": "19h00", "to": "23h00" }]
        },
        "menus": [],
        "carte": []
      }),
    }).then(r => r.json()).then(r => {
      window.location = '/restaurants/' + r.uid
    });
  }

  render() {
    return (
      <>
        <section className="jumbotron text-center ">
          <div className="container">
            <h1 className="resto-name">Liste de vos restaurants</h1>
            <button type="button" className="btn btn-success" onClick={this.addRestaurant}><i className="fas fa-plus" /> ajouter un restaurant</button>
          </div>
        </section>
        <div className="album py-5 bg-light">
          <div className="container">
            <table className="table table-striped table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Adresse</th>
                  <th scope="col">Téléphone</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.restaurants.map((resto, idx) => {
                  return (
                    <tr key={resto.uid}>
                      <th scope="row">{idx + 1}</th>
                      <td>{resto.name}</td>
                      <td>{resto.address}</td>
                      <td>{resto.phone}</td>
                      <td>
                        <div className="btn-group">
                          <Link type="button" className="btn btn-sm btn-success" to={`/restaurants/${resto.uid}`}><i className="fas fa-edit" /></Link>
                          <Link className="btn btn-sm btn-info" to={`/restaurants/${resto.uid}/orders`}><i className="fas fa-file-alt" /></Link>
                          <button type="button" className="btn btn-sm btn-danger" onClick={e => this.deleteRestaurant(resto.uid)}><i className="fas fa-trash" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));