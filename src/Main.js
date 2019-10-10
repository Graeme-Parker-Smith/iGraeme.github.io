import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ThumbLink from './ThumbLink';
import "./Main.css";

const Main = () => {
  useEffect(() => {
    document.title = "Graeme's Website";
    const lineArr = document.getElementById("line").childNodes;
    setInterval(() => {
      for(let i = lineArr.length - 1; i > 0; i--){
        setTimeout(() => {
          lineArr[i].style.marginLeft = "20px";
          setTimeout(() => lineArr[i].style.marginLeft = "0px", (Math.random() + 20) * 75);
        }, (Math.random() + 20) * 75);
      }
    }, 2000);
  }, []);
  return (
    <div className="Main">
      <div className="Main-home">
        <div className="h-description">
          <div className="h-description-name">
            <div className="h-d-name-box">
              <span className="h-d-name1">Graeme</span>
            </div>
            <div className="h-d-name-box">
              <span className="h-d-name2">Parker</span>
            </div>
            <div className="h-d-name-box">
              <span className="h-d-name3">Smith</span>
            </div>
          </div>
          <div className="introduce">
            This is my website! Below is a link to my blackjack game!
          </div>
          <div className="huge-text"></div>
        </div>
      </div>
    
      <ThumbLink />
    </div>
  );
};

export default Main;
