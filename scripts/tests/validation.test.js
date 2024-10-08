import { isNullOrEmpty, isInRange, isValidRgb, isValidRgb255, isValidHex, isValidWeb } from '../validation.js';

describe('Validation Functions', () => {
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
        test('returns false for non-empty string', () => {
            expect(isNullOrEmpty('test')).toBe(false);
        });
    });

    describe('isInRange', () => {
        test('returns true for value in range', () => {
            expect(isInRange(5, 1, 10)).toBe(true);
            expect(isInRange(5, 5, 10)).toBe(true);
            expect(isInRange(10, 1, 10)).toBe(true);
        });
        test('returns false for value out of range', () => {
            expect(isInRange(0, 1, 10)).toBe(false);
            expect(isInRange(11, 1, 10)).toBe(false);
        });
    });

    describe('isValidRgb', () => {
        test('validates correct RGB input', () => {
            expect(isValidRgb('0.5, 0.5, 0.5')).toBe(true);
        });
        test('rejects invalid RGB input', () => {
            expect(isValidRgb('1.5, 0, 0')).toBe(false);
            expect(isValidRgb('')).toBe(false);
        });
    });

    describe('isValidRgb255', () => {
        test('validates correct RGB255 input', () => {
            expect(isValidRgb255('255, 128, 0')).toBe(true);
        });
        test('rejects invalid RGB255 input', () => {
            expect(isValidRgb255('256, 0, 0')).toBe(false);
            expect(isValidRgb255('')).toBe(false);
        });
    });

    describe('isValidHex', () => {
         test('accepts correct HEX input', () => {
            expect(isValidHex('#FFAABB')).toBe(true);
            expect(isValidHex('#012ABC')).toBe(true);
        });
        test('rejects invalid HEX input', () => {
            expect(isValidHex('FFFFFF')).toBe(false);
            expect(isValidHex('#FF')).toBe(false);
            expect(isValidHex('#GGGGGG')).toBe(false);
            expect(isValidHex('')).toBe(false);
        });
    });

    describe('isValidWeb', () => {
        test('accepts correct web color input', () => {
            expect(isValidWeb('red')).toBe(true);
            expect(isValidWeb('cornflowerblue')).toBe(true);
        });
        test('rejects invalid web color input', () => {
            expect(isValidWeb('')).toBe(false);
        });
    });
});