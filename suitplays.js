
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
    constructor(e) {
        this.disp = e;
    }
    init(k) {
        this.Key = Number(k.substring("Level ".length));
    }
    plays() {
        var levels = {
            1: {'Lack': [Card.Jack], 'Have': [Card.Ace, Card.King, Card.Queen], 'Dist': [3,6]},
            2: {'Lack': [Card.Queen, (10-2)], 'Have': [Card.Ace, Card.King, Card.Jack], 'Dist': [3,5]},
            3: {'Lack': [Card.Ace, Card.Queen], 'Have': [Card.King, Card.Jack, (10-2)], 'Dist': [4,5]},
            4: {'Lack': [Card.Ace, Card.Queen], 'Have': [Card.King, Card.Jack, (10-2)], 'Dist': [4,4]}
        }
        var declareSide = ['N', 'S', 'Opponents'];
        if (!(this.Key in levels))
            return;
        var params = levels[this.Key];
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
        var pickSuit = Math.trunc(Math.random()*4)
        this.disp.insertAdjacentHTML('beforeend', declareSide[0] + ': ' +this.cardsToString(pickSuit,declares[0]));
        this.disp.insertAdjacentHTML('beforeend', '<br>');
        this.disp.insertAdjacentHTML('beforeend', declareSide[1] + ': ' +this.cardsToString(pickSuit,declares[1]));
        this.disp.insertAdjacentHTML('beforeend', '<br>');
        this.disp.insertAdjacentHTML('beforeend', '<br>');
        this.disp.insertAdjacentHTML('beforeend', declareSide[2] + ': ' +this.cardsToString(pickSuit,cards));
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