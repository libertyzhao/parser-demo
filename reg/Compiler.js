let Lexer = require('./Lexer')
let Input = require('./Input')
let PreProcess = require('./PreProcess')

let preProcess = new PreProcess(`D   [0-9]`);
let input = new Input();
let lexer = new Lexer(input);

let inputString = `[\b\r\n]`;
console.log(`输入公式：${inputString}`);
input.setInput(preProcess.process(inputString));

while(!lexer.match(Input.EOF)){
  console.log(input.symbol);
  lexer.advance();
}
