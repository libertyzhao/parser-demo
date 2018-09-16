const Input = require("../top_down_parser/Input");
const Lexer = require("../top_down_parser/Lexer");
const LRParser = require("./LRParser");

const ProductionManager = require("./ProductionManager")
const GrammarMachine = require("./GrammarMachine")

// const input = new Input();
// input.setInput(`1+2+3`)
// const lexer = new Lexer(input);
// const parser = new LRParser(lexer);
// parser.parse();

// const productionManager = new ProductionManager();
// productionManager.initProductions();
// productionManager.printAllProductions();

const grammarMachine = new GrammarMachine();
grammarMachine.build();
