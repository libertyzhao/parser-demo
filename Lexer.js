
// 排除NAN
function isNumber(num) {
  num = parseInt(num, 10);
  return typeof num === "number" && num === num;
}

class Lexer {
  constructor(input) {
    this.symbol = ""; // 当前的词法内容是什么

    this.nextWordType = -1; // 前看符号的类型

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
          return Lexer.PLUS;
        case "*":
          return Lexer.TIMES;
        case "(":
          return Lexer.LP;
        case ")":
          return Lexer.RP;
        case ";":
          return Lexer.SEMI;
        default:
          if (!isNumber(text)) {
            console.error(`illegal input: ${text} `);
            return Lexer.ILLEGAL_SYMBOL;
          } else {
            let token;
            while ((token = this.input.lookAhead(1)) !== undefined) {
              if (!isNumber(token)) {
                break;
              }
              this.symbol += token;
              this.input.advance(1);
            }
            return Lexer.NUM;
          }
      }
    }
    return Lexer.EOI;
  }
  match(token) {
    if (this.nextWordType === -1) {
      this.advance();
    }
    return token == this.nextWordType;
  }
  // 前看符号持续推进，下次match的时候，肯定是看后面的一个符号是不是自己想要的
  advance() {
    this.nextWordType = this.lex();
  }
  runLexer() {
    // 看一下是否到了结尾
    while (!this.match(Lexer.EOI)) {
      console.log(`Token: ${this.nextWordType}, Symbol: ${this.symbol}`);
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
