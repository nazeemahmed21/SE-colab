// firestore.mock.js
import { initializeTestEnvironment, getFirestore } from '@firebase/rules-unit-testing';

// Set up rules for Firestore (assuming default rules for testing)
const firestoreRules = `
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /Users/{userId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
`;

// Initialize Firestore app for testing
export const createTestFirestore = async (auth) => {
  const projectId = 'colab-f7424'; // Replace with your test project ID
  const app = initializeTestEnvironment({ projectId, firestore: { rules: firestoreRules } });
  const firestoreInstance = getFirestore(app);

  return firestoreInstance;
};
