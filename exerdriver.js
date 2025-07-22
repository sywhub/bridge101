/*
 * Called from index.html to dispatch functionalities
 */
function exercies(choice) {
    var disp = document.getElementById("ListDisplay")
    clearContents(disp)
    var gridDisp = document.createElement("div")
    gridDisp.setAttribute("id", "PointExamples")
    gridDisp.setAttribute("class", "PointExamples")
    disp.appendChild(gridDisp)
    var d = new Deck;
    var board = new Board(d);
    var ptDispatch = {'HCP': [hcpSelector, hcpAnswerer, [10, 15, 22]],
        'DP': [dpSelector, tagAnswerer, [10, 15, 22]],
        'LTC': [ltcSelector, tagAnswerer, [8, 5, 3]]
    }
    var bidDispatch = {'Open': [selectOpen], '2C': [select2C]}
    if (choice.value in ptDispatch) 
        ptExamples(gridDisp, choice.value, board, ptDispatch[choice.value]);
    else if (choice.value in bidDispatch)
        bidExamples(gridDisp, choice.value, board, bidDispatch[choice.value]);
}

function divKeyEvent(e) {
    var idx = 1
    while (idx <= 10) {
        var e = document.getElementById('Ans' + idx)
        if (e !== null) {
            if (e.style['visibility'] != 'hidden')
                ++idx
            else {
                e.style['visibility'] = 'visible';
                break
            }
        }
    }
}
