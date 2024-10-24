import { CodexData } from '../codex-data.js';

const fs = require('fs');
const path = require('path');

const TEST_CODICES_FOLDER = path.join(__dirname, './codices');

/**
 * Reads a file and splits it into a string array on a newline. Each line is trimmed to remove any whitespace characters (e.g., /r or spaces).
 *
 * @param {string} filePath - The path to the file.
 * @returns {string[]} - Returns a string array of the split and trimmed file contents.
 */
const readFileAsArray = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\n').map(line => line.trim());
};

describe('codex loading from lines', () => {
    test('returns false for an empty text file', () => {
        const fileContent = readFileAsArray(path.join(TEST_CODICES_FOLDER, 'invalid-empty.txt'));
        const cd = CodexData.fromLines(fileContent);

        expect(cd.isValid).toBe(false);
    });
});