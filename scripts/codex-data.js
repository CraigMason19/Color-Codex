import { Color, clamp } from './color.js';

export const minimumOptions = {
    columnCount: 1,
    cellCount: 1,
    cellSize: 10,
    gapSize: 0,
    borderRadius: 0,
};

export const defaultOptions = {
    columnCount: 11,
    cellCount: 88,
    cellSize: 80,
    gapSize: 10,
    borderRadius: 15,
};

export const maximumOptions = {
    columnCount: 24,
    cellCount: 100,
    cellSize: 100,
    gapSize: 100,
    borderRadius: 100,
};

export const DEFAULT_COLOR = new Color(127, 127, 127);

function parseLine(line) {
    let [key, rawValue] = line.split(':').map(part => part.trim());
    let value = isNaN(Number(rawValue)) ? rawValue : Number(rawValue);

    return { key, value };
}

export class CodexData {
    constructor() {
        this.options = { ...defaultOptions }; // Deep copy

        // this.colors = Array.from({ length: this.options.cellCount }, () => new Color(127, 127, 127));
        this.colors = Array(this.options.cellCount).fill(DEFAULT_COLOR);
    }

    static fromLines(lines) {
        lines = lines.filter(line => line != "");

        if (lines.length === 0) {
            return null;
        }

        let cd = new CodexData(); 
        let colors = [];

        for (const line of lines) {
            const result = parseLine(line);

            if (result.key.startsWith("//")) {
                continue;
            }

            // Options
            if (typeof result.value === 'number' && result.key in defaultOptions) {
                const min = minimumOptions[result.key];
                const max = maximumOptions[result.key];
                cd.options[result.key] = clamp(result.value, min, max);
            }
            // Colors
            else if (result.key === 'color') {
                // Will be black if not a valid color
                colors.push(Color.fromHex(result.value));
            }
            else {
                return null;
            }
        }

        // If no colours are supplied, a default color will be used.
        // If the amount of colours do not cell count provided, then it is invalid
        // Otherwise we can use the colors provided
        if(colors.length === 0) {
            this.colors = Array.from({ length: cd.options.cellCount }, () => new Color(127, 127, 127));
        }
        else if (colors.length !== cd.options.cellCount) {
            return null;
        }
        else {
            cd.colors = Array.from(colors);
        }

        return cd;
    }
}