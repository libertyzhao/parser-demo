
// 排除NAN
function isNumber(num) {
  num = parseInt(num, 10);
  return typeof num === "number" && num === num;
}

class Lexer {
  constructor(TOKEN_RULE) {
    this.symbol = ""; // 当前的词法内容是什么
    this.row = 1; // 第几行
    this.col = 0; // 第几列
    this.lookAhead = -1; // 前看符号
    this.inputString = "";
  }
  clear(){
    this.row = 1;
    this.col = 0;
  }
  lex() {
    let text;

    while ((text = this.inputString[0]) !== undefined) {
      this.col++;
      this.symbol = text;
      this.inputString = this.inputString.slice(1);
      switch (text) {
        case "+":
          return Lexer.PLUS;
        case "*":
          return Lexer.TIMES;
        case "(":
          return Lexer.LP;
        case ")":
          return Lexer.RP;
        case ";":
          return Lexer.SEMI;
        case '\n':
          this.row++;
          this.col = 0
        case " ":
          break;
        default:
          if (!isNumber(text)) {
            console.error(`illegal input: ${text} `);
            return Lexer.ILLEGAL_SYMBOL;
          } else {
            let token;
            while ((token = this.inputString[0]) !== undefined) {
              if (!isNumber(token)) {
                break;
              }
              this.col++;
              this.symbol += token;
              this.inputString = this.inputString.slice(1);
            }
            return Lexer.NUM;
          }
      }
    }
    return Lexer.EOI;
  }
  match(token) {
    if (this.lookAhead === -1) {
      this.advance();
    }
    return token == this.lookAhead;
  }
  // 前看符号持续推进，下次match的时候，肯定是看后面的一个符号是不是自己想要的
  advance() {
    this.lookAhead = this.lex();
  }
  setInputString(inputString){
    this.clear();
    this.inputString = inputString;
  }
  runLexer(inputString) {
    this.setInputString(inputString);
    // 看一下是否到了结尾
    while (!this.match(Lexer.EOI)) {
      console.log(`Token: ${this.lookAhead}, Symbol: ${this.symbol}`);
      this.advance();
    }
  }
}

// 添加静态属性
Object.assign(Lexer, {
  PLUS: "PLUS",
  TIMES: "TIMES",
  LP: "LP",
  RP: "RP",
  NUM: "NUM",
  SEMI: "SEMI",
  EOI: "EOI",
  ILLEGAL_SYMBOL: "ILLEGAL_SYMBOL"
});

module.exports = Lexer
