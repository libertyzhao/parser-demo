let process = require('process');
let Lexer = require('./Lexer');
const { SYMBOL } = require("./SymbolDefine");

class ArgumentParser{
  constructor(lexer){
    this.isLegalStatement = true;
    this.lexer = lexer;
    this.stack = [];
    this.i = 1;
  }


  value(str) {
    let name = 's'+this.i++;
    console.log(name + " = " + str);
    this.stack.push(name);
  }

  op(what) {
    let left, right;
    right = this.stack.pop();
    left = this.stack[this.stack.length - 1];
    console.log(left + what + "= " + right);
  }

  statements(){
     /*
      *  statements -> expression ; | expression ; statements
      */
     this.expression();

     if(this.lexer.match(SYMBOL.SEMI)){
       this.lexer.advance();
     }else{
       console.log('1报错');process.exit(0);
     }

     if(!this.lexer.match(SYMBOL.EOI)){
       this.statements();
     }
     if (this.isLegalStatement) {
      console.log(`The statement is legal`);
    }
  }

  expression(){
    /*
     *  expression -> term expression'
     */
    this.term();
    this.expr_prime(); // expression'
  }

  expr_prime(){
    /*
     *  expression' -> PLUS term expression' | '空'
     */
    if (this.lexer.match(SYMBOL.PLUS)) {
      this.lexer.advance();
      this.term();

      this.op("+");

      this.expr_prime();
    }
    else if (this.lexer.match(SYMBOL.UNKNOWN_SYMBOL)) {
      this.isLegalStatement = false;
      console.log('2报错');process.exit(0);
      return;
    }
    else {
      /*
       * "空" 就是不再解析，直接返回
       */
      return;
    }
  }

  term() {
    /*
     * term -> factor term'
     */
    this.factor();
    this.term_prime(); //term'
  }

  term_prime() {
    /*
     * term' -> * factor term' | '空'
     */
    if (this.lexer.match(SYMBOL.TIMES)) {
      this.lexer.advance();
      this.factor();
      this.op("*");
      this.term_prime();
    }
    else {
      /*
       * 如果不是以 * 开头， 那么执行 '空'
       * 也就是不再做进一步解析，直接返回
       */
      return;
    }
  }

  factor() {
    /*
     * factor -> NUM | LP expression RP
     */
    if (this.lexer.match(SYMBOL.NUM)) {
      this.value(this.lexer.symbol);
      this.lexer.advance();
    }
    else if (this.lexer.match(SYMBOL.LP)){
      this.lexer.advance();
      this.expression();
      if (this.lexer.match(SYMBOL.RP)) {
        this.lexer.advance();
      }
      else {
        /*
         * 有左括号但没有右括号，错误
         */
        this.isLegalStatement = false;
        console.log('3报错');process.exit(0)
        return;
      }
    }
    else {
      /*
       * 这里不是数字，解析出错
       */
      this.isLegalStatement = false;
      console.log('4报错');process.exit(0)
      return;
    }
  }
}

module.exports = ArgumentParser
