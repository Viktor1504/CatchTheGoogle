class NumberUtil {
    static getRandomNumber(max) {
        return Math.floor(Math.random() * max + 1)
    }
}

class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    clone() {
        return new Position(this.x, this.y)
    }

    equal(otherPosition) {
        return otherPosition.x === this.x && otherPosition.y === this.y
    }
}

class Unit {
    constructor(position) {
        this.position = position
    }
}

class Player extends Unit {
    constructor(id, position) {
        super(position)
        this.id = id
    }
}

class Google extends Unit {
    constructor(position) {
        super(position)
    }
}

export class Game {
    #settings = {
        pointsToWin: 10,
        gridSize: {
            columns: 4,
            rows: 4,
        },
        googleJumpInterval: 2000
    };
    #status = "pending";
    #player1
    #player2
    #google;
    #googleSetIntervalId = null
    #score = {
        1: {points: 0},
        2: {points: 0},
    };

    get score() {
        return this.#score;
    }

    set settings(settings) {
        this.#settings = {...this.#settings, ...settings};

        this.#settings.gridSize = settings.gridSize
            ? {...this.#settings.gridSize, ...settings.gridSize}
            : this.#settings.gridSize;
    }

    get settings() {
        return this.#settings;
    }

    get status() {
        return this.#status;
    }

    get player1() {
        return this.#player1;
    }

    get player2() {
        return this.#player2;
    }

    get google() {
        return this.#google;
    }

    #createUnits() {
        const player1Position = this.#getRandomPosition([]);
        this.#player1 = new Player(1, player1Position);

        const player2Position = this.#getRandomPosition([player1Position]);
        this.#player2 = new Player(2, player2Position);

        this.#moveGoogleToRandomPosition(true)
    }

    #runGoogleJumpInterval() {
        this.#googleSetIntervalId = setInterval(() => {
            this.#moveGoogleToRandomPosition();
        }, this.#settings.googleJumpInterval);
    }

    async start() {
        if (this.#status === "pending") {
            this.#createUnits();
            this.#status = "in-process";

            this.#runGoogleJumpInterval()
        }
    }

    async stop() {
        clearInterval(this.#googleSetIntervalId);
        this.#status = "stopped";
    }

    async #finishGame() {
        clearInterval(this.#googleSetIntervalId);
        this.#status = "finished";
    }

    #getRandomPosition(coordinates) {
        let newX, newY;
        do {
            newX = NumberUtil.getRandomNumber(this.#settings.gridSize.columns);
            newY = NumberUtil.getRandomNumber(this.#settings.gridSize.rows);
        } while (coordinates.some((el) => el.x === newX && el.y === newY));
        return new Position(newX, newY);
    }

    #moveGoogleToRandomPosition(excludeGoogle) {
        let notCrossedPosition = [this.#player1.position, this.#player2.position];

        if (!excludeGoogle) {
            notCrossedPosition.push(this.#google.position);
        }

        this.#google = new Google(this.#getRandomPosition(notCrossedPosition));
    }

    #movePlayer(movingPlayer, anotherPlayer, delta) {
        const isBorder = this.#checkBorders(movingPlayer, delta);
        const isAnotherPlayer = this.#checkOtherPlayer(movingPlayer, anotherPlayer, delta);
        if (isBorder || isAnotherPlayer) {
            return;
        }

        if (delta.x) {
            movingPlayer.position = new Position(movingPlayer.position.x + delta.x, movingPlayer.position.y);
        } else {
            movingPlayer.position = new Position(movingPlayer.position.x, movingPlayer.position.y + delta.y);
        }
        this.#checkGoogleCatching(movingPlayer);
    }

    movePlayer1Right() {
        const delta = {x: 1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Left() {
        const delta = {x: -1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Up() {
        const delta = {y: -1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Down() {
        const delta = {y: 1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer2Right() {
        const delta = {x: 1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Left() {
        const delta = {x: -1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Up() {
        const delta = {y: -1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Down() {
        const delta = {y: 1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    #checkBorders(player, delta) {
        const newPosition = player.position.clone();
        if (delta.x) newPosition.x += delta.x;
        if (delta.y) newPosition.y += delta.y;

        if (newPosition.x < 1 || newPosition.x > this.#settings.gridSize.columns) {
            return true;
        }
        if (newPosition.y < 1 || newPosition.y > this.#settings.gridSize.rows) {
            return true;
        }

        return false;
    }

    #checkOtherPlayer(movingPlayer, anotherPlayer, delta) {
        const newPosition = movingPlayer.position.clone();
        if (delta.x) newPosition.x += delta.x;
        if (delta.y) newPosition.y += delta.y;

        return anotherPlayer.position.equal(newPosition);
    }

    #checkGoogleCatching(player) {
        if (player.position.equal(this.#google.position)) {
            this.#score[player.id].points++;
            if (this.#score[player.id].points === this.#settings.pointsToWin) {
                this.#finishGame()
            } else {
                clearInterval(this.#googleSetIntervalId)
                this.#moveGoogleToRandomPosition()
                this.#runGoogleJumpInterval()
            }
        }
    }
}
/*

module.exports = {
    Game,
}*/
