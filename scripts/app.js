import html2canvas from '../node_modules/html2canvas/dist/html2canvas.esm.js';

import showPopup from './popup.js';
import { Color } from './color.js';
import { CodexData, defaultOptions } from './codex-data.js';

import { isInRange, isValidRgb, isValidRgb255, isValidHex, isValidWeb }  from './validation.js';

const currentOptions = {
    columnCount: defaultOptions.columnCount,
    cellCount: defaultOptions.cellCount,
    gapSize: defaultOptions.gapSize,
    borderRadius: defaultOptions.borderRadius,
    cellSize: defaultOptions.cellSize
};

const styles = getComputedStyle(document.body);
const defaultCellColor = Color.fromHex(styles.getPropertyValue('--color-cell-default'));
const themeColor = Color.fromHex(styles.getPropertyValue('--color-theme'));

const popup = document.getElementById('popup');

const modal = document.getElementById('modal');
const modalCloseButton = document.getElementById('modal-close-button');
const modalRestoreButton = document.getElementById('modal-restore-button');
const modalTextArea = document.getElementById('modal-text-area');

const gridContainer = document.querySelector('.grid-container');

const contextMenuLeft = document.getElementById('context-menu-left');
const contextMenuRight = document.getElementById('context-menu-right');

const restoreDefaultsButton = document.getElementById('restore-defaults-button');
const resetButton = document.getElementById('reset-button');
const saveButton = document.getElementById('save-button');
const copyCodexButton = document.getElementById('copy-codex-button');
const restoreCodexButton = document.getElementById('restore-codex-button');

const codexTextData = document.getElementById('codex-text-data');


let currentGridItem = null;
let currentColor = null;

let lastMouseX = 0;
let lastMouseY = 0;



// DEBUG
document.addEventListener('keydown', function(event) {
    if (event.key === 'd' || event.key === 'D') {
        document.body.classList.toggle('show-borders');
    }
});



// #region Options

function initOptions() {
    document.getElementById('size-column-input').value = defaultOptions.columnCount;
    document.getElementById('cell-count-input').value = defaultOptions.cellCount;
    document.getElementById('cell-gap-input').value = defaultOptions.gapSize;
    document.getElementById('cell-size-input').value = defaultOptions.cellSize;
    document.getElementById('cell-border-radius-input').value = defaultOptions.borderRadius;

    setGridContainerWidth(defaultOptions.columnCount);
    createCells(defaultOptions.cellCount);
    setCellSize(defaultOptions.cellSize);
    setGapSize(defaultOptions.defaultGapSize);
    setBorderRadius(defaultOptions.borderRadius);
}

// Set the max amount of columnCount, everything else will be added below
// e.g. gridWidth = 'auto auto auto auto auto auto' <- 6 columnCount
function setGridContainerWidth(value) {
    const width = Array(value).fill("auto").join(" ");
    gridContainer.style.gridTemplateColumns = width;
}

function setGapSize(value) {
    gridContainer.style.gap = `${value}px`;
}

function setCellSize(value) {
    let cells = document.querySelectorAll('.grid-item');
    
    cells.forEach(item => {
        item.style.width = `${value}px`;
        item.style.height = `${value}px`;
    });
}

function setBorderRadius(value) {
    let cells = document.querySelectorAll('.grid-item');
    
    cells.forEach(item => {
        item.style.borderRadius = `${value}px`;
    });
}

// Options settings changed
document.querySelectorAll('.option-input input').forEach(input => {
    input.addEventListener('input', function(event) {
        processOptions(input);
    });

    // input.addEventListener('keydown', function(event) {
    //     if (event.key === 'Enter') {
    //         processOptions(input);
    //     }
    // });
});

function processOptions(input) {
    let isValidInput = false;
    const value = parseInt(input.value);

    switch (input.id) {
        case "size-column-input":
            if(!isNaN(value) && isInRange(value, 1, 64)) {
                currentOptions.columnCount = value;

                setGridContainerWidth(currentOptions.columnCount);
                isValidInput = true;
            }

            break;

        case "cell-count-input": 
            if(!isNaN(value) && isInRange(value, 1, 100)) {
                currentOptions.cellCount = value;

                createCells(currentOptions.cellCount);
                setCellSize(currentOptions.cellSize);
                setBorderRadius(currentOptions.borderRadius);
                isValidInput = true;
            }

            break;

        case "cell-size-input":
            if(!isNaN(value) && isInRange(value, 1, 250)) {
                currentOptions.cellSize = value;

                setCellSize(currentOptions.cellSize);
                isValidInput = true;
            }

            break;

        case "cell-gap-input":
            if(!isNaN(value) && isInRange(value, 0, 64)) {
                currentOptions.gapSize = value;

                setGapSize(currentOptions.gapSize);
                isValidInput = true;
            }

            break;

        case "cell-border-radius-input":
            if(!isNaN(value) && isInRange(value, 0, 100)) {
                currentOptions.borderRadius = value;

                setBorderRadius(currentOptions.borderRadius);
                isValidInput = true;
            }

            break;

        default:
            break;
    }       

    if(isValidInput) {
        input.classList.add('input-valid');    
        input.classList.remove('input-invalid');    
        updateDataTextBox();
    }
    else {
        currentGridItem = null;

        input.classList.add('input-invalid');    
        input.classList.remove('input-valid');  
    }
}

// #endregion

// #region Actions

restoreDefaultsButton.addEventListener("click", function() {
    initOptions();
});

