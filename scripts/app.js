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

const popup = document.getElementById('popup');


let currentGridItem = null;
let currentColor = null;


const resetButton = document.getElementById('reset-button');
const saveButton = document.getElementById('save-button');




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
// e.g. gridWisth = 'auto auto auto auto auto auto' <- 6 columns
const gridWidth = Array(columns).fill("auto").join(" ");
gridContainer.style.gridTemplateColumns = gridWidth;






// Dynamically create grid items
function createCells() {
    for (let i = 0; i < numItems; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        // Left click
        gridItem.addEventListener('click', function(e) {
            e.preventDefault();

            currentGridItem = gridItem; 

            contextMenuLeft.style.display = 'block';
            contextMenuRight.style.display = 'none';
            contextMenuLeft.style.left = `${e.pageX}px`;
            contextMenuLeft.style.top = `${e.pageY}px`;

            // Stop event propagation to prevent the global click listener from hiding the context menu
            e.stopPropagation();
        }, false);

        // Right click
        gridItem.addEventListener('contextmenu', function(e) {
            e.preventDefault();

            currentGridItem = gridItem; 

            contextMenuRight.style.display = 'block';
            contextMenuLeft.style.display = 'none';
            contextMenuRight.style.left = `${e.pageX}px`;
            contextMenuRight.style.top = `${e.pageY}px`;

            let rgbValues = currentGridItem.style.backgroundColor.match(/\d+/g).map(Number);
            currentColor = Color.fromRGB255(...rgbValues);

            document.getElementById('color-copy-rgb').innerHTML = currentColor.toRgb();
            document.getElementById('color-copy-rgb255').innerHTML = currentColor.toRgb255();
            document.getElementById('color-copy-hex').innerHTML = currentColor.toHex();


            // Stop event propagation to prevent the global click listener from hiding the context menu
            e.stopPropagation();
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

document.querySelectorAll('.color-details p').forEach(function(colorOption) {
    colorOption.addEventListener('click', function() {

        if (currentGridItem) {
            let copyString = null;

            switch (colorOption.id) {
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

// Hide both context menus when clicking outside
document.addEventListener('click', function(e) {
    const contextMenuLeft = document.getElementById('context-menu-left');
    const contextMenuRight = document.getElementById('context-menu-right');

    // If the click target is not within either context menu, hide both
    if (!contextMenuLeft.contains(e.target) && !contextMenuRight.contains(e.target)) {
        contextMenuLeft.style.display = 'none';
        contextMenuRight.style.display = 'none';
    }
});


createCells();