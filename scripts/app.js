import html2canvas from '../node_modules/html2canvas/dist/html2canvas.esm.js';

import { showPopup } from './popup.js';
import { Color } from './color.js';
import { CodexData, minimumOptions, maximumOptions } from './codex-data.js';
import { isInRange, isValidRgb, isValidRgb255, isValidHex, isValidWeb }  from './validation.js';


// Constant element references
const styles = getComputedStyle(document.body);
const defaultCellColor = Color.fromHex(styles.getPropertyValue('--color-cell-default'));
const themeColor = Color.fromHex(styles.getPropertyValue('--color-theme'));

// Side panel elements
const columnInput = document.getElementById('size-column-input');
const cellCountInput = document.getElementById('cell-count-input');
const cellGapInput = document.getElementById('cell-gap-input');
const cellSizeInput = document.getElementById('cell-size-input');
const cellBorderRadiusInput = document.getElementById('cell-border-radius-input');

const restoreDefaultsButton = document.getElementById('restore-defaults-button');
const resetButton = document.getElementById('reset-button');
const saveButton = document.getElementById('save-button');
const copyCodexButton = document.getElementById('copy-codex-button');
const restoreCodexButton = document.getElementById('restore-codex-button');

const codexTextData = document.getElementById('codex-text-data');

// Other elements
const gridContainer = document.getElementById('grid-container');

const modal = document.getElementById('modal');
const modalCloseButton = document.getElementById('modal-close-button');
const modalRestoreButton = document.getElementById('modal-restore-button');
const modalTextArea = document.getElementById('modal-text-area');

const inputContextMenu = document.getElementById('input-context-menu');
const copyContextMenu = document.getElementById('copy-context-menu');

const colorPicker = document.getElementById('color-picker-input');


// Dynamic variables
let currentCell = null;
let currentColor = null;

let lastMouseX = 0;
let lastMouseY = 0;

let codexData = new CodexData();


// #region Options

function initOptions() {
    columnInput.value = codexData.options.columnCount;
    columnInput.title = `Values must be within the ${minimumOptions.columnCount} - ${maximumOptions.columnCount} range`;
    setGridContainerWidth(codexData.options.columnCount);

    cellCountInput.value = codexData.options.cellCount;
    cellCountInput.title = `Values must be within the ${minimumOptions.cellCount} - ${maximumOptions.cellCount} range`;
    createCells(codexData.options.cellCount);

    cellSizeInput.value = codexData.options.cellSize;
    cellSizeInput.title = `Values must be within the ${minimumOptions.cellSize} - ${maximumOptions.cellSize} range`;
    setCellSize(codexData.options.cellSize);

    cellGapInput.value = codexData.options.gapSize;
    cellGapInput.title = `Values must be within the ${minimumOptions.gapSize} - ${maximumOptions.gapSize} range`;
    setGapSize(codexData.options.defaultGapSize);

    cellBorderRadiusInput.value = codexData.options.borderRadius;
    cellBorderRadiusInput.title = `Values must be within the ${minimumOptions.borderRadius} - ${maximumOptions.borderRadius} range`;
    setBorderRadius(codexData.options.borderRadius);

    updateDataTextBox();
}

// Set the max amount of columnCount, everything else will be added below
// e.g. gridWidth = 'auto auto auto auto auto auto' <- 6 columnCount
function setGridContainerWidth(value) {
    const width = Array(value).fill("auto").join(" ");
    gridContainer.style.gridTemplateColumns = width;
}

function setCellSize(value) {
    let cells = document.querySelectorAll('.grid-item');
    
    cells.forEach(cell => {
        cell.style.width = `${value}px`;
        cell.style.height = `${value}px`;
    });
}

function setGapSize(value) {
    gridContainer.style.gap = `${value}px`;
}

function setBorderRadius(value) {
    let cells = document.querySelectorAll('.grid-item');
    
    cells.forEach(cell => {
        cell.style.borderRadius = `${value}px`;
    });
}

// Options settings changed
document.querySelectorAll('.option-input input').forEach(input => {
    input.addEventListener('input', function(event) {
        processOptions(input);
    });
});

