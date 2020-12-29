// setup
var width = 30;
var height = 16;
var minescount = 99;
$('.game').css({
    "width": (width * 22 + 2)+"px",
    "height": (height * 22 + 2)+"px"
});
var field = $('#minefield');
var mines = [];
var squares = [];
var play = true;
var foundcount = 0;
var timego = false;
var time = 0;

// shuffle array
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// check for mine
function checkMine(y,x) {
    var match = false;
    for (i=0; i<minescount; i++) {
        if (y===mines[i][0] && x===mines[i][1]) {
            match = true;
        }
    }
    return match;
}

// stack of cells to check
var stack = [];
function addToStack(ar) {
    for (m=0; m<ar.length; m++) {
        if (!squares[ar[m][0]][ar[m][1]].hasClass('found')) {
            var match = false;
            for (n=0; n<stack.length; n++) {
                if (stack[n][0] === ar[m][0] && stack[n][1] === ar[m][1]) {
                    match = true;
                }
            }
            if (!match) {
                stack.push(ar[m]);
                // cont = $('#debug').html();
                // $('#debug').html(cont+'<br>'+ar[m][0]+' - '+ar[m][1]);
            }
        }
    }
}

// return array of surrounding cells
function getSurroundCells(y,x) {
    var arr1 = [[y-1,x-1],[y-1,x],[y-1,x+1],[y,x-1],[y,x+1],[y+1,x-1],[y+1,x],[y+1,x+1]];
    var arr2 = [];
    for (ai=0; ai<arr1.length; ai++) {
        if (arr1[ai][0]<height && arr1[ai][1]<width && 0<=arr1[ai][0] && 0<=arr1[ai][1]) {
            arr2.push(arr1[ai]);
        }
    }
    return arr2;
}

// check surrounding squares for mines
function checkSurround(y,x) {
    var count = 0;
    var arr = getSurroundCells(y,x);
    for (p=0; p<arr.length; p++) {
        if (checkMine(arr[p][0],arr[p][1])) {
            count++;
        }
    }
    return count;
}

// cell to check
function checkCell(y,x) {
    stack = [[y,x]];
    var st = 0;
    while (st < stack.length) {
        squares[stack[st][0]][stack[st][1]].addClass("found").removeClass('flag');
        foundcount++;

        var count = checkSurround(stack[st][0],stack[st][1]);
        if (count === 0) {
            addToStack(getSurroundCells(stack[st][0],stack[st][1]));
        } else {
            squares[stack[st][0]][stack[st][1]].html(count);
        }
        st++;
    }
    if (((width*height)-minescount) <= foundcount) {
        winGame();
    }
}

// win game
function winGame() {
    clearInterval(timer);
    timego = false;
    play = false;
    $('.winner').show();
}

// lose game
function loseGame() {
    clearInterval(timer);
    timego = false;
    play = false;
    for (mn=0; mn<minescount; mn++) {
        squares[mines[mn][0]][mines[mn][1]].addClass('mine');
    }
}

// initialise
function init() {
    clearInterval(timer);
    timego = false;
    time = 0;
    $('#counter').html(time);
    $('.winner').hide();
    foundcount = 0;
    play = true;
    field.empty();
    squares = [];
    mines = [];
    for (iy=0; iy<height; iy++) {
        squares[iy] = [];
        for (ix=0; ix<width; ix++) {
            squares[iy][ix] = $('<div class="square" data-y="'+iy+'" data-x="'+ix+'"></div>');
            field.append(squares[iy][ix]);
            mines.push([iy,ix]);
        }
        field.append('<div class="cf"></div>');
    }
    shuffle(mines);

    // when mine is clicked
    $('.square:not(.found)').on("contextmenu", function(evt) {evt.preventDefault();});
    $('.square:not(.found)').mousedown(function(event) {
        if (!$(this).hasClass('found') && play) {
            switch (event.which) {
                case 2:
                    //alert('Middle Mouse button pressed.');
                    break;
                case 3:
                    if ($(this).hasClass('flag')) {
                        $(this).removeClass('flag');
                    } else {
                        $(this).addClass('flag');
                    }
                    break;
                default:
                    if ($(this).hasClass('flag')) {
                        $(this).removeClass('flag');
                    } else {
                        if (!timego) {
                            setTimer();
                        }
                        timego = true;
                        var x = $(this).data('x');
                        var y = $(this).data('y');
                        if (checkMine(y,x)) {
                            loseGame(y,x);
                        } else {
                            checkCell(y,x);
                        }
                    }
            }
        }
    });
}
init();

// start
$('#start').click(function(){
    init();
});

// timer
var timer = false;
function setTimer() {
    timer = setInterval(function(){
        time++;
        $('#counter').html(time);
    },1000);
}