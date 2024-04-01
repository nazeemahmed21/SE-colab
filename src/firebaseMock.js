// firebaseMock.js

// Mock the functions you need from the SDKs
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockGetAuth = jest.fn(() => ({
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  onAuthStateChanged: jest.fn(),
}));
const mockGetStorage = jest.fn();
const mockGetFirestore = jest.fn(() => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

// Mock the Firebase configuration
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: mockGetAuth,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  getStorage: mockGetStorage,
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: mockGetFirestore,
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

// Export the mocks
export {
  mockGetAuth,
  mockCreateUserWithEmailAndPassword,
  mockGetStorage,
  mockGetFirestore,
};
