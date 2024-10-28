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

describe('invalid CodexData creation', () => {
    test('returns null for an empty text file', () => {
        const fileContent = readFileAsArray(path.join(TEST_CODICES_FOLDER, 'invalid-empty.txt'));
        const cd = CodexData.fromLines(fileContent);

        expect(cd).toBeNull();
    });

    test('returns null for a unrelated text file', () => {
        const fileContent = readFileAsArray(path.join(TEST_CODICES_FOLDER, 'invalid-dummy-text.txt'));
        const cd = CodexData.fromLines(fileContent);

        expect(cd).toBeNull();
    });

    test('returns null for option value not a number', () => {
        const fileContent = readFileAsArray(path.join(TEST_CODICES_FOLDER, 'invalid-key-NaN.txt'));
        const cd = CodexData.fromLines(fileContent);

        expect(cd).toBeNull();
    });

    test('returns null for option value not a number', () => {
        const fileContent = readFileAsArray(path.join(TEST_CODICES_FOLDER, 'invalid-too-few-colors.txt'));
        const cd = CodexData.fromLines(fileContent);

        expect(cd).toBeNull();
    });
});

describe('Valid CodexData creation', () => {
    test('returns a CodexData object for all options and colours', () => {
        const fileContent = readFileAsArray(path.join(TEST_CODICES_FOLDER, 'valid-all-keys-and-colors.txt'));
        const cd = CodexData.fromLines(fileContent);

        expect(cd).not.toBeNull();
    });

    test('returns a CodexData object for all options with no colours', () => {
        const fileContent = readFileAsArray(path.join(TEST_CODICES_FOLDER, 'valid-all-keys-no-colors.txt'));
        const cd = CodexData.fromLines(fileContent);

        expect(cd).not.toBeNull();
    });
});