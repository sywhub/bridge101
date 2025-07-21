function bidExamples(choice) {
    var disp = document.getElementById("ListDisplay")
    clearContents(disp)
    var gridDisp = document.createElement("div")
    gridDisp.setAttribute("id", "PointExamples")
    gridDisp.setAttribute("class", "PointExamples")
    disp.appendChild(gridDisp)
    var d = new Deck;
    var board = new Board(d);
    if (['HCP', 'DP', 'TP'].includes(choice.value)) {
        simplePoints(gridDisp, choice.value, board);
    } else if (choice.value == 'LTC') {
        ltcExamples(gridDisp, choice.value, board);
    }
}

function ltcExamples(eDiv, k, board) {
    var thresholds = [10, 7, 5];
    var idx = 1
    for (const t of thresholds) {
        var nExamples = 5
        while (nExamples > 0) {
            board.deal();
            for (const h of board.seats)
                if (h[k] <= t && nExamples > 0) {
                    gridElement(eDiv, idx.toString() + ":", 1, idx);
                    gridElement(eDiv, h.toString(), 2, idx);
                    var ans = gridElement(eDiv, k + "=" + h[k], 3, idx);
                    ans.setAttribute("id", "Ans"+idx)
                    ans.style['visibility'] = 'hidden'
                    --nExamples;
                    ++idx;
                }
        }
    }
    eDiv.addEventListener('click', (e) => {divKeyEvent(e)})
}
function simplePoints(eDiv, k, board) {
    var thresholds = [10, 15, 22];
    var idx = 1
    for (const t of thresholds) {
        var nExamples = 5
        while (nExamples > 0) {
            board.deal();
            for (const h of board.seats)
                if (h[k] >= t && nExamples > 0) {
                    gridElement(eDiv, idx.toString() + ": ", 1, idx);
                    gridElement(eDiv, h.toString(), 2, idx);
                    var ans = gridElement(eDiv, k + "=" + h[k], 3, idx);
                    ans.setAttribute("id", "Ans"+idx)
                    ans.style['visibility'] = 'hidden'
                    --nExamples;
                    ++idx;
                }
        }
    }
    eDiv.addEventListener('click', (e) => {divKeyEvent(e)})
}

function divKeyEvent(e) {
    var idx = 1
    while (idx <= 15) {
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