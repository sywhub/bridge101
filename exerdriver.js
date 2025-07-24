/*
 * Called from index.html to dispatch functionalities
 */
function exercies(choice) {
    var disp = document.getElementById("ListDisplay")
    clearContents(disp)
    var gridDisp = document.createElement("div");
    gridDisp.setAttribute("id", "PointExamples");
    gridDisp.setAttribute("class", "PointExamples");
    gridDisp.addEventListener('click', divKeyEvent)
    disp.appendChild(gridDisp)
    var ptDispatch = {'HCP': [hcpSelector, hcpAnswerer, [10, 15, 22]],
        'TP': [tpSelector, tagAnswerer, [10, 15, 22]]};
    if (choice.value in ptDispatch) {
        let d = new Deck;
        let board = new Board(d);
        ptExamples(gridDisp, choice.value, board, ptDispatch[choice.value]);
    } else if (['1x', '1NT', '2C', 'Preempt',
        '1M Reply', '1NT Reply', '2C Reply', '1m Reply', 'Preempt Reply'].includes(choice.value))
        bidExamples(gridDisp, choice.value);
}

function divKeyEvent(e) {
    var idx = 1
    while (idx <= 10) {
        var eAns = document.getElementById('Ans' + idx)
        if (eAns !== null) {
            if (eAns.style['visibility'] != 'hidden')
                ++idx
            else {
                eAns.style['visibility'] = 'visible';
                var eHint = document.getElementById('Hint' + idx)
                if (eHint)
                    eHint.style['visibility'] = 'visible';
                break
            }
        }
    }
}
