const Input = require('./Input');
const Lexer = require('./Lexer');
const BasicParser = require('./BasicParser');
const ImprovedParser = require('./ImprovedParser');
const Parser = require('./Parser');
const ArgumentParser = require('./ArgumentParser');
const TopdownPaserWithParseTable = require('./TopdownPaserWithParseTable');

const ParseTableBuilder = require('./ParseTableBuilder');
parseTableBuilder = new ParseTableBuilder();
parseTableBuilder.runFirstSet();

parseTableBuilder.runFollowSet();
console.log('------firstSet------')
parseTableBuilder.printFirstSet('firstSet');
console.log('------followSet------')
parseTableBuilder.printFirstSet('followSet');

// const input = new Input();
// input.setInput(`1+(2*3);`);
// const lexer = new Lexer(input);
// const parser = new TopdownPaserWithParseTable(lexer);
// // lexer.runLexer();
// parser.parser();
