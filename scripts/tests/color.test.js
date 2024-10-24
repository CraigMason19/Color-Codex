import { Color } from '../color.js';

describe('color construction', () => {
    test('succesful construction', () => {
        let color = new Color(255, 0, 0);
        expect(color.data).toEqual([255, 0, 0]);

        color = new Color(255, 300, 0);
        expect(color.data).toEqual([255, 255, 0]);
    });
});

describe('fromRGB', () => {
    test('clamp values out of upper range', () => {
        let color = Color.fromRGB(1, 1.1, 5.5);
        expect(color.data).toEqual([255, 255, 255]);
    });
    test('clamp values out of lower range', () => {
        let color = Color.fromRGB(0, -1.0, -100.052);
        expect(color.data).toEqual([0, 0, 0]);
    });
});

describe('fromRGB255', () => {
    test('clamp values out of upper range', () => {
        let color = Color.fromRGB255(255, 256, 4000);
        expect(color.data).toEqual([255, 255, 255]);
    });
    test('clamp values out of lower range', () => {
        let color = Color.fromRGB255(0, -255, -4000);
        expect(color.data).toEqual([0, 0, 0]);
    });
});

describe('fromRGBString', () => {
    test('correct color from rgb()', () => {
        const color = Color.fromRGBString('rgb(50, 100, 150');
        expect(color.data).toEqual([50, 100, 150]);
    });
    test('correct color from rgba()', () => {
        const color = Color.fromRGBString('rgba(50, 100, 150');
        expect(color.data).toEqual([50, 100, 150]);
    });
    test('negative out of range values are invalid and become black', () => {
        const color = Color.fromRGBString('rgba(100, 100, -5)');
        expect(color.data).toEqual([0, 0, 0]);
    });
    test('positive out of range values are clamped', () => {
        const color = Color.fromRGBString('rgba(500, 300, 150)');
        expect(color.data).toEqual([255, 255, 150]);
    });

    test('black color from invalid string', () => {
        const color = Color.fromRGBString('This is a nonsense string');
        expect(color.data).toEqual([0, 0, 0]);
    });
});

describe('fromHex', () => {
    test('expect black color with hash', () => {
        let color = Color.fromHex('#000000');
        expect(color.data).toEqual([0, 0, 0]);
    });
    test('expect white color', () => {
        let color = Color.fromHex('#FFFFFF');
        expect(color.data).toEqual([255, 255, 255]);
    });

    test('expect color with hash', () => {
        let color = Color.fromHex('#00FF00');
        expect(color.data).toEqual([0, 255, 0]);
    });
    test('expect color without hash', () => {
        let color = Color.fromHex('00FF00');
        expect(color.data).toEqual([0, 255, 0]);
    });

    test('expect invalid hex code to be black', () => {
        let color = Color.fromHex('#');
        expect(color.data).toEqual([0, 0, 0]);
    });
    test('expect invalid hex code to be black', () => {
        let color = Color.fromHex('#GGGGGG');
        expect(color.data).toEqual([0, 0, 0]);
    });
    test('expect invalid too long hex code to be valid', () => {
        let color = Color.fromHex('#123456aBcDeF');
        expect(color.data).toEqual([171, 205, 239]);
    });

    test('expect too short hex code to be valid', () => {
        let color = Color.fromHex('#A1B3');
        expect(color.data).toEqual([0, 161, 179]);
    });
    test('expect too short hex code to be valid', () => {
        let color = Color.fromHex('#A');
        expect(color.data).toEqual([0, 0, 10]);
    });
});

describe('fromWeb', () => {
    beforeEach(() => {
        // NOTE: JSDOM (the environment used by Jest for simulating the browser) does not fully support 
        // CSS color parsing like a real browser. Specifically, JSDOM does not convert named web 
        // colors (like 'cornflowerblue') into their corresponding RGB values.
        //
        // To properly test color conversion logic in our 'fromWeb' function, we mock 
        // 'window.getComputedStyle' to return an expected RGB value when a valid web color is passed.
        // This ensures our tests pass by simulating the behavior of a real browser.
        window.getComputedStyle = jest.fn((element) => ({
            color: element.style.color === 'cornflowerblue' ? 'rgb(100, 149, 237)' : ''
        }));
    });

    test('expect valid strings to return data in the 0-255 range for RGB', () => {
        expect(Color.fromWeb('cornflowerblue').data).toEqual([100, 149, 237]);
        expect(Color.fromWeb('CornflowerBlue').data).toEqual([100, 149, 237]);
    });

    test('expect invalid strings color data to be [0, 0, 0]', () => {
        expect(Color.fromWeb('error').data).toEqual([0, 0, 0]);
        expect(Color.fromWeb('invalid').data).toEqual([0, 0, 0]);
        expect(Color.fromWeb('').data).toEqual([0, 0, 0]);
    });
});

