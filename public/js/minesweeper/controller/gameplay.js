import config from "../config.js"
import * as solver from "./autosolver.js"

export function humanGame(grid) {
    $('.square').on("contextmenu", function (evt) { evt.preventDefault() })
    $('.square:not(.found)').mousedown(function (event) {

        let coord = [$(this).data('x'), $(this).data('y')]

        switch (event.which) {
            case 2:
                //middle click
                // $('.square').removeClass('debug')
                // solver.getCluster(grid, x, y).forEach((coord) => {
                //     $('.square[data-x=' + coord[0] + '][data-y=' + coord[1] + ']').addClass('debug')
                // })
                solver.recurSinglePointEntry(grid, coord)
                break
            case 3:
                //right click
                if (grid.isFlag(coord))
                    removeFlag(grid, coord)
                else if (!grid.isRevealed(coord))
                    placeFlag(grid, coord)
                break
            default:
                //left click and other
                if (grid.isFlag(coord)) {
                    removeFlag(grid, coord)
                } else if (!grid.isRevealed(coord)) {
                    let value = grid.revealCell(coord)

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
    let coord = [cell.data('x'), cell.data('y')]
    cell.addClass('found')

    if (value != 0) {
        cell.text(value)
    } else {
        display0(grid, coord)
    }

    if (grid.getUnrevealedCells().length == config.numberOfMines)
        winGame(grid)
}

export function display0(grid, coordOrigin) {
    let displayOrder = [[coordOrigin]],
        ii = 0

    while (displayOrder[ii].length > 0) {
        displayOrder[ii + 1] = []

        displayOrder[ii].forEach(coord => {
            let value = grid.revealCell(coord)
            if (value == 0) {
                grid.getSurroundCells(coord, 'unrevealed').forEach(coordNeighbour => {

                    if (!grid.isRevealed(coordNeighbour)) {
                        displayOrder[ii + 1].push(coordNeighbour)
                    }
                })
            }
        })
        ii++
    }

    let time = 0
    displayOrder.forEach(coordsList => {
        if (coordsList.length > 0) {
            setTimeout(() => {
                coordsList.forEach(coord => {
                    let cell = $('.square[data-x=' + coord[0] + '][data-y=' + coord[1] + ']'),
                        value = grid.getCell(coord)

                    cell.addClass('found')
                    if (value != 0)
                        cell.text(value)
                })
            }, time)
            time += 100
        }
    })

    return time
}


export function placeFlag(grid, coord) {
    let success = false
    if (!grid.isRevealed(coord)) {
        grid.addFlag(coord)
        $('.square[data-x=' + coord[0] + '][data-y=' + coord[1] + ']').addClass('flag')
        displayFlagCounter(grid)
        success = true
    }
    return success
}

function removeFlag(grid, coord) {
    if (!grid.isRevealed(coord)) {
        grid.removeFlag(coord)
        $('.square[data-x=' + coord[0] + '][data-y=' + coord[1] + ']').removeClass('flag')
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