# Color Codex (Work-in-progress)

- **Technologies Used**<br/>
JavaScript, CSS, HTML, Node.js

- **NPM Packages Used**<br/>
[html2canvas](https://www.npmjs.com/package/html2canvas) (for saving the codex)

- **Dev Dependencies**<br/>
[Jest](https://www.npmjs.com/package/jest) (for testing)
[Babel](https://babeljs.io/) (for transforming JavaScript code)
[jest-environment-jsdom](https://www.npmjs.com/package/jest-environment-jsdom) (to simulate a DOM environment for testing browser-related code)

## About

Color Codex is a web-based tool designed to help you create custom color maps effortlessly.

## Screenshots
![screen-1](https://github.com/CraigMason19/Color-Codex/blob/master/screenshots/screen-1.png)

### Features

- **User-Friendly Interface**<br/>
Easily generate a 2D grid of color swatches that can be referenced in various projects to maintain color consistency. For example, texture / color atlases for use in games, a colour pallete for art programs like Blender, etc.

- **Export Options**<br/>
Export your color maps as PNG files for use in other applications.

- **Color Code Access**<br/>
Quickly retrieve HEX codes and RGB values (in both the 0-255 and 0.0-1.0 ranges) for each color.

## Installation
Run the following command to install all required dependencies, including html2canvas:
```
npm install
```

## Running Tests
To run the test suite, use the following command:
```
npm test
```
This will run the tests using the JSDOM environment, which simulates a browser for testing web-based code, and generate a coverage report.