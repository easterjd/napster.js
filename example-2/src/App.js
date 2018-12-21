import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

// import Loading from './Components/Loading'
import Player from './Components/Player'

class App extends Component {
  render() {
    return (
      <Router className="App">
        <Switch>
          <Route path="/player" component={Player} />
        </Switch>
      </Router>
    );
  }
}

export default App;
