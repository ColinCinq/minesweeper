let grid = [],
    revealed,
    playing = false

function initGrid(config) {
    grid = Array.from(Array(config.width), () => new Array(config.height).fill(0))
    revealed = Array.from(Array(grid.length), () => new Array(grid[0].length).fill(false))
}

function setMines(mines) {
    mines.forEach((mine) => { grid[mine[0]][mine[1]] = 'mine' })
    computeGridNumber()
}

function setPlaying(bool) {
    playing = bool
}

function isPlaying() {
    return playing
}

function getSurroundCells(x, y) {
    let theory = [[x - 1, y - 1], [x - 1, y], [x - 1, y + 1], [x, y - 1], [x, y + 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]],
        real = []
    for (let ii = 0; ii < theory.length; ii++) {
        if (theory[ii][0] < grid.length && theory[ii][1] < grid[0].length && 0 <= theory[ii][0] && 0 <= theory[ii][1]) {
            real.push(theory[ii]);
        }
    }
    return real;
}

function getSafeCells() {
    let safeCells = []
    for (let ii = 0; ii < grid.length; ii++) {
        for (let jj = 0; jj < grid[0].length; jj++) {
            if (grid[ii][jj] != 'mine')
                safeCells.push([ii, jj])
        }
    }
    return safeCells
}

function isRevealed(x, y) {
    return revealed[x][y]
}

function revealCell(x, y) {
    revealed[x][y] = true
    return grid[x][y]
}

function getCell(x, y) {
    return grid[x][y]
}

function logGrid() {
    console.log(grid)
}


export { initGrid, setMines, setPlaying, isPlaying, getSurroundCells, getSafeCells, isRevealed, revealCell, getCell, logGrid }


function computeGridNumber() {
    for (let ii = 0; ii < grid.length; ii++) {
        for (let jj = 0; jj < grid[0].length; jj++) {

            if (grid[ii][jj] != 'mine') {
                let count = 0

                getSurroundCells(ii, jj).forEach(cell => {
                    if (grid[cell[0]][cell[1]] == 'mine')
                        count++
                })
                grid[ii][jj] = count
            }

        }
    }
}