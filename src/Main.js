import React from 'react';
import {Link} from 'react-router-dom';

const Main = () => {
  return (
    <div>
      Main Page
      <Link to='/blackjack' >BlackJack Portal</Link>
    </div>
  );
};

export default Main;