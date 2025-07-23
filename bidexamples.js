/*
 * Generating examples for bidding exercises
 */
class BidEx extends Qualifier {
    MenuItems = [
        {'Name': 'Open', 'Cases': [{"BidSeq":[]}]}
    ];
    constructor() {super();}
    init(e) {
        clearContents(e);
        e.style['grid-template-columns'] = "3vw 20vw 5vw 50vw";
        this.nCap = 10;
        this.disp = e;
    }

    run(k) {
        var nExamples = this.nCap;
        var idx = 1;
        while (nExamples > 0) {
            var found = this.selectOpen(k);
            if (found && found.RetStatus) {
                let item = gridElement(this.disp, idx.toString() + ":", 1, idx);
                item.style["justify-self"] = "right";
                gridElement(this.disp, this.BridgeBoard.seats[found.Seat].toString(), 2, idx);
                let hint = gridElement(this.disp, this.htmlBid(found.Bid), 3, idx)
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
        this.disp.addEventListener('click', (e) => {divKeyEvent(e)})
    }

    selectOpen(k) {
        // Keys are the selection string in index.html
        var openIdx = {'1x': ['1S', '1H', '1D', '1C'],
            '1NT': ['1NT'], '2C': ['2C'],
            'Preempt': ['2S', '2H', '2D', '3C', '3S', '3H', '3D']}

        if (!(k in openIdx))    // what!?!?
            return null;

        var pItem = this.MenuItems[0]['Cases'][0];
        var found = this.findQualifiedBoard(pItem);
        if (found && found.RetStatus && openIdx[k].includes(found.Bid))
            if ((k != '1NT' && k != '1x') || found.Seat <= 1)
                return found;
        return null;
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

