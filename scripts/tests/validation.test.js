// import { isNullOrEmpty, isInRange, isValidRgb, isValidRgb255, isValidHex, isValidWeb } from '../validation.js';

const { isNullOrEmpty, isInRange, isValidRgb, isValidRgb255, isValidHex, isValidWeb } = require('../validation.js');

test('Properly adds two numbers', () => {
    expect(isInRange(10, 0, 10)).toBeTruthy();
});