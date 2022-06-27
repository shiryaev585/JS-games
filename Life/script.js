const canvas = document.querySelector('#canvas');
const startBtn = document.querySelector('.start-btn');
const clickModeBtn = document.querySelector('.click-mode');
const hoverModeBtn = document.querySelector('.hover-mode');
const generationsCountElem = document.querySelector('.generations-count');
const ctx = canvas.getContext('2d');
const size = 50;
const generationDuration = 100;
let world = [];
let generationsCount = 1;
let isGame;
let interval;

const renderCells = () => {
	ctx.clearRect(0, 0, size * 10, size * 10);
	for (let i = 0; i < size; i++){
		for (let j = 0; j < size; j++){
			if (world[i][j] === 1){
                ctx.fillStyle = 'orange';
				ctx.fillRect(j * 10, i * 10, 10, 10);
			}
		}
	}
};

const createField = () => {
    for (let i = 0; i < size; i++) {
        world[i] = [];
        for (let j = 0; j < size; j++) {
			world[i][j] = 0;
        }
    }
};

const getNeighbours = (x, y) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const coordX = (x + j + size) % size;
            const coordY = (y + i + size) % size;
            count = count + world[coordY][coordX];
        }
    }
    return count - world[y][x];
};

const ressetWorld = () => {
	ctx.clearRect(0, 0, size * 10, size * 10);
    const evolvedCells = [];
    for (let i = 0; i < size; i++) {
        evolvedCells.push(new Array(size).fill(0));
    }
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const neighbours = getNeighbours(x, y);
            if (world[y][x] === 0 && neighbours === 3) {
                evolvedCells[y][x] = 1;
            }
            if (world[y][x] === 1 && (neighbours === 2 || neighbours === 3)) {
                evolvedCells[y][x] = 1;
            }
        }
    }
    world = evolvedCells;
    renderCells();
    generationsCount++;
    generationsCountElem.innerText = `Generation: ${generationsCount}`;
};

const classHandler = (activeElement, disabledElement) => {
    disabledElement.classList.remove('is-active');
    activeElement.classList.add('is-active');
};

const setLifeOnMouseEvents = function (event) {
    const x = Math.floor(event.offsetX / 10);
    const y = Math.floor(event.offsetY / 10);
    world[y][x] = 1;
    renderCells();
};

createField();

canvas.addEventListener('click', setLifeOnMouseEvents);

clickModeBtn.addEventListener('click', () => {
    canvas.addEventListener('click', setLifeOnMouseEvents);
    canvas.removeEventListener('mousemove', setLifeOnMouseEvents);
    classHandler(clickModeBtn, hoverModeBtn);
});

hoverModeBtn.addEventListener('click', () => {
    canvas.addEventListener('mousemove', setLifeOnMouseEvents);
    canvas.removeEventListener('click', setLifeOnMouseEvents);
    classHandler(hoverModeBtn, clickModeBtn);
});

startBtn.addEventListener('click', () => {
    !isGame ? isGame = true : isGame = false;
    startBtn.classList.toggle('on-pause');
    startBtn.classList.toggle('on-play');
    isGame ? interval = setInterval(ressetWorld, generationDuration) : clearInterval(interval);
});
