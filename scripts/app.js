import html2canvas from '../node_modules/html2canvas/dist/html2canvas.esm.js';
import showPopup from './popup.js';


const columns = 10;
const numItems = 80;

const styles = getComputedStyle(document.body);

const gridContainer = document.querySelector('.grid-container');

const contextMenuLeft = document.getElementById('context-menu-left');
const contextMenuRight = document.getElementById('context-menu-right');

const popup = document.getElementById('popup');


let currentGridItem = null;

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

            // Stop event propagation to prevent the global click listener from hiding the context menu
            e.stopPropagation();
        }, false);

        gridContainer.appendChild(gridItem);
    }
}


document.querySelectorAll('.color-input input').forEach(input => {
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {


            let error = false;
            if(error) {
                input.classList.add('input-invalid');    
                input.classList.remove('input-valid');                
            }
            else {
                input.classList.add('input-valid');    
                input.classList.remove('input-invalid');  
                
                switch (input.id) {
                    // case "rgba-input":
                    //     break;

                    case "rgb255-input":
                        currentGridItem.style.backgroundColor = `rgb${input.value.trim()}`;
                        break;

                    case "hex-input":
                        currentGridItem.style.backgroundColor = `${input.value.trim()}`;
                        break;

                    default:
                        break;
                }       
            }

            // showPopup("foo", "bar");
        }
    });
});


// Attach click event listeners to each <p> element inside color-details
document.querySelectorAll('.color-details p').forEach(function(colorOption) {
    colorOption.addEventListener('click', function() {
        const colorValue = this.textContent;


        if (currentGridItem) {
            popup.style.backgroundColor = currentGridItem.style.backgroundColor;
            showPopup("Color Copied", `${currentGridItem.style.backgroundColor}`);
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