"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signup = signup;

var _auth = require("firebase/auth");

var _firebase = _interopRequireDefault(require("./firebase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Import the initialized Firebase app
var auth = (0, _auth.getAuth)(_firebase["default"]);

function signup(email, password) {
  return (0, _auth.createUserWithEmailAndPassword)(auth, email, password);
}
//# sourceMappingURL=signupauth.dev.js.map
