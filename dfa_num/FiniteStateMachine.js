let FmsTable = require("./FmsTable");
let Input = require("./Input");

class FiniteStateMachine {
  constructor(input) {
    this.lookAhead = -1; // 前看符号
    // this.inputString = ""; //输入的内容

    this.input = input; // 输入管理器

    this.state = 0; // 开始处于状态0
    this.preState = -1; // 上一个状态
    this.nextState = -1; // 下一个状态
    this.FMS = new FmsTable();
  }
  clear(){
    this.state = 0; // 开始处于状态0
    this.preState = -1; // 上一个状态
    this.nextState = -1; // 下一个状态
  }
  lex() {
    while ((this.lookAhead = this.input.lookAhead(1)) !== undefined) {
      this.input.advance(1);

      this.nextState = this.FMS.nextState(this.state, this.lookAhead);

      if (this.nextState === -1) {
        console.log('ignore bad input');
        continue;
      }

      console.log(`${this.state} --${this.lookAhead}--> ${this.nextState}`);
      this.preState = this.state;
      this.state = this.nextState;
    }

    switch (this.state) {
      case 1:
        console.log("int number");
        return;
      case 2:
      case 4:
        console.log("float number");
        return;
      default:
        console.log("internal error");
    }
  }
  run() {
    this.clear();
    this.lex();
  }
}

let input = new Input();
let fms = new FiniteStateMachine(input);
input.setInput(`3.12e3`)
fms.run();
