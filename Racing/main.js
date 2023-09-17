const MAX_ENEMY = 7;
const HEIGHT_ELEMENT = 125;

const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');

const music = new Audio('./audio/audio.mp3');
music.volume = 0.0;

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

const setting = {
    start: false,
    score: 0,
    speed: 4,
    traffic: 3,
};

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

const getRandonEnemy = (max) => Math.floor(Math.random() * max + 1);

function startGame() {
    // gameArea.style.minHeight = 800 + 'px';
    music.play();
    start.classList.add('hide');
    gameArea.innerHTML = '';

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEMENT); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = i * HEIGHT_ELEMENT + 'px';
        line.y = i * HEIGHT_ELEMENT;
        gameArea.append(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -HEIGHT_ELEMENT * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./image/enemy${getRandonEnemy(MAX_ENEMY)}.png) center / cover no-repeat`;

        gameArea.append(enemy);
    }

    setting.start = true;
    setting.score = 0;
    gameArea.append(car);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px';
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.start) {
        setting.score += setting.speed;
        score.innerHTML = 'SCORE<br>' + setting.score;
        moveRoad();
        moveEnemy();

        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (
            keys.ArrowRight &&
            setting.x < gameArea.offsetWidth - car.offsetWidth
        ) {
            setting.x += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if (
            keys.ArrowDown &&
            setting.y < gameArea.offsetHeight - car.offsetHeight
        ) {
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    } else {
        music.pause();
    }
}

function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach((line) => {
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= document.documentElement.clientHeight) {
            line.y = -HEIGHT_ELEMENT;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach((item) => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (
            carRect.top <= enemyRect.bottom - 8 &&
            carRect.right >= enemyRect.left + 8 &&
            carRect.left <= enemyRect.right - 8 &&
            carRect.bottom >= enemyRect.top + 8
        ) {
            setting.start = false;
            setting.counter += 1;
            // localStorage.setItem(setting.counter, setting.score);
            // if(setting.score > localStorage.getItem(setting.counter)) {
            //   alert(`BEST SCORE - ${setting.score}!!!`);
            // }
            start.classList.remove('hide');
            start.style.top = score.offsetHeight + 'px';
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -HEIGHT_ELEMENT * setting.traffic;
            item.style.left =
                Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}
