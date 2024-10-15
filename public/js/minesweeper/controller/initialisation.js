import * as game from './gameplay.js'

function initGrid(config, grid) {

    $('#grid').empty()
    $('#menu').removeClass('d-none')
    $('#lost').addClass('d-none')
    $('#win').addClass('d-none')
    $('#cover').addClass('d-none')

    config.height = Number($('#height').val())
    config.width = Number($('#width').val())
    config.numberOfMines = Number($('#mines-qty').val())

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
                $('#grid').append('<div class="square" data-x="' + ii + '" data-y="' + jj + '"></div>')
            }
        }

        game.displayFlagCounter(grid)

        $('.square').on("contextmenu", function (evt) { evt.preventDefault() })
        $('.square').mousedown(function (e) {
            if (e.which == 1) {
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

                game.humanGame(grid)
                $(this).trigger("mousedown")
            }

        })
    }
}

export default initGrid


