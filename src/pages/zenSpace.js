import React from "react";
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import '../styles/zenSpace.css';
import meditateIcon from '../images/meditationZenSpace.png';
import gameIcon from '../images/gamingZenSpace.png';

const ZenSpace = () => {
    return (
        <div>
            <div className="NavbarZenSpaceContainer">
                <Navbar />
            </div>
            <div className="content-containerZenSpace">
                <h1 className="titleZenSpace">How do you want to relax?</h1>
                <div className="boxes-containerZenSpace">
                    <Link to="https://ansongeo.github.io/wordgame" className="boxZenSpace">
                        <img src={gameIcon} alt="games icon" className="box-iconZen" />
                        <h2>Games</h2>
                    </Link>
                    <Link to="/meditation1" className="boxZenSpace">
                        <img src={meditateIcon} alt="meditation icon" className="box-iconZen" />
                        <h2>Meditation</h2>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ZenSpace;