describe('toRgb', () => {
    test('expect lower range to be "0.00, 0.00, 0.00"', () => {
        const a = Color.fromRGB(0, 0, 0).toRgb();
        const b = Color.fromRGB255(0, 0, 0).toRgb();
        const c = Color.fromHex("#000000").toRgb();
        const expected = "0.00, 0.00, 0.00";

        expect(a).toEqual(expected);
        expect(b).toEqual(expected);
        expect(c).toEqual(expected);
    });
    test('expect mid range to be "0.50, 0.50, 0.50"', () => {
        const a = Color.fromRGB(.5, .5, .5).toRgb();
        const b = Color.fromRGB255(127, 127, 127).toRgb();
        const c = Color.fromHex("#7F7F7F").toRgb();
        const expected = "0.50, 0.50, 0.50";

        expect(a).toEqual(expected);
        expect(b).toEqual(expected);
        expect(c).toEqual(expected);
    });
    test('expect upper range to be "1.00, 1.00, 1.00"', () => {
        const a = Color.fromRGB(1, 1, 1).toRgb();
        const b = Color.fromRGB255(255, 255, 255).toRgb();
        const c = Color.fromHex("#FFFFFF").toRgb();
        const expected = "1.00, 1.00, 1.00";

        expect(a).toEqual(expected);
        expect(b).toEqual(expected);
        expect(c).toEqual(expected);
    });
});

describe('toRgb255', () => {
    test('expect lower range to be "0, 0, 0"', () => {
        const a = Color.fromRGB(0, 0, 0).toRgb255();
        const b = Color.fromRGB255(0, 0, 0).toRgb255();
        const c = Color.fromHex("#000000").toRgb255();
        const expected = "0, 0, 0";

        expect(a).toEqual(expected);
        expect(b).toEqual(expected);
        expect(c).toEqual(expected);
    });
    test('expect mid range to be "127, 127, 127"', () => {
        const a = Color.fromRGB(.5, .5, .5).toRgb255();
        const b = Color.fromRGB255(127, 127, 127).toRgb255();
        const c = Color.fromHex("#7F7F7F").toRgb255();
        const expected = "127, 127, 127";

        expect(a).toEqual(expected);
        expect(b).toEqual(expected);
        expect(c).toEqual(expected);
    });
    test('expect upper range to be "255, 255, 255"', () => {
        const a = Color.fromRGB(1, 1, 1).toRgb255();
        const b = Color.fromRGB255(255, 255, 255).toRgb255();
        const c = Color.fromHex("#FFFFFF").toRgb255();
        const expected = "255, 255, 255";

        expect(a).toEqual(expected);
        expect(b).toEqual(expected);
        expect(c).toEqual(expected);
    });
});

describe('toHex', () => {
    test('expect lower range to be #000000', () => {
        const a = Color.fromRGB(0, 0, 0).toHex();
        const b = Color.fromRGB255(0, 0, 0).toHex();
        const c = Color.fromHex("#000000").toHex();
        const expected = "#000000";

        expect(a).toEqual(expected);
        expect(b).toEqual(expected);
        expect(c).toEqual(expected);
    });
    test('expect mid range to be #7F7F7F', () => {
        const a = Color.fromRGB(0.5, 0.5, 0.5).toHex();
        const b = Color.fromRGB255(127, 127, 127).toHex();
        const c = Color.fromHex("#7F7F7F").toHex();
        const expected = "#7F7F7F";

        expect(a).toEqual(expected);
        expect(b).toEqual(expected);
        expect(c).toEqual(expected);
    });
    test('expect upper range to be #FFFFFF', () => {
        const a = Color.fromRGB(1, 1, 1).toHex();
        const b = Color.fromRGB255(255, 255, 255).toHex();
        const c = Color.fromHex("#FFFFFF").toHex();
        const expected = "#FFFFFF";

        expect(a).toEqual(expected);
        expect(b).toEqual(expected);
        expect(c).toEqual(expected);
    });
});