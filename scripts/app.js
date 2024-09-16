import html2canvas from '../node_modules/html2canvas/dist/html2canvas.esm.js';

import showPopup from './popup.js';
import Color from './color.js';
import { isValidRgb, isValidRgb255, isValidHex, isValidWeb }  from './validation.js';

const columns = 10;
const numItems = 80;

const styles = getComputedStyle(document.body);

const gridContainer = document.querySelector('.grid-container');

const contextMenuLeft = document.getElementById('context-menu-left');
const contextMenuRight = document.getElementById('context-menu-right');

const resetButton = document.getElementById('reset-button');
const saveButton = document.getElementById('save-button');

const popup = document.getElementById('popup');


let currentGridItem = null;
let currentColor = null;

let lastMouseX = 0;
let lastMouseY = 0;


function inRange(value, min, max) {
    return value >= min && value <= max;
}


document.getElementById('size-column-input').value = columns;


// DEBUG
document.addEventListener('keydown', function(event) {
    if (event.key === 'd' || event.key === 'D') {
        document.body.classList.toggle('show-borders');
    }
});


resetButton.addEventListener("click", function() {
    const cells = document.getElementsByClassName('grid-item');

    for(let cell of cells) {
        cell.style.backgroundColor = styles.getPropertyValue('--color-cell-default');
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




// Set the max amount of columns, everything else will be added below
// e.g. gridWidth = 'auto auto auto auto auto auto' <- 6 columns
function setGridContainerWidth(value) {
    const width = Array(value).fill("auto").join(" ");
    gridContainer.style.gridTemplateColumns = width;

    console.log(value, width);
}




// Dynamically create grid items
// Multiple event listeners
// - Left click - open input color menu
// - right click - open copy color menu
// - CTRL + C - open copy color menu
// - Mouse move to store the position of where to open the context menus
// - Mouse enter / leave to focus / lose focus
function createCells() {
    for (let i = 0; i < numItems; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

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

        input.classList.add('input-valid');    
        input.classList.remove('input-invalid');  
    }
}

function processOptions(input) {
    let isValidInput = false;
    const value = parseInt(input.value);

    switch (input.id) {
        case "size-column-input":
            // input.setAttribute('title', 'Values must be in the 1 - 64 range');

            if(!isNaN(value) && inRange(value, 1, 64)) {
                setGridContainerWidth(value);
                isValidInput = true;
            }

            break;



        default:
            break;
    }       

    if(isValidInput) {
        input.classList.add('input-valid');    
        input.classList.remove('input-invalid');              
    }
    else {
        currentGridItem = null;

        input.classList.add('input-invalid');    
        input.classList.remove('input-valid');  
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




// Options settings changed
document.querySelectorAll('.option-input input').forEach(input => {
    input.addEventListener('input', function(event) {
        processOptions(input);
    });

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            processOptions(input);
        }
    });
});









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
            
            popup.style.backgroundColor = currentColor.toRgb255();
            showPopup("Color Copied", copyString); 
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

setGridContainerWidth(columns);
createCells();