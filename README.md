# Color Codex (Work-in-progress)

- **Technologies Used**<br/>
JavaScript, CSS, HTML, Node.js

- **NPM Packages Used**<br/>
    - [html2canvas](https://www.npmjs.com/package/html2canvas) (for saving the codex as a image)

- **Dev Dependencies**<br/>
    - [Jest](https://www.npmjs.com/package/jest) (for testing)<br/>
    - [Babel](https://babeljs.io/) (for enabling modern JavaScript features like `import`/`export` in the testing environment)<br/>
    - [jest-environment-jsdom](https://www.npmjs.com/package/jest-environment-jsdom) (to simulate a DOM environment for testing browser-related code)<br/>

## About

Color Codex is a web-based tool designed to help you create custom color maps effortlessly.

## Screenshots
![screenshot-01](https://github.com/CraigMason19/Color-Codex/blob/master/screenshots/screenshot-01.png)

### Features

- **User-Friendly Interface**<br/>
Easily generate a 2D grid of color swatches that can be referenced in various projects to maintain color consistency. For example, texture / color atlases for use in games, a colour pallete for art programs like Blender, etc.

- **Export Options**<br/>
Export your color maps as PNG files for use in other applications.

- **Color Code Access**<br/>
Quickly retrieve HEX codes and RGB values (in both the 0-255 and 0.0-1.0 ranges) for each color.

### Controls
- **Context Menus**<br/>
    - **Input Menu**: **`Left-click`** on a grid item to open a context menu that allows you to enter colors in various formats. If the input is invalid, it will highlight in red.  
    **Note**: The color picker uses the HTML **`<input type="color">`** element, which includes an eyedropper tool. This tool may not function in some browsers if the EyeDropper API is unsupported.
      
    - **Copy Menu**: **`Right-click`** or press **`CTRL + C`** over a grid item to open the copy menu. **`Left-click`** in the menu to copy the relevant data to the clipboard.

    - **Closing Menus**: Press **`ESC`** or **`Click`** outside the context menu to close it.

## Installation
Run the following command to install all required dependencies:
```
npm install
```

## Running Tests
To run the test suite, use the following command:
```
npm test
```
This will run the tests using the JSDOM environment and generate a coverage report.
