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
        let color = Color.fromRGB(255, 256, 4000);
        expect(color.data).toEqual([255, 255, 255]);
    });
    test('clamp values out of lower range', () => {
        let color = Color.fromRGB(0, -5, -4000);
        expect(color.data).toEqual([0, 0, 0]);
    });
});