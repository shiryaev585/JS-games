const gameField = document.querySelector('.game-field');
const startBtn = document.querySelector('.start-btn');
const clickModeBtn = document.querySelector('.click-mode');
const hoverModeBtn = document.querySelector('.hover-mode');
const generationsCountElem = document.querySelector('.generations-count');
const size = 50;
const generationDuration = 100;
let elements = [];
let cells = [];
let generationsCount = 1;
let isGame;
let interval;

const createArray = (arr) => {
    arr.push(new Array(size).fill(0));
};

const createWorld = () => {
    for (let y = 0; y < size; y++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.dataset.y = y;
        const rowElements = [];
        createArray(cells);
        elements.push(rowElements);
        gameField.appendChild(row);
        
        for (let x = 0; x < size; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            rowElements.push(cell);
            row.appendChild(cell);
        }
    }
};

const getNeighbours = (x, y) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const coordX = (x + j + size) % size;
            const coordY = (y + i + size) % size;
            count = count + cells[coordY][coordX];
        }
    }
    return count - cells[y][x];
};

const renderCells = () => {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            cells[y][x] === 1
                ? elements[y][x].classList.add('alive')
                : elements[y][x].classList.remove('alive');
        }
    }
};

const ressetWorld = () => {
    const evolvedCells = [];
    for (let i = 0; i < size; i++) {
        createArray(evolvedCells);
    }
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const neighbours = getNeighbours(x, y);
            if (cells[y][x] === 0 && neighbours === 3) {
                evolvedCells[y][x] = 1;
            }
            if (cells[y][x] === 1 && (neighbours === 2 || neighbours === 3)) {
                evolvedCells[y][x] = 1;
            }
        }
    }
    cells = evolvedCells;
    renderCells();
    generationsCount++;
    generationsCountElem.innerText = `Generation: ${generationsCount}`;
};

const setLifeOnMouseEvents = function (event) {
    const x = event.target.getAttribute('data-x');
    const y = event.target.getAttribute('data-y');

    if (event.target.closest('.cell')) {
        event.target.classList.add('alive');
    }
    cells[y][x] = 1;
};

const classHandler = (activeElement, disabledElement) => {
    disabledElement.classList.remove('is-active');
    activeElement.classList.add('is-active');
};

gameField.style.width = `${size * 10}px`;
createWorld();
renderCells();
gameField.addEventListener('click', setLifeOnMouseEvents);

clickModeBtn.addEventListener('click', () => {
    gameField.addEventListener('click', setLifeOnMouseEvents);
    gameField.removeEventListener('mouseover', setLifeOnMouseEvents);
    classHandler(clickModeBtn, hoverModeBtn);
});

hoverModeBtn.addEventListener('click', () => {
    gameField.addEventListener('mouseover', setLifeOnMouseEvents);
    gameField.removeEventListener('click', setLifeOnMouseEvents);
    classHandler(hoverModeBtn, clickModeBtn);
});

startBtn.addEventListener('click', () => {
    !isGame ? isGame = true : isGame = false;
    startBtn.classList.toggle('on-pause');
    startBtn.classList.toggle('on-play');
    isGame ? interval = setInterval(ressetWorld, generationDuration) : clearInterval(interval);
});
