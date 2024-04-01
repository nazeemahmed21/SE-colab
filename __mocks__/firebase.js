export const auth = {
    currentUser: null,
    signOut: jest.fn(),
  };
  
  export const db = {
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
  };