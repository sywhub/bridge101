/*
 * Generating examples for bidding exercises
 */
class BidEx extends Qualifier {
    static MenuItems = {
        '1x': {"BidSeq":[], 'Expects': ['1S', '1H', '1D', '1C'], 'Novice': 12},
        '1NT': {"BidSeq":[], 'Expects': ['1NT'], 'Novice': 15},
        '2C': {"BidSeq":[], 'Expects': ['2C'], 'Novice': 22},
        'Preempt': {"BidSeq":[], 'Expects': ['2S', '2H', '2D', '3C', '3S', '3H', '3D']},
        '-': null,  // divider
        '1M Reply': [{"BidSeq":['1S', '-']},{"BidSeq":['1H', '-']}],
        '1m Reply': [{"BidSeq":['1D', '-']},{"BidSeq":['1C', '-']}],
        '1NT Reply': {"BidSeq":['1NT', '-']},
        'Preempt Reply': [{"BidSeq":['2S', '-']},
            {"BidSeq":['2H', '-']}, {"BidSeq":['2D', '-']}],
        '2C Reply': {"BidSeq":['2C', '-']}
    };
    constructor() {super();}
    init(e) {
        clearContents(e);
        e.style['grid-template-columns'] = "2vw 30vw 6vw 4vw 35vw";
        this.nCap = 10;
        this.disp = e;
    }

    /* Generate display items */
    run(k) {
        var nExamples = this.nCap;
        var idx = 1;
        while (nExamples > 0) {
            var pItem = this.pickPItem(k, nExamples == this.nCap);
            // workhorse function to pick what/whether to display
            var found = this.select(pItem);
            if (found && found.RetStatus) {
                const seat = this.BridgeBoard.seats[found.Seat];
                const seatStr = seat.toString();
                const ansText = this.handDescription(seat);
                let item = gridElement(this.disp, idx.toString() + ":", 1, idx);
                item.setAttribute('class', 'Counter');
                gridElement(this.disp, seatStr, 2, idx);
                if ('BidSeq' in found)
                    gridElement(this.disp, this.seqString(found['BidSeq']), 3, idx);
                else
                    gridElement(this.disp, '&nbsp;', 3, idx);
                let hint = gridElement(this.disp, this.htmlBid(found.Bid), 4, idx)
                hint.setAttribute('id', "Hint"+idx)
                hint.style['visibility'] = 'hidden';
                let ans = gridElement(this.disp, ansText, 5, idx);
                ans.setAttribute("id", "Ans"+idx);
                ans.style['visibility'] = 'hidden';
                --nExamples;
                ++idx;
            }
        }
    }

    // Pick one from the mneu and setup the cache to "spread" the bids
    pickPItem(k, newSpread) {
        var pItem = BidEx.MenuItems[k];
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

// onclick function
function bidExamples(eDiv, k) {
    var exer = new BidEx();
    exer.init(eDiv);
    exer.run(k)
}
