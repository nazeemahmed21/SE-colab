import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './login';
import * as admin from 'firebase-admin';

// Mock the necessary modules
jest.mock('react-router-dom', () => ({
  Link: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock('../firebase', () => ({
  auth: {},
}));

// Mock Firebase admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  auth: () => ({
    signInWithEmailAndPassword: jest.fn(),
  }),
}));

describe('Login Component', () => {
  it('renders login form correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Login />);

    expect(getByText('Enter your Email Address')).toBeInTheDocument();
    expect(getByPlaceholderText('Email...')).toBeInTheDocument();
    expect(getByText('Enter your Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Password...')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('calls signInWithEmailAndPassword when login button is clicked', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailInput = getByPlaceholderText('Email...');
    const passwordInput = getByPlaceholderText('Password...');
    const loginButton = getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
    expect(admin.auth().signInWithEmailAndPassword).toHaveBeenCalledWith(
      'test@example.com',
     'password123'
     );
    });
  });

  // Add more tests based on your specific requirements
});
