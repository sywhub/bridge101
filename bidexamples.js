
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
