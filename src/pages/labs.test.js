import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Labs from './labs';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders Labs component', () => {
  render(
    <Router>
      <Labs />
    </Router>
  );

  // Check if the heading is present
  expect(screen.getByText('Labs')).toBeInTheDocument();

  // Check if the "Join Lab" button is present
  expect(screen.getByText('Join Lab')).toBeInTheDocument();

  // Check if the "Create a Lab" button is present
  expect(screen.getByText('Create a Lab')).toBeInTheDocument();

  // Check if the lab boxes are present
  expect(screen.getByText('Lab A')).toBeInTheDocument();
  expect(screen.getByText('Lab B')).toBeInTheDocument();
  expect(screen.getByText('Lab C')).toBeInTheDocument();
  
  // You can add more specific checks based on your component structure and requirements
});
