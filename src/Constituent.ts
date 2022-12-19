export class Constituent {
    label: string;
    children: Array<Constituent>;
    data: null | string;
    constructor(label: string, children: Array<Constituent> = [], data: null | string = null) {
        this.label = label;
        this.children = children;
        this.data = data;
    }

    // hash function for the Constituent class
    hash(): string {
        return this.label + this.children.map(child => child.hash()).join('');
    }

    // returns a copy of the constituent
    copy() {
        return new Constituent(this.label, this.children.map(child => child.copy()));
    }

    // returns a json representation of the constituent
    json() {
        // if this has no children...
        if (this.children.length === 0) {
            return {
                label: this.label,
                data: this.data,
                children: []
            };
        } else {
            return {
                label: this.label,
                data: this.data,
                children: this.children.map(child => child.json())
            };
        }
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