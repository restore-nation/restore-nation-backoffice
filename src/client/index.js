import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import faker from 'faker';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class App extends Component {

  state = { me: null }

  componentDidMount() {
    this.me();
  }

  me = () => {
    fetch('/me', {
      method: 'GET',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json'
      }
    }).then(r => r.json()).then(me => this.setState({ me }));
  }

  setup = () => {
    fetch('/me', {
      method: 'PUT',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...this.state.me, setup: true })
    }).then(r => r.json()).then(() => {
      window.location.reload();
    })
  }

  render() {
    if (!this.state.me) return null;
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
          {this.state.me && !this.state.me.setup && (
            <>
              <section className="jumbotron text-center ">
                <div className="container">
                  <h1 className="resto-name">Création de votre compte</h1>
                  <p className="lead text-muted resto-description">Remplissez vos coordonnées bancaire afin de pour créer votre compte restore nation</p>
                </div>
              </section>
              <div className="album py-5 bg-light">
                <div className="container">
                <form class="needs-validation" novalidate="">
                  <div class="d-block my-3">
                    <div class="custom-control custom-radio">
                      <input id="credit" name="paymentMethod" type="radio" class="custom-control-input" checked={true} required="" />
                      <label class="custom-control-label" for="credit">Credit card</label>
                    </div>
                    <div class="custom-control custom-radio">
                      <input id="debit" name="paymentMethod" type="radio" class="custom-control-input" required="" />
                      <label class="custom-control-label" for="debit">Debit card</label>
                    </div>
                    <div class="custom-control custom-radio">
                      <input id="paypal" name="paymentMethod" type="radio" class="custom-control-input" required="" />
                      <label class="custom-control-label" for="paypal">PayPal</label>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="cc-name">Name on card</label>
                      <input type="text" class="form-control" id="cc-name" placeholder="" required="" />
                      <small class="text-muted">Full name as displayed on card</small>
                      <div class="invalid-feedback">
                        Name on card is required
                      </div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="cc-number">Credit card number</label>
                      <input type="text" class="form-control" id="cc-number" placeholder="" required="" />
                      <div class="invalid-feedback">
                        Credit card number is required
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-3 mb-3">
                      <label for="cc-expiration">Expiration</label>
                      <input type="text" class="form-control" id="cc-expiration" placeholder="" required="" />
                      <div class="invalid-feedback">
                        Expiration date required
                      </div>
                    </div>
                    <div class="col-md-3 mb-3">
                      <label for="cc-cvv">CVV</label>
                      <input type="text" class="form-control" id="cc-cvv" placeholder="" required="" />
                      <div class="invalid-feedback">
                        Security code required
                      </div>
                    </div>
                  </div>
                  <hr class="mb-4"/>
                  <button class="btn btn-primary btn-lg btn-block" onClick={e => this.setup()} type="button">Continuer</button>
                </form>
                </div>
              </div>
            </>
          )}
          {this.state.me && this.state.me.setup && (
            <Switch>
              <Route path="/restaurants/:restId/orders/:orderId" component={(props) => <Order id={props.match.params.restId} orderId={props.match.params.orderId} {...props} />} />
              <Route path="/restaurants/:restId/orders" component={(props) => <Orders id={props.match.params.restId} {...props} />} />
              <Route path="/restaurants/:restId/menus/:menuId" component={(props) => <Menu id={props.match.params.restId} menuId={props.match.params.menuId} {...props} />} />
              <Route path="/restaurants/:restId/carte/:dishId" component={(props) => <Dish id={props.match.params.restId} dishId={props.match.params.dishId} {...props} />} />
              <Route path="/restaurants/:restId/edit" component={(props) => <RestaurantEdit id={props.match.params.restId} {...props} />} />
              <Route path="/restaurants/:restId" component={(props) => <Restaurant id={props.match.params.restId} {...props} />} />
              <Route path="/" exact component={(props) => <Home {...props} />} />
            </Switch>
          )}
        </main>
        <footer className="text-muted"></footer>
      </Router>
    );
  }
}

