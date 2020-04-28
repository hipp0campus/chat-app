import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Main from './components/Main';
import Login from './components/Login';
import GlobalStyle from './GlobalStyle';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Route path="/login" component={Login} />
      <Route path="/chatroom" component={Main} />
    </Router>
  );
}

export default App;
