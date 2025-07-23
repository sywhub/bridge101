/*
 * Generating examples for bidding exercises
 */
class BidEx extends Qualifier {
    MenuItems = [
        {'Name': 'Open', 'Cases': [{"BidSeq":[]}]},
        {'Name': '1M Reply', 'Cases': [{"BidSeq":['1S', '-']},{"BidSeq":['1H', '-']}]},
        {'Name': '1NT Reply', 'Cases': [{"BidSeq":['1NT', '-']}]},
        {'Name': '2C Reply', 'Cases': [{"BidSeq":['2C', '-']}]},
        {'Name': '1m Reply', 'Cases': [{"BidSeq":['1D', '-']},{"BidSeq":['1C', '-']}]},
        {'Name': 'Preempt Reply', 'Cases': [{"BidSeq":['2S', '-']},
            {"BidSeq":['2H', '-']}, {"BidSeq":['2D', '-']}]}
        ];
    constructor() {super();}
    init(e) {
        clearContents(e);
        e.style['grid-template-columns'] = "3vw 17vw 8vw 50vw";
        this.nCap = 10;
        this.disp = e;
    }

    run(k) {
        var nExamples = this.nCap;
        var idx = 1;
        while (nExamples > 0) {
            var found = this.select(k);
            if (found && found.RetStatus) {
                let item = gridElement(this.disp, idx.toString() + ":", 1, idx);
                item.style["justify-self"] = "right";
                gridElement(this.disp, this.BridgeBoard.seats[found.Seat].toString(), 2, idx);
                let hintStr = ''
                if ('BidSeq' in found)
                    hintStr = this.seqString(found['BidSeq']) + " "
                hintStr += this.htmlBid(found.Bid)
                let hint = gridElement(this.disp, hintStr, 3, idx)
                hint.setAttribute('id', "Hint"+idx)
                hint.style['visibility'] = 'hidden';
                let ansText = this.handDescription(this.BridgeBoard.seats[found.Seat]);
                let ans = gridElement(this.disp, ansText, 4, idx);
                ans.setAttribute("id", "Ans"+idx);
                ans.style['visibility'] = 'hidden';
                --nExamples;
                ++idx;
            }
        }
    }

    select(k) {
        // Keys are the selection string in index.html
        var openIdx = {'1x': ['1S', '1H', '1D', '1C'],
            '1NT': ['1NT'], '2C': ['2C'], 'Preempt': ['2S', '2H', '2D', '3C', '3S', '3H', '3D']}

        if (!(k in openIdx)) 
            return this.selectElse(k);

        var pItem = this.MenuItems[0]['Cases'][0];
        var found = this.findQualifiedBoard(pItem);
        if (found && found.RetStatus && openIdx[k].includes(found.Bid)) {
            // system allows, but we are teaching beginners. don't confuse them.
            let noNovice = k != '1NT' || this.BridgeBoard.seats[found.Seat].HCP >= 15;
            noNovice = noNovice && (k != '1x' || this.BridgeBoard.seats[found.Seat].HCP >= 12);
            noNovice = noNovice && (k != '2C' || this.BridgeBoard.seats[found.Seat].HCP >= 22);
            if (!noNovice)
                found = null;
        } else
            found = null;
        return found;
    }

    selectElse(k) {
        var found = null;
        var pItem;
        for (const m of this.MenuItems)
            if (m['Name'] == k) {
                pItem = m['Cases'][Math.trunc(Math.random() * m.Cases.length)];
                found = this.findQualifiedBoard(pItem);
                if (found && found.RetStatus)
                    break
            }
        if (found && found.RetStatus)
            found['BidSeq'] = pItem['BidSeq'];
        else
            found = null;
        return found;
    }

    handDescription(hand) {
        var str = "HCP: " + hand.HCP.toString();
        str += ", DP: " + hand.DP.toString();
        str += ", LTC: " + hand.LTC.toString();
        if (hand.Balanced)
            str += ", Balanced"
        return str;
    }

}

function bidExamples(eDiv, k) {
    var exer = new BidEx();
    exer.init(eDiv);
    exer.run(k)
}
