function bidExamples(choice) {
    var disp = document.getElementById("ListDisplay")
    clearContents(disp)
    var gridDisp = document.createElement("div")
    gridDisp.setAttribute("id", "PointExamples")
    gridDisp.setAttribute("class", "PointExamples")
    disp.appendChild(gridDisp)
    var d = new Deck;
    var board = new Board(d);
    var dispatch = {'HCP': [ptSelector, ptAnswerer, [10, 15, 22]],
        'DP': [ptSelector, ptAnswerer, [10, 15, 22]],
        'TP': [ptSelector, ptAnswerer, [10, 15, 22]],
        'LTC': [ltcSelector, ptAnswerer, [10, 7, 5]]
    }
    if (choice.value in dispatch) 
        simplePoints(gridDisp, choice.value, board, dispatch[choice.value]);
}

function simplePoints(eDiv, k, board, funcTbl) {
    var idx = 1
    var nCap = 10;
    var nExamples = nCap
    while (nExamples > 0) {
        board.deal();
        for (const h of board.seats) {
            if (funcTbl[0](h, k, Math.trunc(idx / (nCap / funcTbl[2].length)), funcTbl[2])) {
                gridElement(eDiv, idx.toString() + ":", 1, idx);
                gridElement(eDiv, h.toString(), 2, idx);
                var ans = gridElement(eDiv, funcTbl[1](h, k, idx, funcTbl[2]), 3, idx);
                ans.setAttribute("id", "Ans"+idx)
                ans.style['visibility'] = 'hidden'
                --nExamples;
                ++idx;
            }
            if (nExamples <= 0)
                break
        }
    }
    eDiv.addEventListener('click', (e) => {divKeyEvent(e)})
}
function ptSelector(h, k, idx, data) {
    var ret = false;
    if (idx < data.length - 1)
        ret = h[k] >= data[idx] && h[k] < data[idx+1];
    else
        ret = h[k] >= data[data.length-1];
    return ret;
}

function ptAnswerer(h, k, idx, data) {
    return k + "=" + h[k].toString();
}
function ltcSelector(h, k, idx, data) {
    var ret = false;
    if (idx < data.length - 1)
        ret = h[k] <= data[idx] && h[k] > data[idx+1];
    else
        ret = h[k] <= data[data.length-1];
    return ret;
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