function processOptions(input) {
    let isValidInput = false;
    const value = parseInt(input.value);

    switch (input.id) {
        case "size-column-input":
            if(!isNaN(value) && isInRange(value, minimumOptions.columnCount, maximumOptions.columnCount)) {
                codexData.options.columnCount = value;

                setGridContainerWidth(codexData.options.columnCount);
                isValidInput = true;
            }

            break;

        case "cell-count-input": 
            if(!isNaN(value) && isInRange(value, minimumOptions.cellCount, maximumOptions.cellCount)) {
                codexData.options.cellCount = value;

                createCells(codexData.options.cellCount);
                setCellSize(codexData.options.cellSize);
                setBorderRadius(codexData.options.borderRadius);
                isValidInput = true;
            }

            break;

        case "cell-size-input":
            if(!isNaN(value) && isInRange(value, minimumOptions.cellSize, maximumOptions.cellSize)) {
                codexData.options.cellSize = value;

                setCellSize(codexData.options.cellSize);
                isValidInput = true;
            }

            break;

        case "cell-gap-input":
            if(!isNaN(value) && isInRange(value, minimumOptions.gapSize, maximumOptions.gapSize)) {
                codexData.options.gapSize = value;

                setGapSize(codexData.options.gapSize);
                isValidInput = true;
            }

            break;

        case "cell-border-radius-input":
            if(!isNaN(value) && isInRange(value, minimumOptions.borderRadius, maximumOptions.borderRadius)) {
                codexData.options.borderRadius = value;

                setBorderRadius(codexData.options.borderRadius);
                isValidInput = true;
            }

            break;

        default:
            break;
    }       

    if(isValidInput) {
        input.classList.remove('input-invalid');    
        updateDataTextBox();
    }
    else {
        currentCell = null;
        input.classList.add('input-invalid');  
    }
}

// #endregion


// #region Actions

restoreDefaultsButton.addEventListener("click", function() {
    codexData = new CodexData();
    initOptions();
});

resetButton.addEventListener("click", function() {
    for(let cell of document.getElementsByClassName('grid-item')) {
        cell.style.backgroundColor = defaultCellColor.toHex();
    }
});

saveButton.addEventListener("click", function() {
    html2canvas(gridContainer).then(canvas => {
        let link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'codex.png';
        link.click();
    });
});

copyCodexButton.addEventListener("click", function() {
    navigator.clipboard.writeText(codexTextData.value);
    showPopup("Codex Copied", "Keep it safe to rebuild the codex later", themeColor);
});

restoreCodexButton.addEventListener("click", function() {
    initModal();
});

// #endregion


// #region Modal

function initModal() {
    modalRestoreButton.disabled = true;
    modalTextArea.value = "";

    modal.classList.add('show');
}

modalTextArea.addEventListener("input", function() {
    codexData = CodexData.fromLines(modalTextArea.value.split('\n'));

    if(codexData !== null) {
        this.classList.remove('input-invalid');  
        modalRestoreButton.disabled = false;
    }
    else {
        this.classList.add('input-invalid');   
        modalRestoreButton.disabled = true; 
    }
});

modalRestoreButton.addEventListener("click", function() {
    modal.classList.remove('show');

    initOptions();

    // Restore colors
    let cells = document.getElementsByClassName('grid-item');

    for(let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = codexData.colors[i].toHex();
    }
});

modalCloseButton.addEventListener("click", function() {
    modal.classList.remove('show');
});

// #endregion


// #region Context Menu

function showInputContextMenu(x, y) {
    copyContextMenu.style.display = 'none';

    inputContextMenu.style.display = 'block';
    inputContextMenu.style.left = `${x}px`;
    inputContextMenu.style.top = `${y}px`;
}

function showCopyContextMenu(x, y) {
    inputContextMenu.style.display = 'none';

    copyContextMenu.style.display = 'block';
    copyContextMenu.style.left = `${x}px`;
    copyContextMenu.style.top = `${y}px`;

    let rgbValues = currentCell.style.backgroundColor.match(/\d+/g).map(Number);
    currentColor = Color.fromRGB255(...rgbValues);

    document.getElementById('color-copy-rgb').querySelector('p').innerHTML = currentColor.toRgb();
    document.getElementById('color-copy-rgb255').querySelector('p').innerHTML = currentColor.toRgb255();
    document.getElementById('color-copy-hex').querySelector('p').innerHTML = currentColor.toHex();
}

function closeContextMenus() {
    inputContextMenu.style.display = 'none';
    copyContextMenu.style.display = 'none';
}

// Hide both context menus when the click target is not within either context menu
document.addEventListener('click', function(e) {
    if (!inputContextMenu.contains(e.target) && !copyContextMenu.contains(e.target)) {
        closeContextMenus();
    }
});

// Or when ESCAPE key is pressed
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeContextMenus();
    }
});

