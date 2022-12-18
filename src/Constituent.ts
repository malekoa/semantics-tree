export class Constituent {
    label: string;
    children: Array<Constituent>;
    constructor(label: string, children: Array<Constituent> = []) {
        this.label = label;
        this.children = children;
    }

    // hash function for the Constituent class
    hash(): string {
        return this.label + this.children.map(child => child.hash()).join('');
    }

    // returns a copy of the constituent
    copy() {
        return new Constituent(this.label, this.children.map(child => child.copy()));
    }

    // Returns a prettified string representation of the node.
    prettyString() {
        if (this.children.length === 0) {
            return `[${this.label}]`;
        } else {
            return `[${this.label} ${this.children.map(child => child.prettyString()).join(' ')}]`;
        }
    }
}