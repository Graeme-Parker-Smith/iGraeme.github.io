import React from 'react';
import Main from './Main';
import Bj from './blackjack/Bj';
import {Route, Switch} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={Main} />
        <Route exact path='/blackjack' component={Bj} />
      </Switch>
    </div>
  );
}

export default App;
