import Color from '../color.js';

describe('color construction', () => {
    test('succesful construction', () => {
        let color = new Color(255, 0, 0);
        expect(color.data).toEqual([255, 0, 0]);

        color = new Color(255, 300, 0);
        expect(color.data).toEqual([255, 255, 0]);
    });
});