import React from 'react';
import {Link} from 'react-router-dom';
import './ThumbLink.css';

const ThumbLink = () => {
  return (
    <div className="ThumbLink">
            <div id="line" className="h-descr-line">
            <span className="text-move">B</span>
            <span className="text-move">l</span>
            <span className="text-move">a</span>
            <span className="text-move">c</span>
            <span className="text-move">k</span>

            <span className="text-move2">J</span>
            <span className="text-move2">a</span>
            <span className="text-move2">c</span>
            <span className="text-move2">k</span>
          </div>
      <Link  to="/blackjack">
        <img className="ThumbLink-link" alt="blackjack link" src={require("./bjPic.png")} />
      </Link>
    </div>
  )
}

export default ThumbLink;