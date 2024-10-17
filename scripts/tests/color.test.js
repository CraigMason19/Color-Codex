import Color from '../color.js';

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