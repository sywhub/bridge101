/*
 * Called from index.html to dispatch functionalities
 */
function topControls(parentDiv) {
    parentDiv.innerHTML = '<h2>Bridge Exercises</h2>';
    parentDiv.insertAdjacentHTML('beforeend',
        'Select the exercises you want to practice, then click "Go".<br>');
    parentDiv.insertAdjacentHTML('beforeend',
        'For "Bid Practices", click on the items in the list to see the answers.');
    var e= document.createElement('div');
    e.setAttribute('id', 'TopControls');
    e.setAttribute('class', 'TopControls');
    parentDiv.appendChild(e);
    var openOpts = [];
    for (const k of Object.keys(PtEx.MenuItems))
        openOpts.push(k);
    for (const k of Object.keys(BidEx.MenuItems))
        openOpts.push(k);
    var sel = makeSelect(e, 'Bid Practices: ', 'BidExs', openOpts)
    makeBut(e, sel.id, 'exercises');

    var opts = [];
    for (const k of Object.keys(SuitCombination.PlayLevels))
        opts.push(k);
    var sel = makeSelect(e, 'Suit Play: ', 'SuitPlay', opts);
    makeBut(e, sel.id, 'splayDispatch');
}

function makeBut(parentDiv, selid, funcNama) {
    let e = document.createElement('input');
    e.setAttribute('type', 'button');
    e.setAttribute('value', 'Go');
    e.setAttribute('onclick', funcNama+ '('+selid+')');
    e.setAttribute('class', 'GoButton');
    parentDiv.appendChild(e)
}


function makeSelect(parentDiv, lTxt, selId, optitems) {
    var l = document.createElement('label');
    l.innerHTML = lTxt;
    l.setAttribute('for', selId)
    l.style['margin-left'] = "3em";
    parentDiv.appendChild(l)
    var sel = document.createElement('select');
    sel.setAttribute('id', selId);
    parentDiv.appendChild(sel);
    optitems.forEach(s => {
        let opt = document.createElement('option');
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
    return sel;
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
