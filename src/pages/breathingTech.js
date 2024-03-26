import React from "react";
import MedBreathingComponent from "../components/med_breath";

const BreathingTechniquesPage = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div>
      <button onClick={goBack}>Go Back</button>
      <h1>Breathing Techniques</h1>
      <p>4 seconds breath in</p>
      <p>4 seconds hold breath</p>
      <p>4 seconds breath out</p>
      <MedBreathingComponent />
    </div>
  );
};

export default BreathingTechniquesPage;
