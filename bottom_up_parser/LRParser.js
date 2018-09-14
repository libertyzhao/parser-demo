const LRStateMachine = require("./LRStateMachine");
const STATE_MACHINE_ACTION = require("./STATE_MACHINE_ACTION");
const { SYMBOL } = require("../top_down_parser/SymbolDefine");

/**
 * 自底向上算法其实跟自顶向下算法，正好反过来
 * 自顶向下：不断的进行推导，把起始符不断的进行推导展开，直到产生非终结符，然后用输入去和非终结符对比，
 * 自底向上：不断的进行移进和规约，不断的将输入串移入，去对比推导过程，看能否规约成产生式右侧的值
 */
class LRParser {
  constructor(lexer) {
    this.lexer = lexer;
    this.stateMachine = new LRStateMachine();
    this.statusStack = [];
    this.todo = {};
    this.lexerInput;
    this.text = "";
    this.names = ["t0", "t1", "t2", "t3", "t4", "t5", "t6"];
    this.curName = 0;
    this.valueStack = [];
    this.parseStack = [];
    this.parentAttribute
    this.init();
  }
  newName(){
    if(this.curName >= this.names.length){
      throw Error("寄存器超出了");
    }
    return this.names[this.curName++];
  }
  freeName(s){
    this.names[--this.curName] = s;
  }
  init() {
    this.statusStack.peek = function() {
      return this[this.length - 1];
    };
    this.statusStack.push(0);
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
        this.statusStack.push(1);

        this.text = this.lexer.symbol;
        this.valueStack.push(this.lexerInput);
        this.parseStack.push(null);

        this.lexer.advance();
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.s2]:() => {
        this.statusStack.push(2);

        this.text = this.lexer.symbol;
        this.valueStack.push(this.lexerInput);
        this.parseStack.push(null);

        this.lexer.advance();
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.s3]:() => {
        this.statusStack.push(3);

        this.text = this.lexer.symbol;
        this.valueStack.push(this.lexerInput);
        this.parseStack.push(null);

        this.lexer.advance();
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.s4]:() => {
        this.statusStack.push(4);

        this.text = this.lexer.symbol;
        this.valueStack.push(this.lexerInput);
        this.parseStack.push(null);

        this.lexer.advance();
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.r1]:() => {

        const topAttribute = this.valueStack[this.valueStack.length - 1]
        const secondAttribute = this.valueStack[this.valueStack.length - 3]
        console.log(`${secondAttribute} += ${topAttribute}`);
        this.freeName(topAttribute)

        this.statusStack.pop();
        this.statusStack.pop();
        this.statusStack.pop();

        this.valueStack.pop();
        this.parseStack.pop();
        this.valueStack.pop();
        this.parseStack.pop();
        this.valueStack.pop();
        this.parseStack.pop();

        this.lexerInput = SYMBOL.EXPR;

        this.parentAttribute = secondAttribute;
        this.parseStack.push(this.lexerInput);
        this.valueStack.push(this.parentAttribute);
      },
      [STATE_MACHINE_ACTION.r2]:() => {
        this.statusStack.pop();

        this.parentAttribute = this.valueStack.pop();
        this.parseStack.pop();

        this.lexerInput = SYMBOL.EXPR;

        this.parseStack.push(this.lexerInput);
        this.valueStack.push(this.parentAttribute);
      },
      [STATE_MACHINE_ACTION.r3]:() => {
        this.statusStack.pop();
        this.lexerInput = SYMBOL.TERM;

        const name = this.newName();
        console.log(`${name} = ${this.text}`);
        this.parentAttribute = name;

        this.parseStack.pop();
        this.valueStack.pop();
        this.parseStack.push(this.lexerInput);
        this.valueStack.push(this.parentAttribute);
      },
      [STATE_MACHINE_ACTION.state_2]:() => {
        this.statusStack.push(2);
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.state_3]:() => {
        this.statusStack.push(3);
        this.lexerInput = this.lexer.lookAhead;
      },
      [STATE_MACHINE_ACTION.state_5]:() => {
        this.statusStack.push(5);
        this.lexerInput = this.lexer.lookAhead;
      },
    }
  }

  parse() {
    let action;
    do{
      action = this.stateMachine.getAction(this.statusStack.peek(), this.lexerInput);
      const todo = this.todo[action];
      if(typeof todo === 'function'){
        todo();
      }
    }while(action !== STATE_MACHINE_ACTION.accept)
  }
}

module.exports = LRParser;