class RestaurantEdit extends Component {

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
    }).then(r => r.json()).then(restaurant => this.setState({ restaurant }));
  }

  save = () => {
    fetch('/apis/restaurants/' + this.props.id, {
      method: 'PUT',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.restaurant)
    }).then(r => r.json())
  }

  onChange = (e) => {
    const restaurant = this.state.restaurant;
    if (e.target.name === 'location.lat') {
      restaurant.location.lat = e.target.value;
    } else if (e.target.name === 'location.lng') {
      restaurant.location.lng = e.target.value;
    } else {
      restaurant[e.target.name] = e.target.value;
    }
    this.setState({ restaurant })
  }

  render() {
    if (!this.state.restaurant) return null;
    const restaurant = this.state.restaurant;
    return (
      <>
        <section className="jumbotron text-center ">
          <div className="container">
            <h1 className="resto-name">{restaurant.name}</h1>
            <div className="btn-group">
              <Link type="button" className="btn btn-secondary" to={`/restaurants/${this.state.restaurant.uid}`}><i className="fas fa-arrow-left" /> retour au restaurant</Link>
              <button type="button" className="btn btn-success" onClick={e => this.save()}><i className="fas fa-save" /> sauvegarder</button>
            </div>
          </div>
        </section>
        <div className="album py-5 bg-light">
          <div className="container">
          <form>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Nom</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" onChange={this.onChange} name="name" value={restaurant.name} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Description</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" onChange={this.onChange} name="description" value={restaurant.description} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Photo</label>
              <div class="col-sm-10">
                <input type="text" class="form-control"  onChange={this.onChange} name="phone" value={restaurant.phone} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Email</label>
              <div class="col-sm-10">
                <input type="text" class="form-control"  onChange={this.onChange} name="email" value={restaurant.email} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Site web</label>
              <div class="col-sm-10">
                <input type="text" class="form-control"  onChange={this.onChange} name="website" value={restaurant.website} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Adresse</label>
              <div class="col-sm-10">
                <input type="text" class="form-control"  onChange={this.onChange} name="address" value={restaurant.address} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Latitude</label>
              <div class="col-sm-10">
                <input type="number" class="form-control"  onChange={this.onChange} name="location.lat" value={restaurant.location.lat} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Longitude</label>
              <div class="col-sm-10">
                <input type="number" class="form-control"  onChange={this.onChange} name="location.lng" value={restaurant.location.lng} />
              </div>
            </div>
          </form>
          </div>
        </div>
      </>
    )
  }
}

class Order extends Component {

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
    }).then(r => r.json()).then(restaurant => this.setState({ restaurant })).then(() => {
      fetch('/apis/restaurants/' + this.props.id + '/orders/' + this.props.orderId, {
        method: 'GET',
        credentials: 'include',
        headers: { 
          'Accept': 'application/json',
        },
      }).then(r => r.json()).then(order => {
        console.log(order)
        this.setState({ order })
      })
    });
  }

  render() {
    if (!this.state.restaurant || !this.state.order) return null;
    const order = this.state.order;
    return (
      <>  
        <section className="jumbotron text-center ">
          <div className="container">
            <h1 className="resto-name">Commande pour {order.firstName} {order.lastName}</h1>
            <p className="lead text-muted resto-description">{order.date}</p>
            <div className="btn-group">
              <Link type="button" className="btn btn-secondary" to={`/restaurants/${this.state.restaurant.uid}/orders`}><i className="fas fa-arrow-left" /> retour aux commandes</Link>
            </div>
          </div>
        </section>
        <div className="album py-5 bg-light">
          <div className="container">
            <ul>
            {Object.keys(order.payload).filter(k => k.indexOf('Restaurant ') < 0 && k.indexOf(' client') < 0).map(k => [k, order.payload[k]]).map(value => {
              return <li>{value[0]}: ${value[1]}</li>
            })}
            </ul>
          </div>
        </div>
      </>
    )
  }
}

