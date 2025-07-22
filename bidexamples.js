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

function ptExamples(eDiv, k, board, funcTbl) {
    var idx = 1;
    var nCap = 10;
    var nExamples = nCap;
    while (nExamples > 0) {
        board.deal();
        for (const h of board.seats) {
            if (funcTbl[0](h, k, Math.trunc(idx / (nCap / funcTbl[2].length)), funcTbl[2])) {
                var item = gridElement(eDiv, idx.toString() + ":", 1, idx);
                item.style["justify-self"] = "right";
                gridElement(eDiv, h.toString(), 2, idx);
                var ans = gridElement(eDiv, funcTbl[1](h, k, idx, funcTbl[2]), 3, idx);
                ans.setAttribute("id", "Ans"+idx);
                ans.style['visibility'] = 'hidden';
                --nExamples;
                ++idx;
            }
            if (nExamples <= 0)
                break
        }
    }
    eDiv.addEventListener('click', (e) => {divKeyEvent(e)})
}

function bidExamples(eDiv, k, board, funcTbl) {
    eDiv.style['grid-template-columns'] = "3vw 20vw 70vw";
    var idx = 1;
    var nCap = 10;
    var nExamples = nCap;
    while (nExamples > 0) {
        board.deal();
        hIdx = funcTbl[0](board);
        if (hIdx >= 0) {
            var item = gridElement(eDiv, idx.toString() + ":", 1, idx);
            item.style["justify-self"] = "right";
            gridElement(eDiv, board.seats[hIdx].toString(), 2, idx);
            var des = gridElement(eDiv, handDescription(board.seats[hIdx]), 3, idx);
            des.setAttribute("id", "Ans"+idx);
            --nExamples;
            ++idx;
        }
    }
}

function dpSelector(h, k, idx, data) {
    var ret = hcpSelector(h, k, idx, data);
    ret = ret && h['HCP'] < (h['DP'] - 4);
    return ret
}

function hcpSelector(h, k, idx, data) {
    var ret = false;
    if (idx < data.length - 1)
        ret = h[k] >= data[idx] && h[k] < data[idx+1];
    else
        ret = h[k] >= data[data.length-1];
    return ret;
}

function hcpAnswerer(h, k, idx, data) { return k + "=" + h[k].toString(); }

function tagAnswerer(h, k, idx, data) {
    return hcpAnswerer(h, 'HCP', idx, data) + ", " + k + "=" + h[k].toString();
}

function ltcSelector(h, k, idx, data) {
    var ret = hcpAnswerer(h, 'HCP', idx, [13, 17, 21])
    if (ret) {
        if (idx < data.length - 1)
            ret = h[k] <= data[idx] && h[k] > data[idx+1];
        else
            ret = h[k] <= data[data.length-1];
    }
    return ret;
}

function selectOpen(board) {
    var bestHand = 0;
    var maxPt = 0;
    for (var i = 0; i < board.seats.length; ++i) {
        if (board.seats[i].HCP > maxPt) {
            maxPt = board.seats[i].HCP;
            bestHand = i;
        }
    }
    return bestHand;
}

function select2C(board) {
    return 0;
}
function handDescription(hand) {
    str = "HCP: " + hand.HCP.toString();
    str += ", DP: " + hand.DP.toString();
    str += ", LTC: " + hand.LTC.toString();
    if (hand.Balanced)
        str += ", Balanced"
    return str;
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