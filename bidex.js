/*
 * Generating examples for bidding exercises
 */
class BidExer extends Qualifier {
    static MenuItems = {
        '1 Major': {"BidSeq":[], 'Expects': ['1S', '1H' ], 'Novice': 12},
        '1 Minor': {"BidSeq":[], 'Expects': ['1D', '1C'], 'Novice': 12},
        '1NT': {"BidSeq":[], 'Expects': ['1NT'], 'Novice': 15},
        '2C': {"BidSeq":[], 'Expects': ['2C'], 'Novice': 22},
        'Preempt': {"BidSeq":[], 'Expects': ['2S', '2H', '2D', '3C', '3S', '3H', '3D']},
    };
    constructor() {super();}
    init(e) {
        e.style['grid-template-columns'] = "30vw 30vw";
        this.nCap = 10;
        this.disp = e;
    }

    /* Generate display items */
    run() {
        var nExamples = this.nCap;
        this.Examples = [];
        while (nExamples > 0) {
            var pItem = this.pickPItem(this.choice, nExamples == this.nCap);
            // workhorse function to pick what/whether to display
            var found = this.select(pItem);
            if (found && found.RetStatus) {
                let bd = this.BridgeBoard.seats;
                this.Examples.push({N: bd[found.Seat].toString(), S: bd[this.roundSeat(found.Seat+1)].toString()})
                --nExamples;
            }
        }
        this.ExIdx = 0;
        oneExample(null)
    }

    // Pick one from the mneu and setup the cache to "spread" the bids
    pickPItem(k, newSpread) {
        var pItem = BidExer.MenuItems[k];
        // if there are multple, pick a random one
        if (Array.isArray(pItem)) {
            pItem = pItem[Math.trunc(Math.random() * pItem.length)];
            newSpread = !('Spreads' in pItem);  // not done yet
        }
        if (newSpread)
            this.newSpread(pItem);
        return pItem;
    }

    // reset the bid cache using Set for efficiency
    newSpread(pItem) {
        if ('Expects' in pItem)
            pItem.Spreads = new Set(pItem.Expects);
        else {
            this.cacheQualifiers(pItem);
            pItem.Spreads = new Set();
            for (const q of pItem.Qualifier[pItem.Qualifier.length-1])
                pItem.Spreads.add(q.Bid);
        }
    }

    // decide whether/what to display
    select(pItem) {
        // pItem must be an object with "BidSeq" key
        var found = this.findQualifiedBoard(pItem);

        if (!found || !found.RetStatus)
            return null;
        if (!pItem.Spreads.has(found.Bid))
            return null;
        if ('Novice' in pItem && this.BridgeBoard.seats[found.Seat].HCP < pItem.Novice)
            return null;

        if (pItem.BidSeq.length > 0)
            found['BidSeq'] = pItem['BidSeq'];

        // not to pick the same bid again this round
        // except when we are all out, then repeat
        pItem.Spreads.delete(found.Bid);
        if (pItem.Spreads.size <= 0)
            this.newSpread(pItem);

        return found;
    }

    handDescription(hand) {
        var str = "HCP=" + hand.HCP.toString() +
             ", TP=" + hand.TP.toString();
        if (hand.Balanced)
            str += ", Balanced"
        return str;
    }

}

function BidExercises(choice) {
    var disp = document.getElementById("ListDisplay")
    if (exer == null)
        exer = new BidExer();
    exer.init(disp);
    exer.choice = choice.value;
    exer.run();
}

function oneExample(e) {
    var disp = document.getElementById("ListDisplay")
    clearContents(disp);
    disp.innerHTML = 'Given the hands below, opponents all pass. How would the bidding proceed?'
    gridElement(disp, '&nbsp;', 1, 1);
    if (exer.ExIdx < exer.Examples.length) {
        gridElement(disp, `North: ${exer.Examples[exer.ExIdx].N}`, 1, 2);
        gridElement(disp, `South: ${exer.Examples[exer.ExIdx].S}`, 2, 2);
        exer.ExIdx++;
    } else
        exer.run();

}