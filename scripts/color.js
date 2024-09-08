function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export default class Color {
    constructor(r, g, b) {
        this.r = clamp(r, 0, 255);
        this.g = clamp(g, 0, 255);
        this.b = clamp(b, 0, 255);
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

    static fromHex(hex) {
        hex = hex.replace('#', '');
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        return new Color(r, g, b);
    }

    static fromWeb(name) {
        let fakeDiv = document.createElement('div');
        fakeDiv.style.color = name;
        document.body.appendChild(fakeDiv);
        let cs = window.getComputedStyle(fakeDiv).color;
        document.body.removeChild(fakeDiv);
    
        let rgb = cs.match(/\d+/g);
        return new Color(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
    }


    toRgb() {
        let d = this.data.map(x => (x / 255).toFixed(2));
        return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
    }

    toRgb255() {
        let d = this.data;
        return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
    }

    toHex() {
        let d = this.data.map(x => {
            let hex = x.toString(16).toUpperCase();
            return hex.length === 1 ? '0' + hex : hex; // Ensure two digits by padding with '0'
        });
        
        return `#${d[0]}${d[1]}${d[2]}`;
    }

}