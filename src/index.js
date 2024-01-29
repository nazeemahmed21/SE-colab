import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./index.css";
import reportWebVitals from "./reportWebVitals.js";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App.js";
import { AuthContextProvider } from './Context/AuthContext.jsx';
import { ChatContextProvider } from './Context/ChatContext.jsx';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
