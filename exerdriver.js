/*
 * Called from index.html to dispatch functionalities
 */
function bidExercies(parentDiv) {
    let l = document.createElement('label');
    l.innerHTML = 'Bid Practices: '
    l.setAttribute('for', 'BidExs')
    l.style['margin-left'] = "3em";
    parentDiv.appendChild(l)
    let sel = document.createElement('select');
    sel.setAttribute('id', 'BidExs');
    sel.style['font-family'] = 'inherit';
    sel.style['font-size'] = 'inherit';
    parentDiv.appendChild(sel);
    makeSelect(sel, ['HCP', 'TP', '-',
        '1x', '1NT', '2C', 'Preempt', '-',
        '1M Reply', '1NT Reply', '2C Reply', '1m Reply', 'Preempt Reply']);
    makeBut(parentDiv, sel.id, 'exercises');
}

function suitPlays(parentDiv) {
    let l = document.createElement('label');
    l.innerHTML = 'Suit Play: '
    l.setAttribute('for', 'SuitPlay')
    l.style['margin-left'] = "3em";
    parentDiv.appendChild(l)
    let sel = document.createElement('select');
    sel.setAttribute('id', 'SuitPlay');
    sel.style['font-family'] = 'inherit';
    sel.style['font-size'] = 'inherit';
    parentDiv.appendChild(sel);
    var opts = [];
    for (let i = 0; i < 20; ++i)
        opts.push('Level '+(i+1));
    makeSelect(sel, opts);
    makeBut(parentDiv, sel.id, 'splayDispatch');
}

function makeBut(parentDiv, selid, funcNama) {
    let e = document.createElement('input');
    e.setAttribute('type', 'button');
    e.setAttribute('value', 'Generate');
    e.setAttribute('onclick', funcNama+ '('+selid+')');
    e.style['font-family'] = 'inherit';
    e.style['font-size'] = 'inherit';
    e.style['margin-right'] = '10px';
    e.style['margin-left'] = '10px';
    parentDiv.appendChild(e)
}


function makeSelect(sel, optitems) {
    optitems.forEach(s => {
        let opt = document.createElement('option');
        opt.style['font-family'] = 'inherit';
        opt.style['font-size'] = 'inherit';
        if (s == '-') {
            opt.setAttribute('disabled', '');
            opt.setAttribute('value', '');
            opt.innerHTML = '&#x2500;'.repeat(4);
        } else {
            opt.setAttribute('value', s);
            opt.innerHTML = s;
        }
        sel.appendChild(opt);
    });
}

function exercises(choice) {
    var disp = document.getElementById("ListDisplay")
    clearContents(disp)
    var gridDisp = document.createElement("div");
    gridDisp.setAttribute("id", "PointExamples");
    gridDisp.setAttribute("class", "PointExamples");
    gridDisp.addEventListener('click', divKeyEvent)
    disp.appendChild(gridDisp);
    if (['HCP', 'TP'].includes(choice.value))
        ptExamples(gridDisp, choice.value);
    else if (['1x', '1NT', '2C', 'Preempt',
        '1M Reply', '1NT Reply', '2C Reply', '1m Reply', 'Preempt Reply'].includes(choice.value))
        bidExamples(gridDisp, choice.value);
}


/*
 * Event listener
 */
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
