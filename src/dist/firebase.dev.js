"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAuth = useAuth;
exports.db = exports.auth = exports.storage = void 0;

var _app = require("firebase/app");

var _auth = require("firebase/auth");

var _storage = require("firebase/storage");

var _firestore = require("firebase/firestore");

var _react = require("react");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBJ0R15ggpAOPPNYXOIxJMeXzJxmwqx2Qc",
  authDomain: "final-colab.firebaseapp.com",
  projectId: "final-colab",
  storageBucket: "final-colab.appspot.com",
  messagingSenderId: "474778904282",
  appId: "1:474778904282:web:4e6913ee24a5b7f214a7e3"
}; // Initialize Firebase

var app = (0, _app.initializeApp)(firebaseConfig);
var auth = (0, _auth.getAuth)();
exports.auth = auth;
var storage = (0, _storage.getStorage)(app);
exports.storage = storage;
var db = (0, _firestore.getFirestore)(app); // export async function signup(email, password,firstName, lastName, gender, role) {
//   const auth = getAuth(); // Get the auth instance
//   try {
//     // Create the user with email and password
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     // Extract the user's UID
//     const uid = userCredential.user.uid;
//     // Add a new document with user information to the "users" collection
//     const usersCollection = collection(db, "users"); // Assuming "db" is your Firestore instance
//     await addDoc(usersCollection, {
//       uid,
//       firstName,
//       lastName,
//       gender,
//       role,
//     });
//     // Return the user
//     return userCredential.user;
//   } catch (error) {
//     // Handle any errors here
//     throw error;
//   }
// }

exports.db = db;

function useAuth() {
  var _useState = (0, _react.useState)(),
      _useState2 = _slicedToArray(_useState, 2),
      currentUser = _useState2[0],
      setCurrentUser = _useState2[1];

  (0, _react.useEffect)(function () {
    var unsub = (0, _auth.onAuthStateChanged)(auth, function (user) {
      return setCurrentUser(user);
    });
    return unsub;
  }, []);
  return currentUser;
}
//# sourceMappingURL=firebase.dev.js.map
