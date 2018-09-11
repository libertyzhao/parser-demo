// 用来实现推倒表
const { SYMBOL } = require("./SymbolDefine");
const ParseTableBuilder = require("./ParseTableBuilder");
let parseTableBuilder = new ParseTableBuilder();
parseTableBuilder.initParseTable();
// console.log('------firstSet------')
// parseTableBuilder.printSet('firstSet');
// console.log('------followSet------')
// parseTableBuilder.printSet('followSet');
// console.log('------selectionSet------')
// parseTableBuilder.printSet('selectionSet');

class ParseTable {
  constructor() {
    this.parseTableBuilder = parseTableBuilder;
    this.yyPushTable = [];
    this.yyd;
    this._initYyPushTable();
    this._initYydTable();
  }

  // 文法规则
  _initYyPushTable() {
    this.parseTableBuilder.tokenArr.forEach(item => {
      if (item.deriveList) {
        for (let i = 0; i < item.deriveList.length; i++) {
          this.yyPushTable.push(item.deriveList[i]);
        }
      }
    });
    // 终结符
    // this.yyPushTable =
    // const yyp0 = null;
    // this.yyPushTable.push(yyp0);

    // const yyp1 = [
    //   SYMBOL.STMT,
    //   SYMBOL.SEMI,
    //   SYMBOL.ACTION_1,
    //   SYMBOL.EXPR,
    //   SYMBOL.ACTION_0
    // ];
    // this.yyPushTable.push(yyp1);

    // const yyp2 = [SYMBOL.EXPR_PRIME, SYMBOL.TERM];
    // this.yyPushTable.push(yyp2);

    // const yyp3 = [
    //   SYMBOL.EXPR_PRIME,
    //   SYMBOL.ACTION_2,
    //   SYMBOL.TERM,
    //   SYMBOL.ACTION_0,
    //   SYMBOL.PLUS
    // ];
    // this.yyPushTable.push(yyp3);

    // const yyp4 = null;
    // this.yyPushTable.push(yyp4);

    // const yyp5 = [SYMBOL.TERM_PRIME, SYMBOL.FACTOR];
    // this.yyPushTable.push(yyp5);

    // const yyp6 = [
    //   SYMBOL.TERM_PRIME,
    //   SYMBOL.ACTION_3,
    //   SYMBOL.FACTOR,
    //   SYMBOL.ACTION_0,
    //   SYMBOL.TIMES
    // ];
    // this.yyPushTable.push(yyp6);

    // const yyp7 = null;
    // this.yyPushTable.push(yyp7);

    // const yyp8 = [SYMBOL.ACTION_4, SYMBOL.NUM_OR_ID];
    // this.yyPushTable.push(yyp8);

    // const yyp9 = [SYMBOL.RP, SYMBOL.EXPR, SYMBOL.LP];
    // this.yyPushTable.push(yyp9);
  }

  // 行动表，其实就是first集
  _initYydTable() {
    let parseTableBuilder = new ParseTableBuilder();
    parseTableBuilder.initParseTable();
    this.yyd = parseTableBuilder.parseTable;
  }

  getWhatToDo(topSymbol, lookAheadSymbol) {
    return this.yyd[topSymbol][lookAheadSymbol];
  }

  getPushTableItems(whatToDo) {
    return this.yyPushTable[whatToDo];
  }
}

module.exports = ParseTable;
