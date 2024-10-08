/**
 * Checks if a string is null, undefined or empty (including whitespace).
 *
 * @param {string} input - The input to check.
 * @returns {boolean} - Returns `true` if the input is null, undefined or empty, `false` otherwise.
 */
export function isNullOrEmpty(input) {
    return !input || input.trim() === "";
}

/**
 * Checks if a given value is within a specified range, inclusive of the minimum and maximum.
 *
 * @param {number} value - The value to check.
 * @param {number} inclusiveMin - The minimum value of the range (inclusive).
 * @param {number} inclusiveMax - The maximum value of the range (inclusive).
 * @returns {boolean} - Returns `true` if the value is within the range, `false` otherwise.
 */
export function isInRange(value, inclusiveMin, inclusiveMax) {
    return value >= inclusiveMin && value <= inclusiveMax;
}

/**
 * Checks if a given input string is acceptable as a 'rgb' color.
 * 
 * The string must be 3 comma seperated values in the range 0.0 - 1.0.
 *
 * @param {string} input - The input to check.
 * @returns {boolean} - Returns `true` if the input is valid, `false` otherwise.
 */
export function isValidRgb(input) {
    if(isNullOrEmpty(input)) {
        return false;
    }

    const parts = input.split(',').map(part => part.trim());

    if (parts.length === 3) {
        return parts.every(part => {
            const num = Number(part);
            return !isNaN(num) && num >= 0.00 && num <= 1.00;
        });
    }

    return false;
}

/**
 * Checks if a given input string is acceptable as a 'rgb' color.
 * 
 * The string must be 3 comma seperated values in the range 0 - 255.
 *
 * @param {string} input - The input to check.
 * @returns {boolean} - Returns `true` if the input is valid, `false` otherwise.
 */
export function isValidRgb255(input) {
    if(isNullOrEmpty(input)) {
        return false;
    }

    const parts = input.split(',').map(part => part.trim());

    if (parts.length === 3) {
        return parts.every(part => {
            const num = Number(part);
            return !isNaN(num) && num >= 0 && num <= 255;
        });
    }

    return false;
}

/**
 * Checks if a given input string is acceptable as a hex color. 
 * 
 * The string must begin with a hash (#) and contain 6 characters in the range 0-9a-fA-F.
 *
 * @param {string} input - The input to check.
 * @returns {boolean} - Returns `true` if the input is valid, `false` otherwise.
 */
export function isValidHex(input) { 
    if(isNullOrEmpty(input)) {
        return false;
    }

    const hexRegex = /^#([A-Fa-f0-9]{6})$/;
    return hexRegex.test(input);
}

/**
 * Checks if a given input string is a valid web color. 
 *
 * @param {string} input - The input to check.
 * @returns {boolean} - Returns `true` if the input is valid, `false` otherwise.
 */
export function isValidWeb(input) { 
    if(isNullOrEmpty(input)) {
        return false;
    }

    const s = new Option().style;
    s.color = input; // s.color will be '' if the input was not valid
  
    return s.color === input.toLowerCase();
}