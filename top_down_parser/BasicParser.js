let Lexer = require('./Lexer');
const { SYMBOL } = require("./SymbolDefine");


/**
 *  statements -> expression ; | expression ; statements
 *  expression -> term expression'
 *  expression' -> PLUS term expression' | '空'
 *  term -> factor term'
 *  term' -> * factor term' | '空'
 *  factor -> NUM | LP expression RP
 */

class BasicParser {
  constructor(lexer) {
    this.lexer = lexer;
    this.isLegalStatement = true;
  }
  runParser(inputString){
    this.lexer.setInputString(inputString)
    this.statements();
  }
  statements() {
    // statements -> expression ; | expression ; statements

    this.expression();
    if (this.lexer.match(SYMBOL.SEMI)) {
      this.lexer.advance();
    } else {
      // 后面不是分号，错误。
      console.log(
        `line: ${this.lexer.row}, col: ${
          this.lexer.col
        }, expected ';' , but got ${this.lexer.symbol}`
      );
      this.isLegalStatement = false;
      return;
    }

    if (!this.lexer.match(SYMBOL.EOI)) {
      this.statements();
    }

    if (this.isLegalStatement) {
      console.log(`The statement is legal`);
    }
  }
  expression() {
    // expression -> term expression'
    this.term();
    this.expr_prime(); // expression'
  }
  expr_prime() {
    // expression' -> PLUS term expression' | '空'
    if (this.lexer.match(SYMBOL.PLUS)) {
      this.lexer.advance();
      this.term();
      this.expr_prime();
    } else if (this.lexer.match(SYMBOL.ILLEGAL_SYMBOL)) {
      // 要么是加号，要么是空，出现了其他的就是错误
      console.log(
        `line: ${this.lexer.row}, col: ${
          this.lexer.col
        }, expected '+' or '' , but got ${this.lexer.symbol}`
      );
      this.isLegalStatement = false;
      return;
    } else {
      return;
    }
  }
  term() {
    // term -> factor term'
    this.factor();
    this.term_prime();
  }
  term_prime() {
    // term' -> * factor term' | '空'
    if (this.lexer.match(SYMBOL.TIMES)) {
      this.lexer.advance();
      this.factor();
      this.term_prime();
    } else if (this.lexer.match(SYMBOL.ILLEGAL_SYMBOL)) {
      // 必须是乘号开头，其他的就错了
      console.log(
        `line: ${this.lexer.row}, col: ${
          this.lexer.col
        }, expected '*' or '' , but got ${this.lexer.symbol}`
      );
      this.isLegalStatement = false;
      return;
    } else {
      return;
    }
  }
  factor() {
    // factor -> NUM | LP expression RP
    if (this.lexer.match(SYMBOL.NUM)) {
      this.lexer.advance();
    } else if (this.lexer.match(SYMBOL.LP)) {
      this.lexer.advance();
      this.expression();
      if (this.lexer.match(SYMBOL.RP)) {
        this.lexer.advance();
      } else {
        // 末尾必须是右括号，否则错误
        console.log(
          `line: ${this.lexer.row}, col: ${
            this.lexer.col
          }, expected ')' , but got ${this.lexer.symbol}`
        );
        this.isLegalStatement = false;
        return;
      }
    } else {
      // 要么NUM，要么LP，其他都错误
      console.log(
        `line: ${this.lexer.row}, col: ${
          this.lexer.col
        }, expected number or '(' , but got ${this.lexer.symbol}`
      );
      this.isLegalStatement = false;
      return;
    }
  }
}

module.exports = BasicParser
