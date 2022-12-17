class Constituent {
    label: string;
    children: Array<Constituent>;

    constructor(label: string, children: Array<Constituent> = null) {
        this.label = label;
        this.children = children;
    }

    show() {
        //console.log(this.label)
    }
}

const c = new Constituent('asdf')


c.show()
