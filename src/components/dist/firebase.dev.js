"use strict";

var _app = require("firebase/app");

var _auth = require("firebase/auth");

// Import the functions you need from the SDKs you need
var firebaseConfig = {
  apiKey: "AIzaSyDU7kJB3Rjlt-C9cRkQqToPAapVupv05cw",
  authDomain: "software-engin.firebaseapp.com",
  projectId: "software-engin",
  storageBucket: "software-engin.appspot.com",
  messagingSenderId: "994309502283",
  appId: "1:994309502283:web:e8bd13cca86973a32724ce",
  measurementId: "G-R0XRFQYR89"
}; // Initialize Firebase

var app = (0, _app.initializeApp)(firebaseConfig);
var auth = (0, _auth.getAuth)();
//# sourceMappingURL=firebase.dev.js.map
