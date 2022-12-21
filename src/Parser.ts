import { Grammar } from './Grammar';
import { State } from './State';
import { Constituent } from './Constituent';

export class Parser {
    private static prePercolate(s: State, g: Grammar): State {
        // for i = 0 to the length of the constituents array
        for (let i = 0; i < s.constituents.length; i++) {
            // get the constituent at index i
            const constituent = s.constituents[i];
            // if the constituent has a valid production rule
            if (g.isValidProductionRule(constituent.label)) {
                // get the new head of the constituent
                const newHead = g.production_rules_map.get(constituent.label)[0];
                // replace the constituent with a new constituent with the new head
                s.constituents[i] = new Constituent(newHead, [constituent]);
            }
        }
        return new State(s.constituents, g);
    }

    static getAllValidSyntaxTrees(sentence: string, grammar: Grammar, prePercolate = true): Array<Constituent> {
        // initialize state_zero with the sentence and the grammar, and pre-percolate it if necessary 
        const s0 = prePercolate ? Parser.prePercolate(new State(sentence, grammar), grammar) : new State(sentence, grammar);
        // initialize the stack with state_zero
        const Z = [s0];
        // initialize the list of valid syntax trees
        const validSyntaxTrees = [];
        // initialize the set of dead ends
        const deadEnds = new Set();
        // initialize the set of found trees
        const foundTrees = new Set();

        while (Z.length > 0) {
            // peek at the last element in the stack
            const s = Z[Z.length - 1];
            // if the state is not a dead end and has valid production candidates...
            if (!deadEnds.has(s.hash()) && s.validProductionCandidates.length > 0) {
                // get the next state by applying the last valid production candidate
                const s1 = s.applyLastValidProductionCandidate();
                // push the new state to the stack
                Z.push(s1);
                continue;
            } else if (s.constituents.length === 1 && s.constituents[0].label === grammar.startSymbol) {
                // if the state contains only one constituent, it is a valid syntax tree
                const validTree = s.constituents[0];
                // if the tree has not been found before, add it to the list of valid trees
                if (!foundTrees.has(validTree.hash())) {
                    validSyntaxTrees.push(validTree);
                    foundTrees.add(validTree.hash());
                }
            } else {
                // if the state is a dead end, add it to the list of dead ends
                deadEnds.add(s.hash());
            }
            // pop the last element from the stack
            Z.pop();

        }
        return validSyntaxTrees;
    }
}

// initialize a sentence
const sentence = 'the dog barks';

// initialize a grammar with the production rules and the start symbol 'S'
const grammar = new Grammar([['S', 'NP VP'], ['NP', 'Det N'], ['VP', 'V'], ['Det', 'the'], ['N', 'dog'], ['V', 'barks']], 'S');

// get all valid syntax trees for the sentence
const validSyntaxTrees = Parser.getAllValidSyntaxTrees(sentence, grammar);

// for each valid syntax tree, get the prettified string representation
validSyntaxTrees.forEach(tree => console.log(tree.prettyString()));