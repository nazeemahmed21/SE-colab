import React from 'react'
import computer from "../images/giphy (1).gif"
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
      <div className='wrapper'>
        <img src={computer} alt="" />
        <div className='logo'>
          <img src={logo} alt="" />
        </div>
        <div className='video'>
          <img src={video} alt="" />
        </div>
        <div className='wb'>
          <img src={wb} alt="" />
        </div>
        <div className='teams'>
          <img src={teams} alt="" />
        </div>
        <div className='container'>
          <div className='header'>Co-lab</div>
          <p className='slogan'>Learn to Connect. Connect to Colab</p>
          <p className='desc'>Bridging innovations, unleashing possibilities</p>
        </div>
        <div>
          <button className='login' onClick={() =>navigate('/login')}>Login</button>
          <button className='register' onClick={() =>navigate('/signup')}>Sign-Up</button>
        </div>
      </div>
    </section>
  )
}

export default Landingpage