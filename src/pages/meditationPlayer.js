// MeditationPlayer.js
import React from 'react';
import { useParams } from 'react-router-dom';
// import meditation1audio1 from './components/Meditation1/IntroductionToMeditation.m4a';

// Define your data mapping titles to corresponding picture, audio, and quotes
const meditationData = {
    "Introduction to Meditation": {
      picture: "path/to/introduction_picture.jpg",
    //   https://marshalucasphd.com/basic-mindfulness-practice-audio-download-marsha-lucas-phd/
      audio: "meditation1audio1",
      quotes: [
        "The present moment is the only moment available to us, and it is the door to all moments. - Thich Nhat Hanh",
        "In today's rush, we all think too much, seek too much, want too much, and forget about the joy of just being. - Eckhart Tolle",
        "Meditation is a way for nourishing and blossoming the divinity within you. - Amit Ray"
      ]
    },
    "Breathing Techniques": {
        picture: "path/to/introduction_picture.jpg",
        // https://www.youtube.com/watch?v=enJyOTvEn4M
        audio: "https://www.youtube.com/watch?v=enJyOTvEn4M",
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
  
    // Get data for the current title
    const { picture, audio, quotes } = meditationData[title];
  
    return (
      <div>
        <h1>Meditation Player</h1>
        <h2>{title}</h2>
        <img src={picture} alt="Meditation" />
        <audio controls>
          <source src={audio} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
        <div>
          <h3>Quotes for {title}</h3>
          <ul>
            {quotes.map((quote, index) => (
              <li key={index}>{quote}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default MeditationPlayer;
  
