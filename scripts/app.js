const rows = 10;


const columns = 6;
const numItems = 25;


const gridContainer = document.querySelector('.grid-container');
const contextMenu = document.getElementById('context-menu');
let currentGridItem = null;



// DEBUG
document.addEventListener('keydown', function(event) {
    if (event.key === 'd' || event.key === 'D') {
        document.body.classList.toggle('show-borders');
    }
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