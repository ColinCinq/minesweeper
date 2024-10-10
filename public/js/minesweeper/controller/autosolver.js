function singlePointEntry(grid, x, y) {
    let qtyFlags = grid.getSurroundCells(x, y, 'flag'),
        qtyUnrelvealed = grid.getSurroundCells(x, y, 'unrevealed noflag'),
        value = grid.getCell(x, y)
}