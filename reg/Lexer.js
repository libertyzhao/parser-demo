const ASCII_COUNT = 128;
let Input = require("./Input");

class Lexer {
  constructor(input) {
    this.tokenMap = new Array(ASCII_COUNT);
    this.input = input;
    this.nextWordType = -1;
    this.initTokenMap();
  }
  initTokenMap() {
    // 除了下面的特殊符号，其他都是LITERAL
    this.tokenMap["."] = Lexer.ANY;
    this.tokenMap["^"] = Lexer.AT_BOL;
    this.tokenMap["$"] = Lexer.AT_EOL;
    this.tokenMap["]"] = Lexer.CCL_END;
    this.tokenMap["["] = Lexer.CCL_START;
    this.tokenMap[")"] = Lexer.CLOSE_PAREN;
    this.tokenMap["*"] = Lexer.CLOSURE;
    this.tokenMap["-"] = Lexer.DASH;
    this.tokenMap["("] = Lexer.OPEN_PAREN;
    this.tokenMap["?"] = Lexer.OPTIONAL;
    this.tokenMap["|"] = Lexer.OR;
    this.tokenMap["+"] = Lexer.PLUS_CLOSE;
  }
  lex() {
    let step = 1,
      token = this.input.lookAhead(step);
    if (token === Input.EOF) {
      return Input.EOF;
    }
    if (token === "\\") {
      token = this.handleTransform(++step);
    }
    this.input.advance(step);
    this.nextWordType = this.tokenMap[token];
    return this.nextWordType || Lexer.LITERAL;
  }
  handleTransform(step) {
    let token = this.input.lookAhead(step);

    switch (token) {
      case "\\\\":
        return "\\";
      case "\b":
        return "\b";
      case "\d":
        return "\d";
      case "\f":
        return "\f";
      case "\n":
        return "\n";
      case "\r":
        return "\r";
      case "\s":
        return "\s";
      case "\w":
        return "\w";
      default:
        return `\\${token}`;
    }
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
}

Object.assign(Lexer, {
  ANY: "ANY", // . 通配符
  AT_BOL: "AT_BOL", //^ 开头匹配符
  AT_EOL: "AT_EOL", //$ 末尾匹配符
  CCL_END: "CCL_END", //字符集类结尾括号 ]
  CCL_START: "CCL_START", //字符集类开始括号 [
  CLOSE_PAREN: "CLOSE_PAREN", //)
  CLOSURE: "CLOSURE", //*
  DASH: "DASH", // -
  LITERAL: "LITERAL", //字符常量
  OPEN_PAREN: "OPEN_PAREN", // (
  OPTIONAL: "OPTIONAL", //?
  OR: "OR", // |
  PLUS_CLOSE: "PLUS_CLOSE" // +
});

module.exports = Lexer;
