import html2canvas from '../node_modules/html2canvas/dist/html2canvas.esm.js';

 
const rows = 10;


const columns = 10;
const numItems = 80;

const styles = getComputedStyle(document.body);

const gridContainer = document.querySelector('.grid-container');
const contextMenu = document.getElementById('context-menu');
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
const gridWidth = Array(columns).fill("auto").join(" ");
gridContainer.style.gridTemplateColumns = gridWidth;






// Dynamically create grid items
function createCells() {
    for (let i = 0; i < numItems; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        gridContainer.appendChild(gridItem);
    }
}


 

















createCells();