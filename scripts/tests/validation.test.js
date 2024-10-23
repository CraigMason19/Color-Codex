import { isNullOrEmpty, isInRange,
         isValidRgb, isValidRgb255, isValidHex, isValidWeb } from '../validation.js';

describe('isNullOrEmpty', () => {
    test('returns true for null', () => {
        expect(isNullOrEmpty(null)).toBe(true);
    });
    test('returns true for undefined', () => {
        expect(isNullOrEmpty(undefined)).toBe(true);
    });
    test('returns true for empty string', () => {
        expect(isNullOrEmpty('')).toBe(true);
    });
    test('returns true for whitespace string', () => {
        expect(isNullOrEmpty('  ')).toBe(true);
    });
    test('returns false for non-empty string', () => {
        expect(isNullOrEmpty('test')).toBe(false);
    });
});

describe('isInRange', () => {
    test('returns true for value in range', () => {
        expect(isInRange(5, 1, 10)).toBe(true);
    });
    test('returns true for value in inclusive lower limit', () => {
        expect(isInRange(5, 5, 10)).toBe(true);
    });
    test('returns true for value in inclusive upper limit', () => {
        expect(isInRange(10, 5, 10)).toBe(true);
    });
    test('returns true for equal values', () => {
        expect(isInRange(5, 5, 5)).toBe(true);
    });
    test('returns true for value with negative limits', () => {
        expect(isInRange(-5, -10, -1)).toBe(true);
    });
    test('returns false for value out of minimum range', () => {
        expect(isInRange(5, 8, 12)).toBe(false);
    });
    test('returns false for value out of maximum range', () => {
        expect(isInRange(15, 8, 12)).toBe(false);
    });
});
    
describe('isValidRgb', () => {
    test('validates correct RGB input', () => {
        expect(isValidRgb('0.5, 0.5, 0.5')).toBe(true);
    });
    test('validates minimum RGB input', () => {
        expect(isValidRgb('0.0, 0.0, 0.0')).toBe(true);
    });
    test('validates maximum RGB input', () => {
        expect(isValidRgb('1.0, 1.0, 1.0')).toBe(true);
    });
    test('validates no decimal input', () => {
        expect(isValidRgb('1, 0, 0.3')).toBe(true);
    });
    test('validates commas input', () => {
        expect(isValidRgb('1,0, 0.3')).toBe(true);
    });
    test('rejects too many variables', () => {
        expect(isValidRgb('1, 0, 0.3, 0.5')).toBe(false);
    });
    test('rejects too few variables', () => {
        expect(isValidRgb('1, 0')).toBe(false);
    });
    test('rejects no variables', () => {
        expect(isValidRgb('')).toBe(false);
    });
    test('rejects invalid component', () => {
        expect(isValidRgb('1.5, 0, 0')).toBe(false);
    });
    test('rejects invalid component', () => {
        expect(isValidRgb('-1.0, 0, 0')).toBe(false);
    });
    test('rejects brackets', () => {
        expect(isValidRgb('(0.0, 0.0, 0.0)')).toBe(false);
    });
    test('rejects letters', () => {
        expect(isValidRgb('a, 1, 1')).toBe(false);
    });
});

describe('isValidRgb255', () => {
    test('validates correct RGB input', () => {
        expect(isValidRgb255('255, 255, 255')).toBe(true);
    });
    test('validates minimum RGB input', () => {
        expect(isValidRgb255('0, 0, 0')).toBe(true);
    });
    test('validates maximum RGB input', () => {
        expect(isValidRgb255('255, 255, 255')).toBe(true);
    });
    test('validates commas input', () => {
        expect(isValidRgb255('100,100, 255')).toBe(true);
    });
    test('rejects too many variables', () => {
        expect(isValidRgb255('255, 255, 255, 255')).toBe(false);
    });
    test('rejects too few variables', () => {
        expect(isValidRgb255('255, 255')).toBe(false);
    });
    test('rejects no variables', () => {
        expect(isValidRgb255('')).toBe(false);
    });
    test('rejects invalid component', () => {
        expect(isValidRgb255('220, 220, test')).toBe(false);
    });
    test('rejects brackets', () => {
        expect(isValidRgb('(250, 250, 250)')).toBe(false);
    });
    test('rejects letters', () => {
        expect(isValidRgb('A, 200, 200')).toBe(false);
    });
});

describe('isValidHex', () => {
    test('validates begins with hash', () => {
        expect(isValidHex('#123456')).toBe(true);
    });
    test('rejects not begins with hash', () => {
        expect(isValidHex('123456')).toBe(false);
    });
    test('validates correct length', () => {
        expect(isValidHex('#A1B2C3')).toBe(true);
    });
    test('rejects length too short', () => {
        expect(isValidHex('#A1B2C')).toBe(false);
    });
    test('rejects length too long', () => {
        expect(isValidHex('#A1B2C34')).toBe(false);
    });
    test('rejects empty string', () => {
        expect(isValidHex(' ')).toBe(false);
    });
    test('rejects white space', () => {
        expect(isValidHex('#A1 B2 C3')).toBe(false);
    });
    test('rejects letter out of range space', () => {
        expect(isValidHex('#GG0000')).toBe(false);
    });
    test('rejects letter out of range space', () => {
        expect(isValidHex('#GG0000')).toBe(false);
    });
    test('validates lowercase strings', () => {
        expect(isValidHex('#abcdef')).toBe(true);
    });
    test('validates uppercase strings', () => {
        expect(isValidHex('#ABCDEF')).toBe(true);
    });
    test('validates mixed case strings', () => {
        expect(isValidHex('#AbCdEf')).toBe(true);
    });
});

describe('isValidWeb', () => {
    test('returns true for valid web color', () => {
        expect(isValidWeb('red')).toBe(true);
        expect(isValidWeb('cornflowerblue')).toBe(true);
        expect(isValidWeb('whitesmoke')).toBe(true);
    });
  
    test('returns false for invalid web color', () => {
        expect(isValidWeb('notacolor')).toBe(false);
        expect(isValidWeb('invalid')).toBe(false);
        expect(isValidWeb('error')).toBe(false);
    });
  
    test('returns false for empty input', () => {
        expect(isValidWeb('')).toBe(false); 
    });
});