import * as game from './gameplay.js'

function initGrid(config, grid) {

    grid.initGrid(config)

    if (config.numberOfMines > (config.width * config.height - 2))
        console.error("Trop de mines")
    else {
        $('#minefield').css({
            "width": (config.width * 25 + 2) + "px",
            "height": (config.height * 25 + 2) + "px"
        })

        for (let ii = 0; ii < config.height; ii++) {
            for (let jj = 0; jj < config.width; jj++) {
                $('#minefield').append('<div class="square" data-x="' + ii + '" data-y="' + jj + '"></div>')
            }
        }

        $('.square').mousedown(function (e) {
            $('.square').unbind()
            let x = $(this).data('x'),
                y = $(this).data('y'),
                noMine = [...[[x, y]], ...grid.getSurroundCells(x, y)]

            if (config.numberOfMines > (config.width * config.height - noMine.length))
                noMine = [[x, y]]

            let minePosibility = grid.getSafeCells().filter((cell) => { return !(noMine.indexOfArray(cell) != -1) }),
                mines = []

            while (mines.length < config.numberOfMines) {
                mines.push(minePosibility.splice(Math.floor((Math.random() * minePosibility.length)), 1)[0])
            }
            grid.setMines(mines)
            grid.setPlaying(true)

            game.humanGame(grid)
            $(this).trigger("mousedown")
        })
    }
}

export default initGrid


