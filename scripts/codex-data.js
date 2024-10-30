import { Color, clamp } from './color.js';

export const minimumOptions = {
    columnCount: 1,
    cellCount: 1,
    cellSize: 10,
    gapSize: 0,
    borderRadius: 0,
};

export const defaultOptions = {
    columnCount: 5,
    cellCount: 25,
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
        this.options = defaultOptions;
        this.colors = Array(this.options.cellCount).fill(DEFAULT_COLOR);
    }

    static fromLines(lines) {
        lines = lines.filter(line => line != "");

        if (lines.length === 0) {
            return null;
        }

        // console.log(lines);

        let cd = new CodexData(); 
        let colours = [];

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
                colours.push(Color.fromHex(result.value));
            }
            else {
                return null;
            }
        }

        // console.log(cd);

        // If colours are not present, default color will be used
        // If colours are present, they must be the same length as the options
        if (colours.length != 0 && colours.length !== cd.options.cellCount) {
            return null;
        }

        return cd;
    }
}