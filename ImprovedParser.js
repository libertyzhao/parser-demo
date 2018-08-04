let Lexer = require("./Lexer");

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
  runParser(inputString) {
    this.lexer.setInputString(inputString);
    this.statements();
  }
  statements() {
    // statements -> expression ; | expression ; statements

    while (!this.lexer.match(Lexer.EOI)) {
      this.expression();

      if (this.lexer.match(Lexer.SEMI)) {
        this.lexer.advance();
      } else {
        // 后面不是分号，错误。
        console.log(
          `line: ${this.lexer.row}, col: ${
            this.lexer.col
          }, expected ';' , but got ${this.lexer.symbol}`
        );
        this.isLegalStatement = false;
        break;
      }
    }
    if (this.isLegalStatement) {
      console.log(`The statement is legal`);
    }
  }
  expression() {
    // expression -> term expression'
    this.term();

    while (this.lexer.match(Lexer.PLUS)) {
      this.lexer.advance();
      this.term();
    }

    if (this.lexer.match(Lexer.ILLEGAL_SYMBOL)) {
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

    while (this.lexer.match(Lexer.TIMES)) {
      this.lexer.advance();
      this.factor();
    }

    if (this.lexer.match(Lexer.ILLEGAL_SYMBOL)) {
      // 必须是乘号开头，其他的就错了
      console.log(
        `line: ${this.lexer.row}, col: ${
          this.lexer.col
        }, expected '*' or '' , but got ${this.lexer.symbol}`
      );
      this.isLegalStatement = false;
    }
  }

  factor() {
    // factor -> NUM | LP expression RP
    if (this.lexer.match(Lexer.NUM)) {
      this.lexer.advance();
    } else if (this.lexer.match(Lexer.LP)) {
      this.lexer.advance();
      this.expression();
      if (this.lexer.match(Lexer.RP)) {
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

module.exports = BasicParser;
