import React, { useState, useRef, useEffect } from "react";
import "../styles/med_breath.css";

const MedBreathingComponent = () => {
  const [breathsLeft, setBreathsLeft] = useState(3);
  const [isBreathing, setIsBreathing] = useState(false);
  const instructionsRef = useRef(null);
  const startButtonRef = useRef(null);
  const circleProgressRef = useRef(null);
  const breathsTextRef = useRef(null);

  useEffect(() => {
    instructionsRef.current = document.querySelector(".med_instructions");
    startButtonRef.current = document.querySelector(".med_start_button");
    circleProgressRef.current = document.querySelector(".med_circle_progress");
    breathsTextRef.current = document.querySelector(".med_breaths_text");
  }, []);

  const growCircle = () => {
    circleProgressRef.current.classList.add("med_circle_grow");
    setTimeout(() => {
      circleProgressRef.current.classList.remove("med_circle_grow");
    }, 8000);
  };

  const breathTextUpdate = () => {
    setBreathsLeft((prevBreathsLeft) => {
      const updatedBreathsLeft = Math.max(prevBreathsLeft - 1, 0);
      console.log("Updating breathsLeft:", updatedBreathsLeft);

      if (updatedBreathsLeft >= 0) {
        console.log(updatedBreathsLeft, "text update");
        instructionsRef.current.innerText = "Breath In";
        setTimeout(() => {
          instructionsRef.current.innerText = "Hold Breath";
          setTimeout(() => {
            instructionsRef.current.innerText = "Exhale Breath Slowly";
          }, 4000);
        }, 4000);
      } else {
        console.log("Breathing session completed.");
        instructionsRef.current.innerText =
          "Breathing Session Completed. Click 'begin' to start another session!";
        startButtonRef.current.classList.remove("med_button_inactive");
        setBreathsLeft(
          parseInt(document.querySelector(".med_breath_input").value)
        );
        setIsBreathing(false);
      }
      setBreathsLeft(updatedBreathsLeft);
      return updatedBreathsLeft;
    });
  };

  const breathingApp = () => {
    if (!isBreathing) {
      setIsBreathing(true);
      console.log(breathsLeft, "b4 interval breaths left");
      const breathingAnimation = setInterval(() => {
        setBreathsLeft((prevBreathsLeft) => {
          console.log(prevBreathsLeft, "b4 if breaths left");
          if (prevBreathsLeft <= 0) {
            console.log(prevBreathsLeft, "breaths left");
            clearInterval(breathingAnimation);
            console.log("Interval cleared. Breathing session completed.");
            instructionsRef.current.innerText =
              "Breathing Session Completed. Click 'begin' to start another session!";
            startButtonRef.current.classList.remove("med_button_inactive");
            setBreathsLeft(
              parseInt(document.querySelector(".med_breath_input").value)
            );
            setIsBreathing(false);
            return;
          }
          growCircle();
          console.log("Breathing app function called.");
          breathTextUpdate();
          return prevBreathsLeft;
        });
      }, 12000);
    }
  };

  const handleStartClick = () => {
    startButtonRef.current.classList.add("med_button_inactive");
    instructionsRef.current.innerText =
      "Get relaxed, and ready to begin breathing";
    setTimeout(() => {
      instructionsRef.current.innerText = "Breathing is about to start...";
      setTimeout(() => {
        breathingApp();
        growCircle();
        breathTextUpdate();
      }, 2000);
    }, 2000);
  };

  const handleBreathsChange = (event) => {
    setBreathsLeft(event.target.value);
    breathsTextRef.current.innerText = event.target.value;
  };

  return (
    <div className="med_breath_page">
      <div className="med_breath_container">
        <div className="med_input">
          <label>Select Breaths</label>
          <select
            className="med_breath_input"
            onChange={handleBreathsChange}
            value={breathsLeft}
          >
            <option value="3">3 Breaths</option>
            <option value="5">5 Breaths</option>
            <option value="7">7 Breaths</option>
          </select>
        </div>
        <div className="med_circle_wrap">
          <div className="med_circle_outline"></div>
          <div className="med_circle_progress"></div>
        </div>
        <p className="med_breaths">
          Breaths remaining:
          <span className="med_breaths_text" ref={breathsTextRef}>
            {breathsLeft}
          </span>
        </p>
        <p className="med_instructions" ref={instructionsRef}>
          Are you ready to start breathing?
        </p>
        <button
          className="med_start_button"
          onClick={handleStartClick}
          ref={startButtonRef}
        >
          Begin
        </button>
      </div>
    </div>
  );
};

export default MedBreathingComponent;
