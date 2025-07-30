
function splayDispatch(choice) {
    var disp = document.getElementById("ListDisplay")
    clearContents(disp)
    var gridDisp = document.createElement("div");
    gridDisp.setAttribute("id", "SuitPlays");
    gridDisp.setAttribute("class", "SuitPlays");
    gridDisp.addEventListener('click', divKeyEvent)
    disp.appendChild(gridDisp);
    var sc = new SuitCombination(gridDisp);
    sc.init(choice.value);
    sc.plays();
}

class SuitCombination {
    static PlayLevels = {
        "Jack 1": {'Lack': [Card.Jack], 'Have': [Card.Ace, Card.King, Card.Queen], 'Dist': [3,6]},
        "Jack 2": {'Lack': [Card.Jack], 'Have': [Card.Ace, Card.King, Card.Queen], 'Dist': [3,5]},
        "Jack 3": {'Lack': [Card.Jack], 'Have': [Card.Ace, Card.King, Card.Queen], 'Dist': [4,4]},
        "Queen 1": {'Lack': [Card.Queen, (10-2)], 'Have': [Card.Ace, Card.King, Card.Jack], 'Dist': [3,6]},
        "Queen 2": {'Lack': [Card.Queen, (10-2)], 'Have': [Card.Ace, Card.King, Card.Jack], 'Dist': [3,5]},
        "Queen 3": {'Lack': [Card.Queen, (10-2)], 'Have': [Card.Ace, Card.King, Card.Jack], 'Dist': [4,4]},
        "Queen 4": {'Lack': [Card.Queen, (10-2)], 'Have': [Card.Ace, Card.King, Card.Jack], 'Dist': [3,4]},
        "AQ 1": {'Lack': [Card.Ace, Card.Queen], 'Have': [Card.King, Card.Jack, (10-2)], 'Dist': [4,5]},
        "AQ 2": {'Lack': [Card.Ace, Card.Queen], 'Have': [Card.King, Card.Jack, (10-2)], 'Dist': [4,4]},
        "4-4 1": {'Lack': [(10-2), Card.Queen], 'Have': [Card.Ace, Card.King, Card.Jack, (9-2)], 'Dist': [4,4]},
        "4-4 2": {'Lack': [Card.King, Card.Queen], 'Have': [Card.Ace, Card.Jack, (10-2), (9-2), (8-2)], 'Dist': [4,4]}
    }
    constructor(e) {
        this.disp = e;
    }
    init(k) {
        this.Key = k;
    }
    plays() {
        var params = SuitCombination.PlayLevels[this.Key];
        var declares = [[],[]];
        var cards = []
        for (let i = 0; i < params['Have'].length; ++i) {
            let which = Math.trunc(Math.random()*2) 
            if (declares[which].length >= params[which])
                which = 1 - which
            declares[which].push(params['Have'][i])
        }
        for (let i = 0; i <= Card.Ace; ++i)
            if (!(declares[0].includes(i) ||
                declares[1].includes(i) ||
                params['Lack'].includes(i)))
                cards.push(i);
        for (let j = 0; j < 2; ++j) {
            let start = declares[j].length;
            for (let i = start; i < params['Dist'][j]; ++i) {
                let idx = Math.trunc(Math.random()*cards.length)
                declares[j].push(cards[idx]);
                cards.splice(idx, 1);
            }
        }
        for (let i = 0; i < params['Lack'].length; ++i)
            cards.push(params['Lack'][i])
        this.showEx(declares, cards);
    }
    
    preamble(suit, d) {
        var txt = "If " + this.cardsToString(suit, []) + " is the trump suit. ";
        txt += 'how would you play with the following hand?<br>'
        var s = document.createElement('span')
        s.setAttribute('class', 'PreAmble');
        s.innerHTML = txt;
        d.appendChild(s)
        d.style['margin-top'] = '2vh';
        d.style['margin-left'] = '10vw';
        d.style['width'] = '30vw';
    }
    showEx(we, they) {
        var declareSide = ['N', 'S', 'Opponents'];
        var pickSuit = Math.trunc(Math.random()*4)
        var preambleDiv = document.createElement('div')
        preambleDiv.setAttribute('class', 'PreAmble')
        this.preamble(pickSuit, preambleDiv);
        this.disp.appendChild(preambleDiv);
        for (let i = 0; i < 2; ++i) {
            let d = document.createElement('div')
            d.setAttribute('class', 'DeclareSide')
            d.style['margin-top'] = '2vh';
            d.style['margin-left'] = '10vw';
            d.innerHTML = declareSide[i] + ': ' +this.cardsToString(pickSuit,we[i]);
            this.disp.appendChild(d)
        }
        var allComb = 0;
        var iComb = [];
        they.sort((x, y) => {return y - x;});
        var dropCount = 0;
        we.forEach(a => { a.forEach(x => { if (x > they[0]) ++dropCount;}); });
        for (let i = 0; i <= Math.trunc(they.length / 2); ++i) {
            let drop = 0;
            if (i > 0 && i <= dropCount)
                drop += i / they.length;
            if ((they.length - i) <= dropCount)
                drop += (they.length - i) / they.length
            iComb.push([this.nCombination(i, they.length), drop]);
            allComb += iComb[i][0];
        }
        var pDiv = document.createElement('div')
        pDiv.setAttribute('class', 'OppPerCent')
        pDiv.style['margin-top'] = '5vh';
        pDiv.style['margin-left'] = '10vw';
        pDiv.insertAdjacentHTML('beforeend',"Hint: " + they.length+'-card distributions.<br>');
        var dropPercent = 0;
        for (let i = 0; i <= Math.trunc(they.length / 2); ++i) {
            let s = i + '-' + (they.length - i) + ': ';
            let iPercent =iComb[i][0] / allComb;
            dropPercent += iComb[i][1] * iPercent;
            s += (iPercent * 100).toFixed(2);
            s += '%<br>';
            pDiv.insertAdjacentHTML('beforeend',s);
        }
        if (dropPercent >= 0.3)
            pDiv.insertAdjacentHTML('beforeend','Drop Probability: ' + (dropPercent*100).toFixed(2) + '%<br>');
        this.disp.appendChild(pDiv);
    }

    nCombination(i, n) {
        if (i == 0)
            return 1
        if (i == 1)
            return n;
        return this.fact(n) / (this.fact(i) * this.fact(n-i));
    }

    fact(n) {
        if (n <= 1)
            return n;
        return n * this.fact(n-1);
    }
    cardsToString(s, arr) {
        arr.sort((x, y) => {return y - x;});
        var suits = ['C','D','H','S'];
        var st = Card.ltr2html(suits[s])
        for (let i = 0; i < arr.length; ++i) {
            if (arr[i] >= Card.Jack)
                st += Card.Royals[arr[i]-Card.Jack];
            else
                st += (arr[i]+2).toString();
        }
        return st;
    }
}