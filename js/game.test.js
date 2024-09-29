const {Game} = require('./game')

describe('game tests', () => {
    it('init test', () => {
        const game = new Game()

        game.settings = {
            gridSize: {
                columns: 4,
                rows: 5,
            },
        }

        expect(game.settings.gridSize.columns).toBe(4)
        expect(game.settings.gridSize.rows).toBe(5)
    })
    it('start game', async () => {
        const game = new Game()
        game.settings = {
            gridSize: {
                columns: 4,
                rows: 5,
            },
        }

        expect(game.status).toBe('pending')
        await game.start()
        expect(game.status).toBe('in-progress')
    })
    it('player1, player2 should have unique coordinates', async () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game()
            game.settings = {
                gridSize: {
                    columns: 2,
                    rows: 3,
                },
            }

            await game.start()

            expect([1, 2]).toContain(game.player1.position.x)
            expect([1, 2, 3]).toContain(game.player1.position.y)

            expect([1, 2]).toContain(game.player2.position.x)
            expect([1, 2, 3]).toContain(game.player2.position.y)

            expect(
                game.player1.position.x !== game.player2.position.x ||
                game.player1.position.y !== game.player2.position.y
            )

            expect([1, 2]).toContain(game.google.position.x)
            expect([1, 2, 3]).toContain(game.google.position.y)

            expect(
                (game.player1.position.x !== game.player2.position.x ||
                    game.player1.position.y !== game.player2.position.y) &&
                (game.player1.position.x !== game.google.position.x ||
                    game.player1.position.y !== game.google.position.y) &&
                (game.player2.position.x !== game.google.position.x ||
                    game.player2.position.y !== game.google.position.y)
            ).toBe(true)
        }
    })
    it('check google positions after jump', async () => {
        // setter
        game.settings = {
            gridSize: {
                columnsCount: 1,
                rowsCount: 4,
            },
            googleJumpInterval: 100,
        }

        await game.start()

        const prevPositions = game.google.position.clone()

        await sleep(150)

        expect(game.google.position.equal(prevPositions)).toBe(false)
    })
})