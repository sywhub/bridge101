/*
 * Simple functions to give hand evaluation exercies
 */
function ptExamples(eDiv, k, board, funcTbl) {
    var idx = 1;
    var nCap = 10;
    var nExamples = nCap;
    while (nExamples > 0) {
        board.deal();
        for (const h of board.seats) {
            if (funcTbl[0](h, k, Math.trunc(idx / (nCap / funcTbl[2].length)), funcTbl[2])) {
                var item = gridElement(eDiv, idx.toString() + ":", 1, idx);
                item.style["justify-self"] = "right";
                gridElement(eDiv, h.toString(), 2, idx);
                var ans = gridElement(eDiv, funcTbl[1](h, k, idx, funcTbl[2]), 3, idx);
                ans.setAttribute("id", "Ans"+idx);
                ans.style['visibility'] = 'hidden';
                --nExamples;
                ++idx;
            }
            if (nExamples <= 0)
                break
        }
    }
}


function dpSelector(h, k, idx, data) {
    var ret = hcpSelector(h, k, idx, data);
    ret = ret && h['HCP'] < (h['DP'] - 4);
    return ret
}

function hcpSelector(h, k, idx, data) {
    var ret = false;
    if (idx < data.length - 1)
        ret = h[k] >= data[idx] && h[k] < data[idx+1];
    else
        ret = h[k] >= data[data.length-1];
    return ret;
}

function hcpAnswerer(h, k, idx, data) { return k + "=" + h[k].toString(); }

function tagAnswerer(h, k, idx, data) {
    return hcpAnswerer(h, 'HCP', idx, data) + ", " + k + "=" + h[k].toString();
}

function ltcSelector(h, k, idx, data) {
    var ret = hcpAnswerer(h, 'HCP', idx, [13, 17, 21])
    if (ret) {
        if (idx < data.length - 1)
            ret = h[k] <= data[idx] && h[k] > data[idx+1];
        else
            ret = h[k] <= data[data.length-1];
    }
    return ret;
} 
