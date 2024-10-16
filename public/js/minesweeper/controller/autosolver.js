import * as game from "./gameplay.js"

export function singlePointEntry(grid, x, y) {
    let flags = grid.getSurroundCells(x, y, 'flag'),
        unrelvealed = grid.getSurroundCells(x, y, 'unrevealed noflag'),
        value = grid.getCell(x, y),
        newData = false

    switch (value - flags.length) {
        case unrelvealed.length:
            unrelvealed.forEach(coord => {
                game.placeFlag(grid, coord[0], coord[1])
                newData = true
            })
            break
        case 0:
            unrelvealed.forEach(coord => {
                if (!grid.isRevealed(coord[0], coord[1])) {
                    let value = grid.revealCell(coord[0], coord[1])
                    game.displayCell(grid, $('.square[data-x=' + coord[0] + '][data-y=' + coord[1] + ']'), value)
                    newData = true
                }
            })
        default:
            break
    }

    return newData
}


export function recurSinglePointEntry(grid, x, y) {
    let clusters = [getCluster(grid, x, y)]

    clusters.forEach((cluster) => {
        let newData = false
        do {
            cluster.forEach((coord) => {
                newData = singlePointEntry(grid, coord[0], coord[1])
            })
        } while (newData)
    })
}



export function getCluster(grid, x, y, cluster) {
    cluster = cluster ? cluster : []

    if (!cluster.containsArray([x, y]))
        cluster.push([x, y])

    if (grid.isRevealed(x, y)) {
        grid.getSurroundCells(x, y, 'unrevealed noflag').forEach((coord) => {
            if (!cluster.containsArray(coord))
                getCluster(grid, coord[0], coord[1], cluster)
        })
    } else if (!grid.isFlag(x, y)) {
        grid.getSurroundCells(x, y, 'revealed').forEach((coord) => {
            if (!cluster.containsArray(coord))
                getCluster(grid, coord[0], coord[1], cluster)
        })
    }

    return cluster.length > 1 ? cluster : []
}