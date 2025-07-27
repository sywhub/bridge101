/*
 * Simple functions to give hand evaluation exercies
 */
class HCP {
    constructor() { this.rangeTbl = [10, 15, 22]; }

    selector(h, idx) {
        var ret = false;
        if (idx < this.rangeTbl.length - 1)
            ret = h['HCP'] >= this.rangeTbl[idx] && h['HCP'] < this.rangeTbl[idx+1];
        else
            ret = h['HCP'] >= this.rangeTbl[this.rangeTbl.length-1];
        return ret;
    }

    answerer(h) { return 'HCP' + "=" + h['HCP'].toString(); }
}

class TP extends HCP {
    constructor() { super(); }
    selector(h, idx) {
        var ret = super.selector(h, idx);
        ret = ret && h['HCP'] < (h['TP'] - 4);
        return ret
    }

    answerer(h) {
        var s = super.answerer(h);
        s += ", DP=" + h['DP'].toString(); 
        s += ", TP=" + h['TP'].toString();
        return s;
    }
}

class PtEx extends Board {
    constructor(d, eDiv) {
        super(d);
        this.disp = eDiv;
    }
    run(k) {
        var ptObj = null;
        if (k == 'HCP')
            ptObj = new HCP();
        else if (k == 'TP')
            ptObj = new TP();
        else
            return;

        var idx = 1;
        var nCap = 10;
        var nExamples = nCap;
        while (nExamples > 0) {
            for (const h of this.seats) {
                if (ptObj.selector(h, Math.trunc(idx / (nCap / ptObj.rangeTbl.length)))) {
                    var item = gridElement(this.disp, idx.toString() + ":", 1, idx);
                    item.style["justify-self"] = "right";
                    gridElement(this.disp, h.toString(), 2, idx);
                    var ans = gridElement(this.disp, ptObj.answerer(h), 3, idx);
                    ans.setAttribute("id", "Ans"+idx);
                    ans.style['visibility'] = 'hidden';
                    --nExamples;
                    ++idx;
                }
                if (nExamples <= 0)
                    break
            }
            this.deal();
        }
    }
}


function ptExamples(eDiv, k) {
    var deck = new Deck;
    var ptExm = new PtEx(deck, eDiv);
    ptExm.run(k);
}
