export type Difficulty = "easy" | "medium" | "hard";

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// same number addition
function sameNumberAddition(n: number): number[] {
    const start = randInt(10, 50);
    const add = randInt(2, 10);
    const seq = [start];
    for (let i = 1; i < n; i++) {
        seq.push(seq[i - 1] + add);
    }
    return seq;
}

// increasing order addition
function increasingAddition(n: number): number[] {
    let val = randInt(50, 999);
    let add = randInt(20, 99);
    const seq = [val];
    for (let i = 1; i < n; i++) {
        val += add;
        add++;
        seq.push(val);
    }
    return seq;
}

// same number subtraction
function sameNumberSubtraction(n: number): number[] {
    const start = randInt(50, 999);
    const add = randInt(20, 99);
    const seq = [start];
    for (let i = 1; i < n; i++) {
        seq.push(seq[i - 1] + add);
    }
    return seq.reverse();
}

// increasing order subtraction
function increasingSubtraction(n: number): number[] {
    let start = randInt(50, 999);
    let add = randInt(20, 99);
    const seq = [start];
    for (let i = 1; i < n; i++) {
        start += add;
        add++;
        seq.push(start);
    }
    return seq.reverse();
}

// same number multiplication
function sameMultiplication(n: number): number[] {
    const start = randInt(2, 30);
    const mul = randInt(2, 8);
    return Array.from({ length: n }, (_, i) => start * Math.pow(mul, i));
}

// multiplication series in incr order
function increasingMultiplication(n: number): number[] {
    let val = randInt(2, 20);
    let mul = randInt(1, 8);
    const seq = [val];
    for (let i = 1; i < n; i++) {
        val *= mul;
        mul++;
        seq.push(val);
    }
    return seq;
}

// same number division
function sameDivision(n: number): number[] {
    const start = randInt(2, 30);
    const div = randInt(2, 8);
    const seq = [start];
    for (let i = 1; i < n; i++) {
        seq.push(seq[i - 1] * div);
    }
    return seq.reverse();
}

// division in incr order
function increasingDivision(n: number): number[] {
    let start = randInt(2, 30);
    let mul = randInt(2, 5);
    const seq = [start];
    for (let i = 1; i < n; i++) {
        start *= mul;
        mul++;
        seq.push(start);
    }
    return seq.reverse();
}

// same mul and same add
function sameMulSameAdd(n: number): number[] {
    let value = randInt(2, 20);
    const mul = randInt(2, 5);
    const add = randInt(1, 9);
    const seq = [value];
    for (let i = 1; i < n; i++) {
        value = value * mul + add;
        seq.push(value);
    }
    return seq;
}

// same mul and inc add
function sameMulIncreasingAdd(n: number): number[] {
    let value = randInt(2, 20);
    const mul = randInt(2, 5);
    let add = randInt(1, 9);
    const seq = [value];
    for (let i = 1; i < n; i++) {
        value = value * mul + add;
        add++;
        seq.push(value);
    }
    return seq;
}

// incr mul and same add
function increasingMulSameAdd(n: number): number[] {
    let value = randInt(1, 20);
    let mul = randInt(1, 4);
    const add = randInt(1, 9);
    const seq = [value];
    for (let i = 1; i < n; i++) {
        value = value * mul + add;
        mul++;
        seq.push(value);
    }
    return seq;
}

// inc mul and inc add
function increasingMulIncreasingAdd(n: number): number[] {
    let value = randInt(1, 6);
    let mul = randInt(1, 4);
    let add = randInt(1, 9);
    const seq = [value];
    for (let i = 1; i < n; i++) {
        value = value * mul + add;
        mul++;
        add++;
        seq.push(value);
    }
    return seq;
}

// same mul and same sub
function sameMulSameSub(n: number): number[] {
    let value = randInt(5, 20);
    const mul = randInt(1, 4);
    const sub = randInt(1, 9);
    const seq = [value];
    for (let i = 1; i < n; i++) {
        value = value * mul - sub;
        seq.push(value);
    }
    return seq;
}

// same mul and inc sub
function sameMulIncreasingSub(n: number): number[] {
    let value = randInt(5, 20);
    const mul = randInt(1, 4);
    let sub = randInt(1, 9);
    const seq = [value];
    for (let i = 1; i < n; i++) {
        value = value * mul - sub;
        sub++;
        seq.push(value);
    }
    return seq;
}

