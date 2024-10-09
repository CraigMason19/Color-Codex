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

    // "(255, 255, 255)",
    // "255",
    // "255, 255",
    // "255, 255, 255",
    // "255, 255, 256",
    // "(255, 255, 240)",
    // "240, 158, 64"
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

    // describe('isValidWeb', () => {
    //     test('accepts correct web color input', () => {
    //         expect(isValidWeb('red')).toBe(true);
    //         expect(isValidWeb('cornflowerblue')).toBe(true);
    //     });
    //     test('rejects invalid web color input', () => {
    //         expect(isValidWeb('')).toBe(false);
    //     });
    // });
});