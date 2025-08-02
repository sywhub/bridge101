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
    addNotes(e) {
        var d = document.createElement('div')
        d.setAttribute('class', 'Notes')
        d.innerHTML = 'HCP: Ace = 4, King = 3, Queen = 2, Jack = 1';
        e.parentNode.appendChild(d);
        return d;
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

    addNotes(e) {
        var d = super.addNotes(e);
        d.insertAdjacentHTML('beforeend','<br>');
        d.insertAdjacentHTML('beforeend','DP: Void = 5, Singleton = 3, Doubleton = 1, and 1 for each card longer than 4.<br>')
        d.insertAdjacentHTML('beforeend','TP = HCP + DP');
    }
    answerer(h) {
        var s = super.answerer(h);
        s += ", DP=" + h['DP'].toString(); 
        s += ", TP=" + h['TP'].toString();
        return s;
    }
}

class PtEx extends Board {
    static MenuItems = {'HCP': null, 'TP': null, '-': null};

    constructor(d, eDiv) {
        super(d);
        this.disp = eDiv;
        this.nCap = 10;
        if (PtEx.MenuItems.HCP == null)
            PtEx.MenuItems.HCP = new HCP();
        if (PtEx.MenuItems.TP == null)
            PtEx.MenuItems.TP = new TP();
    }

    run(k) {
        var ptObj = PtEx.MenuItems[k];
        var idx = 1;
        var nExamples = this.nCap;
        while (nExamples > 0) {
            for (const h of this.seats) {
                if (ptObj.selector(h, Math.trunc(idx / (this.nCap / ptObj.rangeTbl.length)))) {
                    var item = gridElement(this.disp, idx.toString() + ":", 1, idx);
                    item.setAttribute('class', 'Counter');
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
        ptObj.addNotes(this.disp);
    }
}


function ptExamples(eDiv, k) {
    var deck = new Deck;
    var ptExm = new PtEx(deck, eDiv);
    ptExm.run(k);
}