// inc mul and same sub
function increasingMulSameSub(n: number): number[] {
    let value = randInt(5, 20);
    let mul = randInt(1, 4);
    const sub = randInt(1, 10);
    const seq = [value];
    for (let i = 1; i < n; i++) {
        value = value * mul - sub;
        mul++;
        seq.push(value);
    }
    return seq;
}

// inc mul and inc sub
function increasingMulIncreasingSub(n: number): number[] {
    let value = randInt(5, 20);
    let mul = randInt(2, 3);
    let sub = randInt(1, 4);
    const seq = [value];
    for (let i = 1; i < n; i++) {
        value = value * mul - sub;
        mul++;
        sub++;
        seq.push(value);
    }
    return seq;
}

// square
function squareSeries(n: number): number[] {
    const start = randInt(3, 20);
    return Array.from({ length: n }, (_, i) => (start + i) ** 2);
}

// cube
function cubeSeries(n: number): number[] {
    const start = randInt(3, 7);
    return Array.from({ length: n }, (_, i) => (start + i) ** 3);
}

// square addition
function squareAdditionSeries(n: number): number[] {
    let value = randInt(5, 30);
    let k = randInt(1, 5);
    const seq = [value];
    for (let i = 1; i < n; i++) {
        value += k * k;
        k++;
        seq.push(value);
    }
    return seq;
}

// cube addition
function cubeAdditionSeries(n: number): number[] {
    let value = randInt(5, 30);
    let k = randInt(1, 5);
    const seq = [value];
    for (let i = 1; i < n; i++) {
        value += k * k * k;
        k++;
        seq.push(value);
    }
    return seq;
}

// mixed
function mixedCombinationSeries(n: number): number[] {
    let oddValue = randInt(5, 20);
    let evenValue = randInt(4, 10);
    const oddStep = randInt(2, 6);
    const evenMul = randInt(2, 3);
    const seq: number[] = [];
    for (let i = 0; i < n; i++) {
        if (i % 2 === 0) {
            seq.push(oddValue);
            oddValue += oddStep;
        } else {
            seq.push(evenValue);
            evenValue *= evenMul;
        }
    }
    return seq;
}

const EASY_FUNCTIONS: ((n: number) => number[])[] = [
    sameNumberAddition,
    increasingAddition,
    sameNumberSubtraction,
    increasingSubtraction,
    sameMultiplication,
    sameDivision,
    squareSeries,
];

const MEDIUM_FUNCTIONS: ((n: number) => number[])[] = [
    increasingMultiplication,
    increasingDivision,
    sameMulSameAdd,
    sameMulIncreasingAdd,
    sameMulSameSub,
    sameMulIncreasingSub,
    squareAdditionSeries,
    cubeSeries,
];

const HARD_FUNCTIONS: ((n: number) => number[])[] = [
    increasingMulSameAdd,
    increasingMulIncreasingAdd,
    increasingMulSameSub,
    increasingMulIncreasingSub,
    mixedCombinationSeries,
    cubeAdditionSeries,
];

function weightedPick(weightMap: Record<string, number>): string {
    const rand = Math.random();
    let cumulative = 0;
    for (const [key, weight] of Object.entries(weightMap)) {
        cumulative += weight;
        if (rand < cumulative) {
            return key;
        }
    }
    return Object.keys(weightMap)[0];
}

export function generateSequenceByDifficulty(difficulty: Difficulty, n: number): number[] {
    let category: string;

    if (difficulty === "easy") {
        category = weightedPick({
            easy: 0.8,
            medium: 0.2,
        });
    } else if (difficulty === "medium") {
        category = weightedPick({
            easy: 0.2,
            medium: 0.6,
            hard: 0.2,
        });
    } else {
        category = weightedPick({
            easy: 0.1,
            medium: 0.2,
            hard: 0.7,
        });
    }

    let pool: ((n: number) => number[])[];
    if (category === "easy") pool = EASY_FUNCTIONS;
    else if (category === "medium") pool = MEDIUM_FUNCTIONS;
    else pool = HARD_FUNCTIONS;

    const generator = pool[randInt(0, pool.length - 1)];
    return generator(n);
}

export interface SequenceQuestion {
    question: number[];
    answer: number;
}

export function createSequenceQuestion(difficulty: Difficulty, length: number = 5): SequenceQuestion {
    const seq = generateSequenceByDifficulty(difficulty, length);
    const question = seq.slice(0, -1);
    const answer = seq[seq.length - 1];
    return { question, answer };
}