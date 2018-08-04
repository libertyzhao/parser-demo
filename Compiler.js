let Lexer = require('./Lexer');
let BasicParser = require('./BasicParser');
let ImprovedParser = require('./ImprovedParser');
let Parser = require('./Parser');

let lexer = new Lexer();
let parser = new Parser(lexer);
parser.runParser(`(1 -2)  *3;`)
