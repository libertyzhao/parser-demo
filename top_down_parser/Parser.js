
let Lexer = require("./Lexer");
let process = require("process");

/**
 *  statements -> expression ; | expression ; statements
 *  expression -> term expression'
 *  expression' -> PLUS term expression' | '空'
 *  term -> factor term'
 *  term' -> * factor term' | '空'
 *  factor -> NUM | LP expression RP
 */

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.isLegalStatement = true;
    this.stack = []; // 栈
    this.top = -1; // 栈顶指针
  }
  pushStack(value) {
    this.stack.push(value);
    this.top++;
  }
  popStack() {
    this.top--;
    return this.stack.pop();
  }
  runParser() {
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
        let info = this.lexer.input.getTokenInfo();
        console.error(
          `line: ${info.row}, col: ${
            info.mark
          }, expected ';' , but got ${this.lexer.symbol}`
        );
        process.exit(0)
      }
    }
    if (this.isLegalStatement) {
      console.log(`The statement is legal`);
      console.log(this.popStack());
    }
  }
  expression() {
    // expression -> term expression'
    this.term();

    while (this.lexer.match(Lexer.PLUS)) {
      this.lexer.advance();
      this.term();
      let a = this.popStack(),
        b = this.popStack();
      this.pushStack(b + a);
    }

    if (this.lexer.match(Lexer.ILLEGAL_SYMBOL)) {
      // 要么是加号，要么是空，出现了其他的就是错误
      let info = this.lexer.input.getTokenInfo();
      console.error(
        `line: ${info.row}, col: ${
          info.mark
        }, expected '+' or '' , but got ${this.lexer.symbol}`
      );
      process.exit(0)
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
      let a = this.popStack(),
        b = this.popStack();
      this.pushStack(b * a);
    }

    if (this.lexer.match(Lexer.ILLEGAL_SYMBOL)) {
      // 必须是乘号开头，其他的就错了
      let info = this.lexer.input.getTokenInfo();
      console.error(
        `line: ${info.row}, col: ${
          info.mark
        }, expected '*' or '' , but got ${this.lexer.symbol}`
      );
      process.exit(0)
    }
  }

  factor() {
    // factor -> NUM | LP expression RP
    if (this.lexer.match(Lexer.NUM)) {
      this.pushStack(parseInt(this.lexer.symbol, 10));
      this.lexer.advance();
    } else if (this.lexer.match(Lexer.LP)) {
      this.lexer.advance();
      this.expression();

      if (this.lexer.match(Lexer.RP)) {
        this.lexer.advance();
      } else {
        // 末尾必须是右括号，否则错误
        let info = this.lexer.input.getTokenInfo();
        console.error(
          `line: ${info.row}, col: ${
            info.mark
          }, expected ')' , but got ${this.lexer.symbol}`
        );
        process.exit(0)
      }
    } else {
      // 要么NUM，要么LP，其他都错误
      let info = this.lexer.input.getTokenInfo();
      console.error(
        `line: ${info.row}, col: ${
          info.mark
        }, expected number or '(' , but got ${this.lexer.symbol}`
      );
      process.exit(0)
    }
  }
}

module.exports = Parser;
