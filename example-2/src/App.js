import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Player from './Components/Player'
import Login from './Components/Login'

class App extends Component {
  render() {
    return (
      <Router className="App">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/player" component={Player} />
        </Switch>
      </Router>
    );
  }
}

export default App;
