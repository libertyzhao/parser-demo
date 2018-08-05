let Input = require('./Input');
let Lexer = require('./Lexer');
let BasicParser = require('./BasicParser');
let ImprovedParser = require('./ImprovedParser');
let Parser = require('./Parser');

let input = new Input();
let lexer = new Lexer(input);
let parser = new Parser(lexer);
input.setInput(`(1   +   2)* 3 ;`);
// lexer.runLexer();
parser.runParser()
