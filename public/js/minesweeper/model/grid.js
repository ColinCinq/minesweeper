let grid,
    revealed,
    mines,
    flags

export function initGrid(config) {
    grid = Array.from(Array(config.height), () => new Array(config.width).fill(0))
    revealed = Array.from(Array(grid[0].length), () => new Array(grid.length).fill(false))
    flags = []
}

export function setMines(minesArray) {
    mines = minesArray
    mines.forEach((mine) => { grid[mine[0]][mine[1]] = 'mine' })
    computeGridNumber()
}
export function getMines() {
    return mines
}

export function isFlag(coord) {
    return flags.containsArray(coord)
}
export function addFlag(coord) {
    let success = false
    if (!isFlag(coord)) {
        flags.push(coord)
        success = true
    }
    return success
}
export function removeFlag(coord) {
    if (isFlag(coord))
        flags.splice(flags.indexOfArray(coord), 1)
}
export function getFlags() {
    return flags
}

export function getSurroundCells(coord, option) {
    let x = coord[0],
        y = coord[1],
        theory = [[x - 1, y - 1], [x - 1, y], [x - 1, y + 1], [x, y - 1], [x, y + 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]],
        real = []
    for (let ii = 0; ii < theory.length; ii++) {
        if (theory[ii][0] < grid.length && theory[ii][1] < grid[0].length && 0 <= theory[ii][0] && 0 <= theory[ii][1]) {

            switch (option) {
                case undefined:
                    real.push(theory[ii])
                    break
                case 'flag':
                    if (isFlag(theory[ii]))
                        real.push(theory[ii])
                    break
                case 'noflag':
                    if (!isFlag(theory[ii]))
                        real.push(theory[ii])
                    break
                case 'revealed':
                    if (isRevealed(theory[ii]))
                        real.push(theory[ii])
                    break
                case 'unrevealed':
                    if (!isRevealed(theory[ii]))
                        real.push(theory[ii])
                    break
                case 'unrevealed noflag':
                    if (!isRevealed(theory[ii]) && !isFlag(theory[ii]))
                        real.push(theory[ii])
                    break
                default:
                    console.error('mauvaise option "' + option + '"')
                    break
            }

        }
    }

    return real;
}
export function getSafeCells() {
    let safeCells = []
    for (let ii = 0; ii < grid.length; ii++) {
        for (let jj = 0; jj < grid[0].length; jj++) {
            if (grid[ii][jj] != 'mine')
                safeCells.push([ii, jj])
        }
    }
    return safeCells
}
export function getUnrevealedCells() {
    let unrevealedCells = []
    for (let ii = 0; ii < grid.length; ii++) {
        for (let jj = 0; jj < grid[0].length; jj++) {
            if (!isRevealed([ii, jj]))
                unrevealedCells.push([ii, jj])
        }
    }
    return unrevealedCells
}

export function isRevealed(coord) {
    return revealed[coord[0]][coord[1]]
}
export function revealCell(coord) {
    revealed[coord[0]][coord[1]] = true
    return grid[coord[0]][coord[1]]
}
export function getCell(coord) {
    return isRevealed(coord) ? grid[coord[0]][coord[1]] : 'unrevealed'
}

export function logGrid() {
    console.log(grid)
}
export function logMines() {
    console.log(mines)
}
export function logFlags() {
    console.log(flags)
}

export function computePartialGridNumber(partialGrid) {
    for (let ii = 0; ii < partialGrid.length; ii++) {
        for (let jj = 0; jj < partialGrid[0].length; jj++) {

            if (partialGrid[ii][jj] != 'mine') {
                let count = 0

                getSurroundCells([ii, jj]).forEach(cell => {
                    if (partialGrid[cell[0]][cell[1]] == 'mine')
                        count++
                })
                partialGrid[ii][jj] = count
            }

        }
    }
    return partialGrid
}


function computeGridNumber() {
    for (let ii = 0; ii < grid.length; ii++) {
        for (let jj = 0; jj < grid[0].length; jj++) {

            if (grid[ii][jj] != 'mine') {
                let count = 0

                getSurroundCells([ii, jj]).forEach(cell => {
                    if (grid[cell[0]][cell[1]] == 'mine')
                        count++
                })
                grid[ii][jj] = count
            }

        }
    }
}