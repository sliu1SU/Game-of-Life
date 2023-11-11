/*
    Homework 3
    Note: extra credit included
    when user changes grid dimension, the existing game board will be destroyed and a new
    game board will be generated based on the width and height user specifies. This is
    allowed according to Prof S.
 */

// define some useful variables
let row = 0;
let col = 0;
let gameRun = false;
let task;
//"http://localhost:3000/?width=2&height=2"

// this function extract the width and height in the url query
function getURLParameter()
{
    const queryString = new URLSearchParams(window.location.search);
    row = Number(queryString.get("width"));
    col = Number(queryString.get("height"));
}

// this fn is for extra credit, update the url with new w and h input
function updateUrlParam() {
    const queryString = new URLSearchParams(window.location.search);
    queryString.set('width', col);
    queryString.set('height', row);
    const newUrl = window.location.pathname + '?' + queryString;
    //window.location.replace(newUrl); // this will redirect to the new url
    //window.history.pushState({}, '', newUrl); // this adds an entry to browser's history
    // replace the current entry in the browser's history, without reloading
    window.history.replaceState({}, '', newUrl);
}

// this function handles grid dimesion change, either add or delete cells in the
// existing table
function changeGridDimension() {
    if (gameRun) {
        // do not allow grid change when game is running
        return;
    }
    let newRow = document.querySelector('#width-input').value;
    let newCol = document.querySelector('#height-input').value;
    if (newRow < 1 || newCol < 1) {
        document.querySelector('#error-msg').innerHTML = 'you screw up!';
        return;
    } else {
        document.querySelector('#error-msg').innerHTML = '';
    }
    row = newRow;
    col = newCol;
    const e = document.querySelector('table');
    // clear the entire table
    e.innerHTML = "";
    generateGrid();
    updateUrlParam();
}

// this function handle changing color on a cell
function changeCellColor(cell) {
    console.log(cell.getAttribute('id'), 'changing color')
    if (cell.style.background === 'white') {
        cell.style.background = 'black';
    } else {
        cell.style.background = 'white';
    }
}

// generate a 2d table as game board
// initialize onclick event handler for every cell in the grid
function generateGrid() {
    const table = document.querySelector("#grid");
    for (let i = 0; i < row; i++) {
        const thisRow = document.createElement("tr");
        thisRow.setAttribute('id', String(i));
        for (let j = 0; j < col; j++) {
            const thisCol = document.createElement('td');
            // give each td an id (cord)
            thisCol.setAttribute("id", i + "," + j);
            // give this cell white color by default - dead
            thisCol.style.background = 'white';
            // attach onlick event during td creation
            thisCol.onclick = function(clickEvent) {
                if (!gameRun) {
                    changeCellColor(thisCol);
                }
            }
            thisRow.appendChild(thisCol);
        }
        table.appendChild(thisRow);
    }
    // hide pause button
    document.querySelector('#pause-bt').style.display = 'none';
}

// check the surrounding of a cell, return the # of alive neighboring cells
function checkCellSurrounding(id) {
    const indexArray = id.split(',');
    const i = Number(indexArray[0]);
    const j = Number(indexArray[1]);
    let alive = 0;
    // check all 8 direction and count alive neighbor cells
    for (let r = i - 1; r <= i + 1; r++) {
        for (let c = j - 1; c <= j + 1; c++) {
            if (r === i && c === j) {
                // this is the cell itself
                continue;
            }
            if (r >= 0 && r < row && c >= 0 && c < col) {
                // make sure this cell is within bound
                const cell = document.getElementById(String(r) + ',' + String(c));
                if (cell.style.background === 'black') {
                    alive++;
                }
            }
        }
    }
    return alive;
}

// start the game and start the interval
function startGame() {
    // hide start bt when game is running, unhide pause bt, hide width and height input box
    document.querySelector('#pause-bt').style.display = 'block';
    document.querySelector('#start-bt').style.display = 'none';
    document.querySelector('#game-board-dimension').style.display = 'none';
    // start running the game...
    gameRun = true;
    // this fn is here to update game state every 1s
    task = setInterval(() => {
        const cells = document.querySelectorAll('td');
        // use a js object to hold all the cells that need to be change
        let map = [];
        for (let i = 0; i < cells.length; i++) {
            // check all 8 directions for of each cell
            const alive = checkCellSurrounding(cells[i].getAttribute('id'));
            if (cells[i].style.background === 'black' && (alive < 2 || alive > 3)) {
                // become dead
                map.push(cells[i]);
            } else if (cells[i].style.background === 'white' && alive === 3) {
                // this cell revives
                map.push(cells[i]);
            }
        }
        // now we update cells that need to be updated (in the map)
        for (let i = 0; i < map.length; i++) {
            changeCellColor(map[i]);
        }
        console.log('map:', map)
    }, 1000)
}

// pause the game and delete the interval task
function pauseGame() {
    // hide pause bt when game is paused, unhide start bt, unhide width and height input box
    document.querySelector('#pause-bt').style.display = 'none';
    document.querySelector('#start-bt').style.display = 'block';
    document.querySelector('#game-board-dimension').style.display = 'block';
    gameRun = false;
    clearInterval(task);
}

getURLParameter();
generateGrid();