#!/usr/bin/env python3
import random

def madeContracts(n):
    for i in range(n):
        level = random.randint(1,7)
        result = random.randint(-level-6, 7-level)
        double = random.random() < 0.4
        redouble = random.random() < 0.3
        contractStr = str(level)
        contractStr += ["NT", "\u2663", "\u2662", "\u2661", "\u2660"][random.randint(0,4)]
        if double:
            contractStr += 'X'
            if redouble:
                contractStr += 'X'
        outString = f'{contractStr:>8}, '
        outString += f'{["None", "NS", "EW", "Both"][random.randint(0, 3)] + " Vulnerable":>15}'
        outString += ", Declared by " + ['N', 'E', 'S', 'W'][random.randint(0,3)]
        outString += f', Result={result:+}'
        print(outString)

if __name__ == '__main__':
    madeContracts(30)
