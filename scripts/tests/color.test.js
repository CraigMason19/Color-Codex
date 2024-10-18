import Color from '../color.js';

// TODO - constructor tests

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


// TODO - test web color, but that uses dom HTML elements



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