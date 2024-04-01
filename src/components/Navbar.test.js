import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';

// Mock the ChatNavbar, Search, and Chats components
jest.mock('./ChatNavbar', () => () => <div data-testid="mockChatNavbar" />);
jest.mock('./Search', () => () => <div data-testid="mockSearch" />);
jest.mock('./Chats', () => () => <div data-testid="mockChats" />);

test('renders Sidebar component', () => {
  render(<Sidebar />);

  // Assert that the mocked components are rendered within Sidebar
  expect(screen.getByTestId('mockChatNavbar')).toBeInTheDocument();
  expect(screen.getByTestId('mockSearch')).toBeInTheDocument();
  expect(screen.getByTestId('mockChats')).toBeInTheDocument();

  // Add more specific assertions as needed
  //one more comment
});
