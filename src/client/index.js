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

  deleteRestaurant = () => {
    fetch('/apis/restaurants/' + this.state.restaurant.uid, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json'
      }
    }).then(r => window.location = '/');
  }

  deleteMenu = (uid) => {
    const restaurant = this.state.restaurant;
    const newRestaurant = { ...restaurant, menus: restaurant.menus.filter(m => m.uid !== uid) };
    this.setState({ restaurant: newRestaurant });
  }

  deleteDish = (uid) => {
    const restaurant = this.state.restaurant;
    const newRestaurant = { ...restaurant, carte: restaurant.carte.filter(m => m.uid !== uid) };
    this.setState({ restaurant: newRestaurant });
  }

  editMenu = (uid) => {

  }

  editDish = (uid) => {

  }

  editRestaurant = () => {

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
              <Link type="button" className="btn btn-info" to={`/restaurants/${this.state.restaurant.uid}/orders`}><i className="fas fa-file-alt" /> commandes</Link>
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

class Orders extends Component {

  state = { restaurant: null, orders: [] }

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
    }).then(r => r.json()).then(restaurant => this.setState({ restaurant })).then(() => {
      fetch('/apis/restaurants/' + this.props.id + '/orders', {
        method: 'GET',
        credentials: 'include',
        headers: { 
          'Accept': 'application/json'
        }
      }).then(r => r.json()).then(orders => this.setState({ orders }))
    })
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
            <p class="lead text-muted resto-description">Liste des commandes</p>
          </div>
        </section>
        <div className="album py-5 bg-light">
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
                {this.state.orders.map((order, idx) => {
                  return (
                    <tr key={order.uid}>
                      <th scope="row">{idx + 1}</th>
                      <td>{order.firstName} {order.lastName}</td>
                      <td>{order.total} €</td>
                      <td>
                        <button style={{ marginRight: 10 }} type="button" className="btn btn-sm btn-info" onClick={e => this.show(order.uid)}><i className="fas fa-eye" /></button>
                        <div className="btn-group">
                          <button type="button" className="btn btn-sm btn-info" onClick={e => this.inProgress(order.uid)}><i className="fas fa-play" /> en cours</button>
                          <button type="button" className="btn btn-sm btn-success"  onClick={e => this.done(order.uid)}><i className="fas fa-stop" /> prêt</button>
                          <button type="button" className="btn btn-sm btn-danger"  onClick={e => this.archive(order.uid)}><i className="fas fa-trash" /> archiver</button>
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
        "domain": name.toLowerCase().replace(/ /g, '-'),
        "photos": [
          "https://cac.img.pmdstatic.net/fit/http.3A.2F.2Fprd2-bone-image.2Es3-website-eu-west-1.2Eamazonaws.2Ecom.2Fcac.2F2018.2F09.2F25.2F03ab5e89-bad7-4a44-b952-b30c68934215.2Ejpeg/748x372/quality/90/crop-from/center/burger-maison.jpeg",
          "http://images.sweetauthoring.com/recipe/11963_2079.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG"
        ],
        "hours": {
          "tuesday": [{ "from": "12h00", "to": "15h00" }, { "from": "19h00", "to": "23h00" }],
          "wednesday": [{ "from": "12h00", "to": "15h00" }],
          "thursday": [{ "from": "12h00", "to": "15h00" }, { "from": "19h00", "to": "23h00" }],
          "friday": [{ "from": "12h00", "to": "15h00" }, { "from": "19h00", "to": "23h00" }],
          "saturday": [{ "from": "12h00", "to": "15h00" }, { "from": "19h00", "to": "23h00" }],
          "sunday": [{ "from": "12h00", "to": "15h00" }]
        },
        "menus": [
          {
            "uid": "menu_1",
            "name": "menu du midi",
            "description": "un petit menu qu'il est sympa",
            "price": 14.99,
            "hours": [{ "from": "12h00", "to": "15h00" }],
            "main": [{"ref":"dish_1"}],
            "dessert": [{"ref":"dish_2"}],
            "other": [{"ref":"dish_3"}]
          }
        ],
        "carte": [
          {
            "uid": "dish_1",
            "name": "Le super burger",
            "description": "un burger qu'il est bien sympa. Buns moelleux sesame, 2 steaks 150gr, Bacon, Sauce du chef. Servi avec un bol de frites",
            "price": 12.99,
            "photos": ["https://cac.img.pmdstatic.net/fit/http.3A.2F.2Fprd2-bone-image.2Es3-website-eu-west-1.2Eamazonaws.2Ecom.2Fcac.2F2018.2F09.2F25.2F03ab5e89-bad7-4a44-b952-b30c68934215.2Ejpeg/748x372/quality/90/crop-from/center/burger-maison.jpeg"],
            "vegan": false,
            "homemade": true,
            "category": "main"
          },
          {
            "uid": "dish_2",
            "name": "Cheesecake agrumes",
            "description": "un petit cheesecake aux zestes de citron. Servi avec un coulis de fruits rouge",
            "price": 9.99,
            "photos": ["http://images.sweetauthoring.com/recipe/11963_2079.jpg"],
            "vegan": false,
            "homemade": true,
            "category": "dessert"
          },
          {
            "uid": "dish_3",
            "name": "Café",
            "description": "un petit café qu'il est bien sympa",
            "price": 3.99,
            "photos": ["https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG"],
            "vegan": false,
            "homemade": true,
            "category": "other"
          }
        ]
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