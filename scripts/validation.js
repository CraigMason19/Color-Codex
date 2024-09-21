export function isNullOrEmpty(input) {
    return input === null || input === undefined || input.trim() === "";
}

export function isInRange(value, min, max) {
    return value >= min && value <= max;
}

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

export function isValidHex(input) { 
    if(isNullOrEmpty(input)) {
        return false;
    }

    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(input);
}

export function isValidWeb(input) { 
    if(isNullOrEmpty(input)) {
        return false;
    }

    const s = new Option().style;
    s.color = input;
  
    // s.color will be '' if the input was not valid
    return s.color == input.toLowerCase();
}

export function isValidCodexData(lines) {
    return true;
}