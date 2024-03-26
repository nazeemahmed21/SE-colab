import React from "react";
import MedBreathingComponent from "../components/med_breath";
import "../styles/med_breath.css";

const BreathingTechniquesPage = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div>
      <button className="med_button_to_go_back" onClick={goBack}>
        Go Back
      </button>
      <MedBreathingComponent />
    </div>
  );
};

export default BreathingTechniquesPage;
