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
    var ptDispatch = {'HCP': [hcpSelector, hcpAnswerer, [10, 15, 22]],
        'DP': [dpSelector, tagAnswerer, [10, 15, 22]],
        'LTC': [ltcSelector, tagAnswerer, [8, 5, 3]]
    }
    if (choice.value in ptDispatch) {
        let d = new Deck;
        let board = new Board(d);
        ptExamples(gridDisp, choice.value, board, ptDispatch[choice.value]);
    } else 
        bidExamples(gridDisp, choice.value);
}

function divKeyEvent(e) {
    var idx = 1
    while (idx <= 10) {
        var eAns = document.getElementById('Ans' + idx)
        var eHint = document.getElementById('Hint' + idx)
        if (eAns !== null) {
            if (eAns.style['visibility'] != 'hidden')
                ++idx
            else {
                eAns.style['visibility'] = 'visible';
                eHint.style['visibility'] = 'visible';
                break
            }
        }
    }
}
