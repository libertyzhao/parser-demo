const LRStateMachine = require("./LRStateMachine");
const STATE_MACHINE_ACTION = require("./STATE_MACHINE_ACTION");
const { SYMBOL } = require("../top_down_parser/SymbolDefine");

class LRParser {
  constructor(lexer) {
    this.lexer = lexer;
    this.stateMachine = new LRStateMachine();
    this.parserStack = [];
    this.todo = {};
    this.lexerInput;
    this.init();
  }
  init() {
    this.parserStack.peek = function() {
      return this[this.length - 1];
    };
    this.parserStack.push(0);
    this.lexer.advance();
    this.lexerInput = this.lexer.lookAhead;

    this.todo = {
      [STATE_MACHINE_ACTION.error]:() => {
        console.log("炸了炸了")
      },
      [STATE_MACHINE_ACTION.accept]:() => {
        console.log("可以接受")
      },
      [STATE_MACHINE_ACTION.s1]:() => {
        this.parserStack.push(1);
        this.lexer.advance();
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.s2]:() => {
        this.parserStack.push(2);
        this.lexer.advance();
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.s3]:() => {
        this.parserStack.push(3);
        this.lexer.advance();
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.s4]:() => {
        this.parserStack.push(4);
        this.lexer.advance();
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.r1]:() => {
        this.parserStack.pop();
        this.parserStack.pop();
        this.parserStack.pop();
        this.lexerInput = SYMBOL.EXPR;
      },
      [STATE_MACHINE_ACTION.r2]:() => {
        this.parserStack.pop();
        this.lexerInput = SYMBOL.EXPR;
      },
      [STATE_MACHINE_ACTION.r3]:() => {
        this.parserStack.pop();
        this.lexerInput = SYMBOL.TERM;
      },
      [STATE_MACHINE_ACTION.state_2]:() => {
        this.parserStack.push(2);
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.state_3]:() => {
        this.parserStack.push(3);
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.state_5]:() => {
        this.parserStack.push(5);
        this.lexerInput = this.lexer.lookAhead;
      },
    }
  }

  parse() {
    let action;
    do{
      action = this.stateMachine.getAction(this.parserStack.peek(), this.lexerInput);
      const todo = this.todo[action];
      if(typeof todo === 'function'){
        todo();
      }
    }while(action !== STATE_MACHINE_ACTION.accept)
  }
}

module.exports = LRParser;
