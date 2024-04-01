import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import { randomID } from './Video'; // Adjust the path to your file


describe('randomID function', () => {
  test('should generate a random ID of default length (5)', () => {
    const result = randomID();
    expect(result).toHaveLength(5);
  });

  test('should generate a random ID of specified length', () => {
    const result = randomID(10);
    expect(result).toHaveLength(10);
  });

  test('should generate different IDs on multiple calls', () => {
    const id1 = randomID();
    const id2 = randomID();
    expect(id1).not.toEqual(id2);
  });
});

// Add more test cases based on your requirements