class Menu extends Component {

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
    }).then(r => r.json()).then(restaurant => this.setState({ restaurant }));
  }

  save = () => {
    fetch('/apis/restaurants/' + this.props.id, {
      method: 'PUT',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.restaurant)
    }).then(r => r.json())
  }

  onChange = (e) => {
    const menu = this.state.restaurant.menus.filter(m => m.uid === this.props.menuId)[0];
    menu[e.target.name] = e.target.value;
    this.setState({ restaurant: this.state.restaurant })
  }

  addDish = (dish, e) => {
    const menu = this.state.restaurant.menus.filter(m => m.uid === this.props.menuId)[0];
    if (e.target.checked) {
      if (!menu[dish.category]) menu[dish.category] = [];
      const should = menu[dish.category].filter(e => e.ref === dish.uid).length == 0
      if (should) menu[dish.category].push({ ref: dish.uid });
    } else {
      menu[dish.category] = menu[dish.category].filter(e => e.ref !== dish.uid)
    }
    this.setState({ restaurant: this.state.restaurant })
  }

  delete = () => {
    this.state.restaurant.menus = this.state.restaurant.menus.filter(m => m.uid !== this.props.menuId);
    this.save();
    window.location = `/restaurants/${this.state.restaurant.uid}`
  }

  render() {
    if (!this.state.restaurant) return null;
    const carte = this.state.restaurant.carte;
    const menu = this.state.restaurant.menus.filter(m => m.uid === this.props.menuId)[0];
    return (
      <>
        <section className="jumbotron text-center ">
          <div className="container">
            <h1 className="resto-name">{menu.name}</h1>
            <div className="btn-group">
              <Link type="button" className="btn btn-secondary" to={`/restaurants/${this.state.restaurant.uid}`}><i className="fas fa-arrow-left" /> retour au restaurant</Link>
              <button type="button" className="btn btn-success" onClick={e => this.save()}><i className="fas fa-save" /> sauvegarder</button>
              <button type="button" className="btn btn-danger" onClick={e => this.delete()}><i className="fas fa-trash" /> supprimer</button>
            </div>
          </div>
        </section>
        <div className="album py-5 bg-light">
          <div className="container">
          <form>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Nom</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" onChange={this.onChange} name="name" value={menu.name} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Description</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" onChange={this.onChange} name="description" value={menu.description} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Price</label>
              <div class="col-sm-10">
                <input type="number" class="form-control"  onChange={this.onChange} name="price" value={menu.price} />
              </div>
            </div>
            {carte.map(dish => {
              return (
                <div class="form-group row">
                  <div class="col-sm-2"></div>
                  <div class="col-sm-10">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" onChange={e => this.addDish(dish, e)}  checked={menu[dish.category].filter(i => i.ref === dish.uid).length > 0} />
                      <label class="form-check-label">
                        {dish.name}
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
          </form>
          </div>
        </div>
      </>
    )
  }
}

class Dish extends Component {

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
    }).then(r => r.json()).then(restaurant => this.setState({ restaurant }));
  }

  save = (dish) => {
    fetch('/apis/restaurants/' + this.props.id, {
      method: 'PUT',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.restaurant)
    }).then(r => r.json())
  }

  delete = (dish) => {
    this.state.restaurant.carte = this.state.restaurant.carte.filter(m => m.uid !== dish.uid);
    this.save();
    window.location = `/restaurants/${this.state.restaurant.uid}`
  }

  onChange = (e) => {
    const dish = this.state.restaurant.carte.filter(m => m.uid === this.props.dishId)[0];
    dish[e.target.name] = e.target.value;
    this.setState({ restaurant: this.state.restaurant })
  }

  render() {
    if (!this.state.restaurant) return null;
    const dish = this.state.restaurant.carte.filter(m => m.uid === this.props.dishId)[0];
    return (
      <>  
        <section className="jumbotron text-center ">
          <div className="container">
            <h1 className="resto-name">{dish.name} - {dish.price} €</h1>
            <p className="lead text-muted resto-description">{dish.description}</p>
            <div className="btn-group">
              <Link type="button" className="btn btn-secondary" to={`/restaurants/${this.state.restaurant.uid}`}><i className="fas fa-arrow-left" /> retour au restaurant</Link>
              <button type="button" className="btn btn-success" onClick={e => this.save(dish)}><i className="fas fa-save" /> sauvegarder</button>
              <button type="button" className="btn btn-danger"  onClick={e => this.delete(dish)}><i className="fas fa-trash" /> supprimer</button>
            </div>
          </div>
        </section>
        <div className="album py-5 bg-light">
          <div className="container">
          <form>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Nom</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" onChange={this.onChange} name="name" value={dish.name} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Description</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" onChange={this.onChange} name="description" value={dish.description} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Photo</label>
              <div class="col-sm-10">
                <input type="text" class="form-control"  onChange={this.onChange} name="photo" value={dish.photo} />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Prix</label>
              <div class="col-sm-10">
                <input type="number" class="form-control" onChange={this.onChange} name="price" value={dish.price} />
              </div>
            </div>
          </form>
          </div>
        </div>
      </>
    )
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

  save = () => {
    return fetch('/apis/restaurants/' + this.props.id, {
      method: 'PUT',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.restaurant)
    }).then(r => r.json())
  }

  add = () => {
    const uid = "dish_" + faker.random.alphaNumeric(16);
    this.state.restaurant.carte.push({
      "uid": uid,
      "name": "Le super burger",
      "description": "un burger qu'il est bien sympa. Buns moelleux sesame, 2 steaks 150gr, Bacon, Sauce du chef. Servi avec un bol de frites",
      "price": 12.99,
      "photos": ["https://cac.img.pmdstatic.net/fit/http.3A.2F.2Fprd2-bone-image.2Es3-website-eu-west-1.2Eamazonaws.2Ecom.2Fcac.2F2018.2F09.2F25.2F03ab5e89-bad7-4a44-b952-b30c68934215.2Ejpeg/748x372/quality/90/crop-from/center/burger-maison.jpeg"],
      "vegan": false,
      "homemade": true,
      "category": "main"
    })
    this.setState({ restaurant: this.state.restaurant }, () => {
      this.save().then(() => {
        window.location = '/restaurants/' + this.props.id + '/carte/' + uid
      });
    });
  }

  addMenu = () => {
    const uid = "menu_" + faker.random.alphaNumeric(16);
    this.state.restaurant.menus.push({
      "uid": uid,
      "name": "menu du midi",
      "description": "un petit menu qu'il est sympa",
      "price": 14.99,
      "hours": [{ "from": "12h00", "to": "15h00" }],
      "main": [{"ref":"dish_1"}],
      "dessert": [{"ref":"dish_2"}],
      "other": [{"ref":"dish_3"}]
    })
    this.setState({ restaurant: this.state.restaurant }, () => {
      this.save().then(() => {
        window.location = '/restaurants/' + this.props.id + '/menus/' + uid
      });
    });
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
            <p className="lead text-muted resto-description">{this.state.restaurant.description}</p>
            <p className="lead text-muted resto-description">
              <a href={`https://${this.state.restaurant.domain}-v2.restore-nation.site`}>{`https://${this.state.restaurant.domain}-v2.restore-nation.site`}</a>
            </p>
            <p className="lead text-muted" style={{ fontSize: 'small' }}>{this.state.restaurant.access.clientId} / {this.state.restaurant.access.clientSecret}</p>
            <div className="btn-group">
              <Link type="button" className="btn btn-secondary" to={`/`}><i className="fas fa-arrow-left" /> retour aux restaurants</Link>
              <Link type="button" className="btn btn-info" to={`/restaurants/${this.state.restaurant.uid}/orders`}><i className="fas fa-file-alt" /> commandes</Link>
              <Link type="button" className="btn btn-success" to={`/restaurants/${this.state.restaurant.uid}/edit`}><i className="fas fa-edit" /> editer</Link>
              <button type="button" className="btn btn-danger" onClick={this.deleteRestaurant}><i className="fas fa-trash" /> supprimer</button>
            </div>
          </div>
        </section>
        <div className="album py-5 bg-light">
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <h3>Les menus</h3>
            <button style={{ marginLeft: 10 }} type="button" className="btn btn-success btn-sm" onClick={this.addMenu}><i className="fas fa-plus"/></button>
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
                          <Link type="button" className="btn btn-sm btn-success" to={`/restaurants/${this.state.restaurant.uid}/menus/${menu.uid}`}><i className="fas fa-edit" /></Link>
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
            <button style={{ marginLeft: 10 }} type="button" className="btn btn-success btn-sm" onClick={this.add}><i className="fas fa-plus"/></button>
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
                        <Link type="button" className="btn btn-sm btn-success" to={`/restaurants/${this.state.restaurant.uid}/carte/${dish.uid}`}><i className="fas fa-edit" /></Link>
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
      }).then(r => r.json()).then(orders => this.setState({ orders: _.sortBy(orders, o => o.date) }))
    })
  }

  inProgress = (uid) => {
    fetch('/apis/restaurants/' + this.props.id + '/orders/' + uid + '/_inprogress', {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: '{}'
    }).then(() => {
      this.reload()
    })
  }

  done = (uid) => {
    fetch('/apis/restaurants/' + this.props.id + '/orders/' + uid + '/_done', {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: '{}'
    }).then(() => {
      this.reload()
    })
  }

  archive = (uid) => {
    fetch('/apis/restaurants/' + this.props.id + '/orders/' + uid + '/_archived', {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: '{}'
    }).then(() => {
      this.reload()
    })
  }

  render() {
    if (!this.state.restaurant) {
      return null;
    }
    console.log(this.state.orders)
    return (
      <>  
        <section className="jumbotron text-center ">
          <div className="container">
            <h1 className="resto-name">{this.state.restaurant.name}</h1>
            <p className="lead text-muted resto-description">Liste des commandes</p>
            <Link type="button" className="btn btn-secondary" to={`/restaurants/${this.state.restaurant.uid}`}><i className="fas fa-arrow-left" /> retour au restaurant</Link>
          </div>
        </section>
        <div className="album py-5 bg-light">
          <div className="container">
            <table className="table table-striped table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.orders.map((order, idx) => {
                  return (
                    <tr key={order.uid}>
                      <th scope="row">{idx + 1}</th>
                      <td>{order.firstName} {order.lastName}</td>
                      <td>{order.status}</td>
                      <td>{order.date}</td>
                      <td>
                        <Link style={{ marginRight: 10 }} type="button" className="btn btn-sm btn-info" to={`/restaurants/${this.props.id}/orders/${order.uid}`}><i className="fas fa-eye" /></Link>
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