const { SYMBOL, getSymbolStr } = require("../top_down_parser/SymbolDefine");
const STATE_MACHINE_ACTION = require("./STATE_MACHINE_ACTION");

class LRStateMachine {
  constructor() {
    this.stateMachine = {};
    this.init();
  }

  init() {
    let row0 = {
      [SYMBOL.NUM_OR_ID]: STATE_MACHINE_ACTION.s1,
      [SYMBOL.EXPR]: STATE_MACHINE_ACTION.state_2,
      [SYMBOL.TERM]: STATE_MACHINE_ACTION.state_3
    };
    this.stateMachine[0] = row0;

    let row1 = {
      [SYMBOL.EOI]: STATE_MACHINE_ACTION.r3,
      [SYMBOL.PLUS]: STATE_MACHINE_ACTION.r3
    };
    this.stateMachine[1] = row1;

    let row2 = {
      [SYMBOL.EOI]: STATE_MACHINE_ACTION.accept,
      [SYMBOL.PLUS]: STATE_MACHINE_ACTION.s4
    };
    this.stateMachine[2] = row2;

    let row3 = {
      [SYMBOL.EOI]: STATE_MACHINE_ACTION.r2,
      [SYMBOL.PLUS]: STATE_MACHINE_ACTION.r2
    };
    this.stateMachine[3] = row3;

    let row4 = {
      [SYMBOL.NUM_OR_ID]: STATE_MACHINE_ACTION.s1,
      [SYMBOL.TERM]: STATE_MACHINE_ACTION.state_5
    };
    this.stateMachine[4] = row4;

    let row5 = {
      [SYMBOL.EOI]: STATE_MACHINE_ACTION.r1,
      [SYMBOL.PLUS]: STATE_MACHINE_ACTION.r1
    };
    this.stateMachine[5] = row5;
  }

  getAction(state, symbol) {
    if (this.stateMachine[state][symbol] === null) {
      return STATE_MACHINE_ACTION.error;
    }
    return this.stateMachine[state][symbol];
  }
}

module.exports = LRStateMachine;
