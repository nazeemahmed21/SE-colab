import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Rout from "./Routes.js";
import AuthDetails from "./authdetails.js";

const App = () => {
  const [authUser, setAuthUser] = useState(null);

  const updateAuthState = (user) => {
    setAuthUser(user);
  };

  return (
    <BrowserRouter>
      <Rout />
      {/* <AuthDetails onAuthStateChanged={updateAuthState} /> */}
    </BrowserRouter>
  );
};

export default App;
