import React, { useState, useEffect } from "react";
import ad2 from '../images/ad2.gif';
import "../styles/ads.css";

function Ad(props) {
    return (props.trigger) ?  (
    <div className="adPic">
        <div className="adPic-inner">
            <button className="closeAd" onClick={() => props.setTrigger(false)}>Close Ad</button>
            {props.children}
            <img src={ad2} alt="Ad GIF" />
        </div>
    </div>
    ) :"";
}

export default Ad;