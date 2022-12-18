import { Grammar } from './Grammar';
import { State } from './State';
import { Constituent } from './Constituent';

export class Parser {
    static getAllValidSyntaxTrees(sentence: string, grammar: Grammar): Array<Constituent> {
        const s0 = new State(sentence, grammar);
        const Z = [s0];
        const validSyntaxTrees = [];
        const deadEnds = new Set();
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
            } else if (s.constituents.length === 1) {
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

const sentence = 'the dog barks and the cat meows or the dog meows';
const grammar = new Grammar([['S', 'NP VP'], ['NP', 'Det N'], ['VP', 'V'], ['Det', 'the'], ['N', 'dog'], ['N', 'cat'], ['V', 'barks'], ['V', 'meows'], ['S', 'S coord S'], ['coord', 'and'], ['coord', 'or']], 'S');
const allValidSyntaxTrees = Parser.getAllValidSyntaxTrees(sentence, grammar);
console.log(`sentence: ${sentence}`);
// pretty print the syntax trees
allValidSyntaxTrees.forEach(tree => console.log(tree.prettyString()));