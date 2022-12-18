# Semantics Tree

## Goal

A user should be able to define a grammar $G$ in Backus-Naur form and a model $M = \langle D, i \rangle$ where $D$ is the domain and $i$ is the interpretation function.

The user should then be able to define a parser $P$ that takes a grammar and a sentence $S$ and produces all valid syntax trees for $S$.

Finally, the user should be able to define a semantic analyzer that takes all the valid syntax trees for $S$ that were generated as well as the model $M$, and applies a semantic value to each constituent node in each tree.

## Constituent

Tree data structure. A constituent consists of a label and an array of child constituents.

## Grammar

### Production Rules
Say we define a grammar with the following production rules:

$$ S \to NP \enspace VP $$
$$ NP \to Det \enspace N' $$
$$ VP \to V_i $$

These production rules can be rewritten as an array of 2-tuples:

```ts
let production_rules: Array<[string, string]> = [['S', 'NP VP'], ['NP', 'Det N\''], ['VP', 'V_i']];
```

This set of production rules can then be fed to the Grammar class which produces a hashmap with the right-hand side of the production rules as map keys and the left-hand side of the production rules as values. 

### Start Symbol

Assuming the production rules that were defined above are being used, the relevant starting symbol would be `'S'`. To define a grammar that uses the above production rules and the starting symbol `'S'`:

```ts
let G = Grammar(production_rules, 'S');
```

## State

Takes a string and lexes it into an array of `Constituent` element or an array of `Constituent` nodes, as well as a `Grammar`.

```ts
// create a new state using a string
const s = new State('the cat meows', grammar);

// or create a new state using an array of Constituents
const constituents = [new Constituent('the'), new Constituent('cat'), new Constituent('meows')];
const s = new State(constituents, grammar);
```

On creation, builds an array of all valid production rules that can be applied to it. Used to build the parser's search tree.