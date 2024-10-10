function humanGame(grid) {
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
                    $(this).toggleClass('flag')
                    break;
                default:
                    if ($(this).hasClass('flag')) {
                        $(this).removeClass('flag')
                    } else {
                        let value = grid.revealCell(x, y)

                        if (value == 'mine') {
                            $('#menu').addClass('d-none')
                            $('#lost').removeClass('d-none')
                        } else {
                            $(this).addClass('found')
                            displayCell(grid, $(this), value)
                        }
                    }
            }
        }
    })
}

export { humanGame }

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