resetButton.addEventListener("click", function() {
    const cells = document.getElementsByClassName('grid-item');

    for(let cell of cells) {
        cell.style.backgroundColor = defaultCellColor;
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

    modal.style.visibility = "visible";
}

modalCloseButton.addEventListener("click", function() {
    modal.style.visibility = "hidden";
});

modalTextArea.addEventListener("input", function() {
    const cd = CodexData.fromLines(modalTextArea.value.split('\n'));

    if(cd !== null) {
        this.classList.remove('input-invalid');  
        modalRestoreButton.disabled = false;
    }
    else {
        this.classList.add('input-invalid');   
        modalRestoreButton.disabled = true; 
    }
});
// #endregion



// Dynamically create grid items
// Multiple event listeners
// - Left click - open input color menu
// - right click - open copy color menu
// - CTRL + C - open copy color menu
// - Mouse move to store the position of where to open the context menus
// - Mouse enter / leave to focus / lose focus
function createCells(cellCount) {
    gridContainer.innerHTML = '';  // This removes all child elements
    setGapSize(currentOptions.gapSize);

    for (let i = 0; i < cellCount; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.style.backgroundColor = defaultCellColor.toHex();

        // Make the div focusable
        gridItem.setAttribute('tabindex', '0');

        // Left click
        gridItem.addEventListener('click', function(e) {
            lastMouseX = e.pageX;
            lastMouseY = e.pageY;

            showInputContextMenu(lastMouseX, lastMouseY);

            // Stop event propagation to prevent the global click listener from hiding the context menu
            e.stopPropagation();
        }, false);

        // Right click
        gridItem.addEventListener('contextmenu', function(e) {
            e.preventDefault();

            lastMouseX = e.pageX;
            lastMouseY = e.pageY;

            showCopyContextMenu(lastMouseX, lastMouseY);

            e.stopPropagation();
        }, false);

        // Track mouse position on mousemove
        gridItem.addEventListener('mousemove', function(event) {
            lastMouseX = event.pageX;
            lastMouseY = event.pageY;
        });

        // Need to set the focus on the div in order to listen for keypresses
        gridItem.addEventListener('mouseenter', function() {
            currentGridItem = gridItem; 
            gridItem.focus();
        });

        // Remove focus
        gridItem.addEventListener('mouseleave', function() {
            gridItem.blur(); 
        });

        // CTRL + C
        gridItem.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
                showCopyContextMenu(lastMouseX, lastMouseY);
            }
        }, false);

        gridContainer.appendChild(gridItem);
    }
}

function changeGridItemColor(input) {
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
        currentGridItem.style.backgroundColor = color.toHex();
        updateDataTextBox();

        input.classList.add('input-valid');    
        input.classList.remove('input-invalid');  
    }
}

// #region Context Menu

function showInputContextMenu(x, y) {
    contextMenuLeft.style.display = 'block';
    contextMenuRight.style.display = 'none';
    contextMenuLeft.style.left = `${x}px`;
    contextMenuLeft.style.top = `${y}px`;
}

function showCopyContextMenu(x, y) {
    contextMenuRight.style.display = 'block';
    contextMenuLeft.style.display = 'none';
    contextMenuRight.style.left = `${x}px`;
    contextMenuRight.style.top = `${y}px`;

    let rgbValues = currentGridItem.style.backgroundColor.match(/\d+/g).map(Number);
    currentColor = Color.fromRGB255(...rgbValues);

    document.getElementById('color-copy-rgb').querySelector('p').innerHTML = currentColor.toRgb();
    document.getElementById('color-copy-rgb255').querySelector('p').innerHTML = currentColor.toRgb255();
    document.getElementById('color-copy-hex').querySelector('p').innerHTML = currentColor.toHex();
}

function closeContextMenus() {
    contextMenuLeft.style.display = 'none';
    contextMenuRight.style.display = 'none';
}

// #endregion






//  Change color by enter or input validation
document.querySelectorAll('.color-input input').forEach(input => {
    input.addEventListener('input', function(event) {
        changeGridItemColor(input);
    });

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            changeGridItemColor(input);
        }
    });
});

document.querySelectorAll('.color-copy-container').forEach(function(colorCopyContainer) {
    colorCopyContainer.addEventListener('click', function() {

        if (currentGridItem) {
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
            contextMenuRight.style.display = 'none';
            
            showPopup("Color Copied", copyString, currentColor); 
        }
    });
});

// Hide both context menus when the click target is not within either context menu
document.addEventListener('click', function(e) {
    if (!contextMenuLeft.contains(e.target) && !contextMenuRight.contains(e.target)) {
        closeContextMenus();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeContextMenus();
    }
});



function updateDataTextBox() {
    codexTextData.value = "// Options\n";
    codexTextData.value += `columnCount: ${currentOptions.columnCount}\n`;
    codexTextData.value += `cellCount: ${currentOptions.cellCount}\n`;
    codexTextData.value += `cellSize: ${currentOptions.cellSize}\n`;
    codexTextData.value += `gapSize: ${currentOptions.gapSize}\n`;
    codexTextData.value += `borderRadius: ${currentOptions.borderRadius}\n`;

    codexTextData.value += "\n// Colors\n";

    let cells = document.querySelectorAll('.grid-item');
    
    cells.forEach(item => {
        const c = Color.fromRGBString(item.style.backgroundColor);
        codexTextData.value += `color: ${c.toHex()}\n`;
    });
};


initOptions();
updateDataTextBox();