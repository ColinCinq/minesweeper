import config from "../config.js"
import * as solver from "./autosolver.js"

export function humanGame(grid) {
    $('.square').on("contextmenu", function (evt) { evt.preventDefault() })
    $('.square:not(.found)').mousedown(function (event) {

        let x = $(this).data('x'),
            y = $(this).data('y')

        switch (event.which) {
            case 2:
                //middle click
                /* $('.square').removeClass('debug')
                solver.getCluster(grid, x, y).forEach((coord) => {
                    $('.square[data-x=' + coord[0] + '][data-y=' + coord[1] + ']').addClass('debug')
                })
                solver.singlePointEntry(grid, x, y) */
                break
            case 3:
                //right click
                if (grid.isFlag(x, y))
                    removeFlag(grid, x, y)
                else if (!grid.isRevealed(x, y))
                    placeFlag(grid, x, y)
                break
            default:
                //left click and other
                if (grid.isFlag(x, y)) {
                    removeFlag(grid, x, y)
                } else if (!grid.isRevealed(x, y)) {
                    let value = grid.revealCell(x, y)

                    if (value == 'mine') {
                        $(this).addClass('found')
                        lostGame(grid)

                    } else {
                        displayCell(grid, $(this), value)
                    }
                }
        }
    })
}

export function displayCell(grid, cell, value) {
    let x = cell.data('x'),
        y = cell.data('y')
    cell.addClass('found')

    if (value != 0) {
        cell.text(value)
    } else {
        grid.getSurroundCells(x, y, 'unrevealed').forEach(coord => {

            if (!grid.isRevealed(coord[0], coord[1])) {
                let newCell = $('.square[data-x=' + coord[0] + '][data-y=' + coord[1] + ']'),
                    value = grid.revealCell(coord[0], coord[1])
                newCell.addClass('found')
                displayCell(grid, newCell, value)
            }
        })
    }

    if (grid.getUnrevealedCells().length == config.numberOfMines)
        winGame(grid)
}

export function placeFlag(grid, x, y) {
    let success = false
    if (!grid.isRevealed(x, y)) {
        grid.addFlag(x, y)
        $('.square[data-x=' + x + '][data-y=' + y + ']').addClass('flag')
        displayFlagCounter(grid)
        success = true
    }
    return success
}

function removeFlag(grid, x, y) {
    if (!grid.isRevealed(x, y)) {
        grid.removeFlag(x, y)
        $('.square[data-x=' + x + '][data-y=' + y + ']').removeClass('flag')
        displayFlagCounter(grid)
    }
}

export function displayFlagCounter(grid) {
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