// MeditationPlayer.js
import React,{ useState, useRef, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import meditationAudio1 from '../components/Meditation1/IntroductionToMeditation.m4a';
import meditationAudio2 from '../components/Meditation1/BreathingExercise.m4a';
import meditationPic1 from '../components/Meditation1/IntroductionToMeditation.jpg';
import  meditationPic2 from '../components/Meditation1/BreathingExercise.jpg';
import '../styles/meditation1.css';
import Navbar from '../components/Navbar';
import pause from '../images/icons8-pause-button-50.png';
import play from '../images/icons8-circled-play-50.png';
import soundwave from '../images/sound-wave.gif';

// https://icons8.com/icons/set/sound-wave--animated 
// Circled Play  and pause buttons from Icons8.com https://icons8.com/icons/set/play-button


const meditationData = {
    "Introduction to Meditation": {
      picture: meditationPic1,
    //   https://marshalucasphd.com/basic-mindfulness-practice-audio-download-marsha-lucas-phd/
      audio: meditationAudio1,
      quotes: [
        "The present moment is the only moment available to us, and it is the door to all moments. - Thich Nhat Hanh",
        "In today's rush, we all think too much, seek too much, want too much, and forget about the joy of just being. - Eckhart Tolle",
        "Meditation is a way for nourishing and blossoming the divinity within you. - Amit Ray"
      ]
    },
    "Breathing Techniques": {
        // https://www.nivati.com/blog/what-is-4-7-8-breathing
        picture: meditationPic2,
        // https://www.youtube.com/watch?v=enJyOTvEn4M
        audio: meditationAudio2,
        quotes: [
          "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor. - Thich Nhat Hanh",
          "The breath is the king of the mind. - B.K.S. Iyengar",
          "If you want to conquer the anxiety of life, live in the moment, live in the breath. - Amit Ray"
        ]
      },
      "Body Scan Meditation": {
        picture: "path/to/introduction_picture.jpg",
        audio: "path/to/introduction_audio.mp3",
        quotes: [
          "Your body is your temple. Keep it pure and clean for the soul to reside in. - B.K.S. Iyengar",
          "Listen to your body. It's smarter than you. - Thich Nhat Hanh",
          "The body benefits from movement, and the mind benefits from stillness. - Sakyong Mipham"
        ]
      },
    // Define data for other titles similarly
  };
  
  // MeditationPlayer component
  const MeditationPlayer = ({ match }) => {
    // Extract parameters from the route
    const { title } = useParams();
    const { picture, audio, quotes } = meditationData[title];
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
   
    useEffect(() => {
        const intervalId = setInterval(() => {
          if (currentQuoteIndex < quotes.length - 1) {
            setCurrentQuoteIndex(currentQuoteIndex + 1);
          }
        }, 30000); // 30 seconds interval
    
        return () => clearInterval(intervalId);
      }, [currentQuoteIndex, quotes.length]);
    const toggleAudio = () => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    };

    return ( <div className='meditationPlayerPage' style={{ backgroundImage: `url(${picture})`, backgroundSize: 'cover' }}>
{/* <Navbar /> */}

        <div className='meditationPlayerTitle'>
        <h2>{title}</h2>
        </div>
        <br />
        <div className='meditationPlayerQuote'>
          <ul>
          {quotes[currentQuoteIndex]}
        </ul>
        </div>
        <audio ref={audioRef} src={audio} type="audio/mp3" controls />
        {isPlaying && <img src={soundwave} alt="Sound Wave" style={{ height: '120px' }} />}
        <div className="buttonContainer">
  <button className="playPauseButton" onClick={toggleAudio}>
    {isPlaying ? <img src={pause} alt="Pause" style={{ height: '120px' }} /> : <img src={play} alt="Play" style={{ height: '120px' }} />}
  </button>
</div>
 <br/>
      {isPlaying && <div className="musicWave"></div>}
     
      </div>
    );
  };
  
  export default MeditationPlayer;
  
