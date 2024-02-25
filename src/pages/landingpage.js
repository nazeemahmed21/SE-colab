import React from 'react'
import computer from "../images/gif1.gif"
import logo from "../images/logo.png"
import video from "../images/video-call.jpg"
import wb from "../images/wb.jpg"
import teams from "../images/tems.jpg"
import '../styles/landingpage.css'
import { useNavigate } from 'react-router-dom'

const Landingpage = () => {
  const navigate = useNavigate(); 
  return (
    <section>
      <div className='landing-p-wrapper'>
        <img src={computer} alt="" />
        <div className='landing-p-logo'>
          <img src={logo} alt="" />
        </div>
        <div className='landing-p-video'>
          <img src={video} alt="" />
        </div>
        <div className='landing-p-wb'>
          <img src={wb} alt="" />
        </div>
        <div className='landing-p-teams'>
          <img src={teams} alt="" />
        </div>
        <div className='landing-p-container'>
          <div className='landing-p-header'>Co-lab</div>
          <p className='landing-p-slogan'>Learn to Connect. Connect to Colab</p>
          <p className='landing-p-desc'>Bridging innovations, unleashing possibilities</p>
        </div>
        <div>
          <button className='landing-p-login' onClick={() =>navigate('/login')}>Login</button>
          <button className='landing-p-register' onClick={() =>navigate('/signup')}>Sign-Up</button>
        </div>
      </div>
    </section>
  )
}

export default Landingpage