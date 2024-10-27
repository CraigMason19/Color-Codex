import { Color } from './color.js';

export const defaultOptions = {
    columnCount: 5,
    cellCount: 25,
    gapSize: 10,
    borderRadius: 15,
    cellSize: 80
};

export class CodexData {
    constructor() {
        this.options = defaultOptions;

        this.colors = [];
    }

    static fromLines(lines) {
        const codexData = new CodexData();

        // // Remove empty and comment lines
        // lines = lines.split("\n").filter(line => line !== "" && !line.startsWith("//"));
        


        // // Read options
        // const requiredKeys = new Set(['Column Count', 'Cell Count', 'Cell Size', 'Gap Size', 'Border Radius']);
        // // const foundKeys = new Set();
    
        // // for(let i = 0; i < requiredKeys.length; i++) {
        // //     const [key, value] = lines[i].split(":").map(item => item.trim());
        // //     foundKeys.add(key);
        // // }
    

    
        // for(let i = requiredKeys.size; i < lines.length; i++) {
        //     try {
        //         const value = lines[i].split(":").map(part => part.trim())[1];
        //         const rgbValues = value.substring(4, value.length-1).split(",").map(part => Number(part));

        //         if(rgbValues.length != 3 || rgbValues.some(value => isNaN(value))) {
        //             codexData.isValid = false;
        //             codexData.colors = [];
        //             break;
        //         }
        //         codexData.colors.push(new Color(...rgbValues));
        //     }
        //     catch(error) {
        //         codexData.isValid = false;
        //         codexData.colors = [];
        //         break;
        //     }
        // }

        // // Cell count must match the number of items found
        // if(codexData.colors.length !== codexData.cellCount) {
        //     codexData.isValid = false;
        // }
    
        // // If there are no colors we will just use the default colors
        // if(codexData.colors.length === 0) {
        //     codexData.isValid = true;
        // }

        return null;
    }
}