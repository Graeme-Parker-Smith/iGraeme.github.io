import React from "react";
import { Link } from "react-router-dom";
import BlackJack from "./blackjack";
import "./blackjack.css";

const Bj = () => {
  return (
    <div>
      <BlackJack />
      {/* <button id="Home-link"> */}
        <Link id="Home-link" to="/">Back to Homepage</Link>
      {/* </button> */}
      <script type="text/javascript" src="./dotTrail.js"></script>
    </div>
  );
};

export default Bj;
