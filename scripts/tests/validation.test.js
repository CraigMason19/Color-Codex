import { isNullOrEmpty, isInRange, isValidRgb, isValidRgb255, isValidHex, isValidWeb } from '../validation.js';

test('Properly includes lower inclusive bound', () => {
    expect(isInRange(2, 2, 10)).toBeTruthy();
});

test('Properly includes upper inclusive bound', () => {
    expect(isInRange(10, 0, 10)).toBeTruthy();
});

test('Properly rejects lower bound', () => {
    expect(isInRange(1, 2, 10)).not.toBeTruthy();
});

test('Properly rejects upper bound', () => {
    expect(isInRange(15, 2, 10)).not.toBeTruthy();
});