import { Lexer } from "./Lexer";

describe("Lexer", () => { // Creates a test suite for the Lexer class.
    it("should create a Lexer object", () => { // Creates a test case for the Lexer class.
        const lexer = new Lexer(/foo/); // Creates a Lexer object.
        expect(lexer.pattern).toEqual(/foo/); // Checks if the pattern property of the Lexer object is equal to /foo/.
    });
});