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
    gapSize: 10,
    borderRadius: 15,
    cellSize: 80
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
        this.colors = [];
    }

    static fromLines(lines) {
        lines = lines.map(line => line.toLowerCase()).filter(line => line != "");

        if (lines.length === 0) {
            return null;
        }

        // console.log(lines);

        let cd = new CodexData(); 

        for (const line of lines) {
            const result = parseLine(line);

            if (result.key.startsWith("//")) {
                // ...
            }

            // Options
            else if (typeof result.value === 'number') {
                if (result.key === 'columncount') {
                    cd.options.columnCount = clamp(result.value, minimumOptions.columnCount, maximumOptions.columnCount);
                } 
                else if (result.key === 'cellcount') {
                    cd.options.cellCount = clamp(result.value, minimumOptions.cellCount, maximumOptions.cellCount);
                } 
                else if (result.key === 'cellsize') {
                    cd.options.cellSize = clamp(result.value, minimumOptions.cellSize, maximumOptions.cellSize);
                } 
                else if (result.key === 'gapsize') {
                    cd.options.gapSize = clamp(result.value, minimumOptions.gapSize, maximumOptions.gapSize);
                }
                else if (result.key === 'borderradius') {
                    cd.options.borderRadius = clamp(result.value, minimumOptions.borderRadius, maximumOptions.borderRadius);
                } 
            }

            // Colors
            else if (result.key === 'color') {
                // Will be black if not a valid color
                cd.colors.push(Color.fromHex(result.value));
            }
            else {
                return null;
            }
        }

        // console.log(cd);

        // If colours are not present then just use default color
        if (cd.colors.length === 0) {
            cd.colors = Array(cd.options.cellCount).fill(DEFAULT_COLOR.toHex());
        }
        // If colours are present, they must be the same length as the options
        else if (cd.colors.length !== cd.options.cellCount) {
            return null;
        }

        return cd;
    }
}