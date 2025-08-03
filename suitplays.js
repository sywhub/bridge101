/*
 * Basic suit combination trainings
 */
// Button onclick function
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

// Simple class for suit combination training
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

    constructor(e) { this.disp = e; }
    init(k) { this.Key = k; }

    /*
     * Randomly populate N's and S's hands with what mandated to have.
     * Then fill up the hand's length with random cards, except for those reserved for oppoenents.
     */
    plays() {
        var params = SuitCombination.PlayLevels[this.Key];
        var sides = [[],[],[]]; // hold declarer's side hands
        var leftover = [];

        // Go through a deck and separate cards into 4 piles
        // North, South, Opponents, and the rest
        for (let i = 0; i <= Card.Ace; ++i) {
            if (params['Lack'].includes(i)) {
                sides[2].push(i);
            } else if (params['Have'].includes(i)) {
                let which = Math.trunc(Math.random()*2); // N or S
                if (sides[which].length >= params.Dist[which])
                    which = 1 - which;
                sides[which].push(i);
            } else {
                leftover.push(i);
            }
        }

        // Now divide up the leftover among the previous 3 piles using shuffle and direct assignment
        params.Dist.push(13 - params.Dist[0] - params.Dist[1]);
        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        shuffle(leftover);
        let idx = 0;
        for (let side = 0; side < 3; ++side) {
            let slots = params.Dist[side] - sides[side].length;
            if (slots > 0) {
                sides[side].push(...leftover.slice(idx, idx + slots));
                idx += slots;
            }
        }
        this.showEx(sides);
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
    
    // Display cards, compute stats
    showEx(sides) {
        var declareSide = ['N', 'S', 'Opponents'];
        var pickSuit = Math.trunc(Math.random()*4); // pick a random suit
        var preambleDiv = document.createElement('div')
        preambleDiv.setAttribute('class', 'PreAmble')
        this.preamble(pickSuit, preambleDiv);
        this.disp.appendChild(preambleDiv);
        // display 3 piles: N, S, and opponents
        for (let i = 0; i < 3; ++i) {
            let d = document.createElement('div')
            d.setAttribute('class', 'DeclareSide')
            d.style['margin-top'] = '2vh';
            d.style['margin-left'] = '10vw';
            d.innerHTML = declareSide[i] + ': ' +this.cardsToString(pickSuit, sides[i]);
            this.disp.appendChild(d)
        }
        
        // compute probabilities
        // The distribution and likelihood of dropping the high card
        var allComb = 0;
        var iComb = [];
        var dropCount = 0;
        // How many cards we have that can be used to drop opponent's high card?
        for (let i = 0; i < 2; ++i)
            sides[i].forEach(x => { if (x > sides[2][0]) ++dropCount;});

        // compute distribution and drop probabilty together
        // Distribution is up to half of the remaining cards
        for (let i = 0; i <= Math.trunc(sides[2].length / 2); ++i) {
            let drop = 0;
            if (i > 0 && i <= dropCount)    // we can drop it
                drop += i / sides[2].length;
            if ((sides[2].length - i) <= dropCount)
                drop += (sides[2].length - i) / sides[2].length
            // C(m,n) formula.  JS should provide natively
            // drop probability of this specific distribution
            iComb.push([this.nCombination(i, sides[2].length), drop]);
            allComb += iComb[i][0];
        }
        var pDiv = document.createElement('div')
        pDiv.setAttribute('class', 'Notes')
        pDiv.insertAdjacentHTML('beforeend',"Hint: " + sides[2].length+'-card distributions.<br>');
        var dropPercent = 0;
        for (let i = 0; i <= Math.trunc(sides[2].length / 2); ++i) {
            let s = i + '-' + (sides[2].length - i) + ': ';
            let iPercent =iComb[i][0] / allComb;
            dropPercent += iComb[i][1] * iPercent;  // sumproduct of each distribution
            s += (iPercent * 100).toFixed(2);
            s += '%<br>';
            pDiv.insertAdjacentHTML('beforeend',s);
        }
        // Not interesting to show too low probability
        if (dropPercent >= 0.3)
            pDiv.insertAdjacentHTML('beforeend','Drop Probability: ' + (dropPercent*100).toFixed(2) + '%<br>');
        this.disp.appendChild(pDiv);
    }

    // Direct binomial coefficient for efficiency and clarity
    nCombination(k, n) {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;
        let res = 1;
        for (let i = 1; i <= k; ++i) {
            res *= (n - i + 1) / i;
        }
        return res;
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