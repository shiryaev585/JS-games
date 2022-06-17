const gameField = document.querySelector('.game-field');
const startBtn = document.querySelector('.btn');
const generationsCountElem = document.querySelector('.generations-count');
const size = 50;
const generationDuration = 100;
let elements = [];
let cells = [];
let generationsCount = 1;
let isGame;
let interval;

const createWorld = () => {
    for (let y = 0; y < size; y++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.dataset.y = y;
        const rowElements = [];
        cells.push(new Array(size).fill(0));
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
        evolvedCells.push(new Array(size).fill(0));
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
}

gameField.style.width = `${size * 10}px`;
createWorld();
renderCells();

gameField.addEventListener('click', ({ target }) => {
    const x = target.getAttribute('data-x');
    const y = target.getAttribute('data-y');

    if (target.closest('.cell')) {
        target.classList.add('alive');
    }
    cells[y][x] = 1;
});

startBtn.addEventListener('click', () => {
    !isGame ? isGame = true : isGame = false;
    startBtn.classList.toggle('on-pause');
    startBtn.classList.toggle('on-play');
    isGame ? interval = setInterval(ressetWorld, generationDuration) : clearInterval(interval);
});

