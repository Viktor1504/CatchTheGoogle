import {Game} from "./game.js";

const game = new Game()

await game.start()

const {settings: {gridSize}, player1, player2, google} = game

console.log(player1.position)
console.log(player2.position)
console.log(google.position)

const tableElement = document.querySelector('#grid')

const render = () => {
    for (let y = 1; y <= gridSize.rows; y++) {
        const trElement = document.createElement("tr")
        for (let x = 1; x <= gridSize.columns; x++) {
            const tdElement = document.createElement("td")
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

render()
