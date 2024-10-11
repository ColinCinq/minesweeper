import config from "../config.js";

export function humanGame(grid) {
    $('.square:not(.found)').on("contextmenu", function (evt) { evt.preventDefault() })
    $('.square:not(.found)').mousedown(function (event) {

        let x = $(this).data('x'),
            y = $(this).data('y')
        if (!grid.isRevealed(x, y)) {
            switch (event.which) {
                case 2:
                    //alert('Middle Mouse button pressed.')
                    break;
                case 3:
                    if (grid.isFlag(x, y))
                        removeFlag(grid, x, y)
                    else
                        placeFlag(grid, x, y)
                    break;
                default:
                    if (grid.isFlag(x, y)) {
                        removeFlag(grid, x, y)
                    } else {
                        let value = grid.revealCell(x, y)

                        if (value == 'mine') {
                            $(this).addClass('found')
                            lostGame(grid)

                        } else {
                            $(this).addClass('found')
                            displayCell(grid, $(this), value)
                            if (grid.getUnrevealedCells().length == config.numberOfMines)
                                winGame(grid)
                        }
                    }
            }
        }
    })
}

function displayCell(grid, cell, value) {

    cell.addClass('found')
    if (value != 0) {
        cell.text(value)

    } else {
        grid.getSurroundCells(cell.data('x'), cell.data('y')).forEach(coord => {

            if (!grid.isRevealed(coord[0], coord[1])) {
                let newCell = $('.square[data-x=' + coord[0] + '][data-y=' + coord[1] + ']')[0],
                    value = grid.revealCell(coord[0], coord[1])
                $(newCell).addClass('found')
                displayCell(grid, $(newCell), value)
            }
        })
    }
}

function placeFlag(grid, x, y) {
    if (!grid.isRevealed(x, y)) {
        grid.addFlag(x, y)
        $('.square[data-x=' + x + '][data-y=' + y + ']').addClass('flag')
        displayFlag(grid)
    }
}

function removeFlag(grid, x, y) {
    if (!grid.isRevealed(x, y)) {
        grid.removeFlag(x, y)
        $('.square[data-x=' + x + '][data-y=' + y + ']').removeClass('flag')
        displayFlag(grid)
    }
}

export function displayFlag(grid) {
    $('#mines-qty-display').text('mines restantes : ' + (config.numberOfMines - grid.getFlags().length))
}

function lostGame(grid) {
    $('#menu').addClass('d-none')
    $('#lost').removeClass('d-none')
    $('#cover').removeClass('d-none')

    grid.getMines().forEach((mine) => {
        $('.square[data-x=' + mine[0] + '][data-y=' + mine[1] + ']').addClass('mine')
    })
}

function winGame(grid) {
    $('#menu').addClass('d-none')
    $('#win').removeClass('d-none')
    $('#cover').removeClass('d-none')

    grid.getMines().forEach((mine) => {
        $('.square[data-x=' + mine[0] + '][data-y=' + mine[1] + ']').addClass('flag')
    })
}