import { Constituent } from './Constituent';
import { Grammar } from './Grammar';

export class State {
    constituents: Array<Constituent>;
    validProductionCandidates: Array<[string, [number, number]]>;
    grammar: Grammar;
    constructor(constituents: string | Array<Constituent>, grammar: Grammar) {
        if (typeof constituents === 'string') {
            this.constituents = State.lex(constituents);
        } else {
            this.constituents = constituents;
        }
        this.grammar = grammar;
        this.validProductionCandidates = this.getValidProductionCandidates();
    }

    // hash function for the State class
    hash(): string {
        return this.constituents.map(constituent => constituent.hash()).join('');
    }

    // lexes a string into an array of Constituents
    private static lex(sentence: string) {
        return sentence.split(' ').map(word => new Constituent(word));
    }

    // yields all contiguous subsets of a given array of length n
    private static *subsets(arr: Array<unknown>, n: number): Generator<[Array<unknown>, [number, number]]> {
        for (let i = n; i > 0; i--) {
            for (let j = 0; j < arr.length; j++) {
                const s = (arr.slice(j, j + i));
                if (s.length === i) {
                    yield [s, [j, j + i]];
                } else {
                    break;
                }
            }
        }
    }

    // returns all the subset indices of the valid production candidates in the constituents array
    getValidProductionCandidates(): Array<[string, [number, number]]> {
        const validProductionCandidates = [];
        for (const [subset, [start, end]] of State.subsets(this.constituents, Math.min(this.constituents.length, 3))) {
            // checks if is an instance of Constituent
            const potentialProductionRule = subset.map(constituent => {
                if (constituent instanceof Constituent) {
                    return constituent.label;
                }
            }).join(' ');
            if (this.grammar.isValidProductionRule(potentialProductionRule)) {
                validProductionCandidates.push([potentialProductionRule, [start, end]]);
            }
        }
        return validProductionCandidates;
    }

    // returns a new State with the last valid production candidate rule applied
    applyLastValidProductionCandidate() {
        const [constituent, [start, end]] = this.validProductionCandidates.pop();
        const newHead = this.grammar.production_rules_map.get(constituent)[0];
        // makes a deep copy of the constituents array
        const newConstituents = this.constituents.map(constituent => constituent.copy());
        // replaces the constituents that were used to make the production rule with the new constituent
        newConstituents.splice(start, end - start, new Constituent(newHead, this.constituents.slice(start, end)));
        return new State(newConstituents, this.grammar);
    }

}