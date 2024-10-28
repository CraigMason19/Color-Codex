export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


/**
 * A Class representing a data structure for a color class containing a red, green & blue component.
 * NOTE: All components are stored in the range 0-255.
 */
export class Color {
    constructor(r, g, b) {
        this.r = Math.floor(clamp(r, 0, 255));
        this.g = Math.floor(clamp(g, 0, 255));
        this.b = Math.floor(clamp(b, 0, 255));
    }
    
    get data() {
        return [this.r, this.g, this.b];
    }

    static fromRGB(r, g, b) {
        return new Color(r * 255, g * 255, b * 255);
    }

    static fromRGB255(r, g, b) {
        return new Color(r, g, b);
    }

    static fromRGBString(colorStr) {
        const match = colorStr.match(/rgba?\((\d+), (\d+), (\d+)/);
        if (match) {
            return new Color(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
        }
    
        return new Color(0, 0, 0);
    }

    static fromHex(hex) {
        hex = hex.replace('#', '');
        const bigint = parseInt(hex, 16);

        if(isNaN(bigint)) {
            return new Color(0, 0, 0);
        }

        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return new Color(r, g, b);
    }

    static fromWeb(name) {
        let fakeDiv = document.createElement('div');
        fakeDiv.style.color = name.toLowerCase();
        document.body.appendChild(fakeDiv);

        // Get computed color from the div
        let computedColor = window.getComputedStyle(fakeDiv).color;
        document.body.removeChild(fakeDiv);
 
        // Ensure the result is in 'rgb()' or 'rgba()' format
        if (computedColor.startsWith('rgb')) {
            let rgb = computedColor.match(/\d+/g);
            return new Color(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
        }

        return new Color(0, 0, 0);
    }


    toRgb() {
        let d = this.data.map(x => (x / 255).toFixed(2));
        return `${d[0]}, ${d[1]}, ${d[2]}`;
    }

    toRgb255() {
        let d = this.data;
        return `${d[0]}, ${d[1]}, ${d[2]}`;
    }

    toHex() {
        let d = this.data.map(x => {
            let hex = x.toString(16).toUpperCase();
            return hex.length === 1 ? '0' + hex : hex; // Ensure two digits by padding with '0'
        });
        
        return `#${d[0]}${d[1]}${d[2]}`;
    }
}