//  Change color by enter or input validation
document.querySelectorAll('.color-input input').forEach(input => {
    input.addEventListener('input', function(event) {
        changeCellColor(input);
    });

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            changeCellColor(input);
        }
    });
});

colorPicker.addEventListener('input', (event) => {
    currentCell.style.backgroundColor = event.target.value;
});

document.querySelectorAll('.color-copy-container').forEach(function(colorCopyContainer) {
    colorCopyContainer.addEventListener('click', function() {

        if (currentCell) {
            let copyString = null;

            switch (colorCopyContainer.id) {
                case "color-copy-rgb":
                    copyString = currentColor.toRgb();
                    break;

                case "color-copy-rgb255":
                    copyString = currentColor.toRgb255();
                    break;

                case "color-copy-hex":
                    copyString = currentColor.toHex();
                    break;

                default:
                    break;
            } 

            navigator.clipboard.writeText(copyString);
            copyContextMenu.style.display = 'none';
            
            showPopup("Color Copied", copyString, currentColor); 
        }
    });
});

// #endregion


// #region App

// Dynamically create grid items (cells)
function createCells(cellCount) {
    gridContainer.innerHTML = '';  // This removes all child elements
    setGapSize(codexData.options.gapSize);

    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-item');
        cell.style.backgroundColor = defaultCellColor.toHex();

        // Make the div focusable
        cell.setAttribute('tabindex', '0');

        // Left click
        cell.addEventListener('click', function(e) {
            lastMouseX = e.pageX;
            lastMouseY = e.pageY;

            showInputContextMenu(lastMouseX, lastMouseY);

            // Stop event propagation to prevent the global click listener from hiding the context menu
            e.stopPropagation();
        }, false);

        // Right click
        cell.addEventListener('contextmenu', function(e) {
            e.preventDefault();

            lastMouseX = e.pageX;
            lastMouseY = e.pageY;

            showCopyContextMenu(lastMouseX, lastMouseY);

            e.stopPropagation();
        }, false);

        // Track mouse position on mousemove
        cell.addEventListener('mousemove', function(event) {
            lastMouseX = event.pageX;
            lastMouseY = event.pageY;
        });

        // Need to set the focus on the div in order to listen for keypresses
        cell.addEventListener('mouseenter', function() {
            currentCell = cell; 
            cell.focus();
        });

        // Remove focus
        cell.addEventListener('mouseleave', function() {
            cell.blur(); 
        });

        // CTRL + C
        cell.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
                showCopyContextMenu(lastMouseX, lastMouseY);
            }
        }, false);

        gridContainer.appendChild(cell);
    }
}

function changeCellColor(input) {
    let isValidInput = true;
    let color = null;

    switch (input.id) {
        case "rgb-input":
            if(isValidRgb(input.value)) {
                color = Color.fromRGB(...input.value.split(','));
                isValidInput = false;
            }

            break;

        case "rgb255-input":
            if(isValidRgb255(input.value)) {
                color = Color.fromRGB255(...input.value.split(','));
                isValidInput = false;
            }

            break;

        case "hex-input":
            if(isValidHex(input.value)) {
                color = Color.fromHex(input.value);
                isValidInput = false;
            }

            break;

        case "web-input":
            if(isValidWeb(input.value)) {
                color = Color.fromWeb(input.value);
                isValidInput = false;
            }

            break;

        default:
            break;
    }       

    if(isValidInput) {
        input.classList.add('input-invalid');    
        input.classList.remove('input-valid');     
    }
    else {
        currentCell.style.backgroundColor = color.toHex();
        updateDataTextBox();

        input.classList.add('input-valid');    
        input.classList.remove('input-invalid');  
    }
}

function updateDataTextBox() {
    codexTextData.value = "// Options\n";
    codexTextData.value += `columnCount: ${codexData.options.columnCount}\n`;
    codexTextData.value += `cellCount: ${codexData.options.cellCount}\n`;
    codexTextData.value += `cellSize: ${codexData.options.cellSize}\n`;
    codexTextData.value += `gapSize: ${codexData.options.gapSize}\n`;
    codexTextData.value += `borderRadius: ${codexData.options.borderRadius}\n`;

    codexTextData.value += "\n// Colors\n";

    for(let cell of document.querySelectorAll('.grid-item')) {
        const c = Color.fromRGBString(cell.style.backgroundColor);
        codexTextData.value += `color: ${c.toHex()}\n`;    
    }
};

initOptions();

// #endregion