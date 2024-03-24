import React from "react";
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import '../styles/games.css';
import wordleIcon from '../images/wordle.png';
import memoryGameIcon from '../images/memory.png';

const Games = () => {
  return (
    <div>
      <Navbar />
      <div className="games_container">
        <div className="games_boxes">
          <Link to="https://ansongeo.github.io/wordgame" target="_blank" className="games_box">
            <img src={wordleIcon} alt="wordle icon" className="games-icon" />
            <h2>Word Game</h2>
          </Link>
          <Link to="/" className="games_box">
            <img src={memoryGameIcon} alt="memory game icon" className="games-icon" />
            <h2>Memory Game</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Games;
