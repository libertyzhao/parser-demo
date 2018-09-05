// 用来实现推倒表
const SYMBOL = require("./SymbolDefine");

class ParseTable {
  constructor() {
    this.yyPushTable = [];
    this.yyd = [];
    this.rowBase = SYMBOL.STMT; // 因为语法表达式一般从257开始，256是stmt
    this._initYyPushTable();
    this._initYydTable();
  }

  // 文法规则
  _initYyPushTable() {
    // 终结符
    const yyp0 = null;
    this.yyPushTable.push(yyp0);

    const yyp1 = [
      SYMBOL.STMT,
      SYMBOL.SEMI,
      SYMBOL.ACTION_1,
      SYMBOL.EXPR,
      SYMBOL.ACTION_0
    ];
    this.yyPushTable.push(yyp1);

    const yyp2 = [SYMBOL.EXPR_PRIME, SYMBOL.TERM];
    this.yyPushTable.push(yyp2);

    const yyp3 = [
      SYMBOL.EXPR_PRIME,
      SYMBOL.ACTION_2,
      SYMBOL.TERM,
      SYMBOL.ACTION_0,
      SYMBOL.PLUS
    ];
    this.yyPushTable.push(yyp3);

    const yyp4 = null;
    this.yyPushTable.push(yyp4);

    const yyp5 = [SYMBOL.TERM_PRIME, SYMBOL.FACTOR];
    this.yyPushTable.push(yyp5);

    const yyp6 = [
      SYMBOL.TERM_PRIME,
      SYMBOL.ACTION_3,
      SYMBOL.FACTOR,
      SYMBOL.ACTION_0,
      SYMBOL.TIMES
    ];
    this.yyPushTable.push(yyp6);

    const yyp7 = null;
    this.yyPushTable.push(yyp7);

    const yyp8 = [SYMBOL.ACTION_4, SYMBOL.NUM_OR_ID];
    this.yyPushTable.push(yyp8);

    const yyp9 = [SYMBOL.RP, SYMBOL.EXPR, SYMBOL.LP];
    this.yyPushTable.push(yyp9);
  }

  // 行动表，其实就是first集
  _initYydTable() {
    this.yyd[SYMBOL.STMT - this.rowBase] = [0, -1, -1, -1, 1, 1, -1];
    this.yyd[SYMBOL.EXPR - this.rowBase] = [-1, -1, -1, -1, 2, 2, -1];
    this.yyd[SYMBOL.TERM - this.rowBase] = [-1, -1, -1, -1, 5, 5, -1];
    this.yyd[SYMBOL.EXPR_PRIME - this.rowBase] = [-1, 4, 3, -1, -1, -1, 4];
    this.yyd[SYMBOL.FACTOR - this.rowBase] = [-1, -1, -1, -1, 8, 9, -1];
    this.yyd[SYMBOL.TERM_PRIME - this.rowBase] = [-1, 7, 7, 6, -1, -1, 7];
  }

  getWhatToDo(topSymbol, lookAheadSymbol){
    return this.yyd[topSymbol - this.rowBase][lookAheadSymbol]
  }

  getPushTableItems(whatToDo){
    return this.yyPushTable[whatToDo];
  }
}

module.exports = ParseTable
