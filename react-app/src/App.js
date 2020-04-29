import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Main from './components/Main';
import Login from './components/Login';
import GlobalStyle from './GlobalStyle';

function App() {
  return (
    <Router> 
      <Switch>
        <Redirect exact from="/" to="/login" />
      </Switch>
      <Route path="/login" component={Login} />
      <Route path="/chatroom" component={Main} />
      <GlobalStyle />
    </Router>
  );
}

export default App;
