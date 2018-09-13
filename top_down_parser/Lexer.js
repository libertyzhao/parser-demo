const { SYMBOL } = require("./SymbolDefine");

// 排除NAN
function isNumber(num) {
  num = parseInt(num, 10);
  return typeof num === "number" && num === num;
}

class Lexer {
  constructor(input) {
    this.symbol = ""; // 当前的词法内容是什么

    this.lookAhead = -1; // 前看符号的类型

    this.input = input; // 输入控制器
  }

  lex() {
    let text;
    // 前看符号拿个标记
    while ((text = this.input.lookAhead(1)) !== undefined) {
      // 标记能用，则前进
      this.input.advance(1);
      this.symbol = text;
      switch (text) {
        case "+":
          return SYMBOL.PLUS;
        case "*":
          return SYMBOL.TIMES;
        case "(":
          return SYMBOL.LP;
        case ")":
          return SYMBOL.RP;
        case ";":
          return SYMBOL.SEMI;
        default:
          if (!isNumber(text)) {
            console.error(`illegal input: ${text} `);
            return SYMBOL.UNKNOWN_SYMBOL;
          } else {
            let token;
            while ((token = this.input.lookAhead(1)) !== undefined) {
              if (!isNumber(token)) {
                break;
              }
              this.symbol += token;
              this.input.advance(1);
            }
            return SYMBOL.NUM_OR_ID;
          }
      }
    }
    return SYMBOL.EOI;
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
  runLexer() {
    // 看一下是否到了结尾
    while (!this.match(SYMBOL.EOI)) {
      console.log(`Token: ${this.lookAhead}, Symbol: ${this.symbol}`);
      this.advance();
    }
  }
}

// 添加静态属性
// Object.assign(Lexer, {
//   PLUS: 2,
//   TIMES: 3,
//   LP: 5,
//   RP: 6,
//   NUM: 4,
//   SEMI: 1,
//   EOI: 0,
//   WHITE_SPACE: 7,
//   UNKNOWN_SYMBOL: 8
// });

module.exports = Lexer;
