import {Game} from "./game.js";
import {EventEmitter} from "../observer/observer.js";

const eventEmitter = new EventEmitter();

const game = new Game(eventEmitter)

game.settings = {
    pointsToWin: 3,
    gridSize: {
        columns: 3,
        rows: 3,
    },
}

await game.start()

const tableElement = document.querySelector('.table')
const catchElement = document.querySelector('.result')

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            game.movePlayer1Right();
            break
        case 'ArrowLeft':
            game.movePlayer1Left();
            break
        case 'ArrowUp':
            game.movePlayer1Up();
            break
        case 'ArrowDown':
            game.movePlayer1Down();
            break
        case 'd':
            game.movePlayer2Right();
            break
        case 'a':
            game.movePlayer2Left();
            break
        case 'w':
            game.movePlayer2Up();
            break
        case 's':
            game.movePlayer2Down();
            break
    }
})

const render = () => {
    tableElement.innerHTML = "";
    catchElement.innerHTML = "";
    const {settings: {gridSize}, player1, player2, google, score} = game
    catchElement.append(score[1].points + score[2].points)
    for (let y = 1; y <= gridSize.rows; y++) {
        const trElement = document.createElement("tr")
        for (let x = 1; x <= gridSize.columns; x++) {
            const tdElement = document.createElement("td")
            tdElement.classList.add("cell") // Добавление класса "cell" к ячейке

            if (player1.position.x === x && player1.position.y === y) {
                const player1ImgElement = document.createElement("img")
                player1ImgElement.src = 'img/icons/man01.svg'
                tdElement.append(player1ImgElement)
            }
            if (player2.position.x === x && player2.position.y === y) {
                const player2ImgElement = document.createElement("img")
                player2ImgElement.src = 'img/icons/man02.svg'
                tdElement.append(player2ImgElement)
            }
            if (google.position.x === x && google.position.y === y) {
                const googleImgElement = document.createElement("img")
                googleImgElement.src = 'img/icons/googleIcon.svg'
                tdElement.append(googleImgElement)
            }
            trElement.append(tdElement)
        }
        tableElement.append(trElement)
    }
}

eventEmitter.subscribe('changePosition', render)