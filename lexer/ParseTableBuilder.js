/**
 * 构建一个first集
 * 1、如果a是一个终结符，那么first(a) = {a} ,对于推导式 s -> a b，first(s) = {a}.
 * 2、如果a是一个nullable的非终结符，那么对于 s -> a b，first(s) = {a,b}
 */

var { SYMBOL, getSymbolStr } = require("./SymbolDefine");
var Token = require("./Token");

class ParseTableBuilder {
  constructor() {
    this.tokenArr = [];
    this.tokenMap = {};
    this.updateStatus = false;
    this.init();
  }
  // 初始化文法规则
  init() {
    let deriveList = [],
      SYMBOL_TYPE = SYMBOL.STMT,
      bool = false;
    deriveList.push([SYMBOL.EXPR, SYMBOL.SEMI]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    deriveList = [];
    SYMBOL_TYPE = SYMBOL.EXPR;
    bool = true;
    deriveList.push([SYMBOL.TERM, SYMBOL.EXPR_PRIME]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    deriveList = [];
    SYMBOL_TYPE = SYMBOL.EXPR_PRIME;
    bool = true;
    deriveList.push([SYMBOL.PLUS, SYMBOL.TERM, SYMBOL.EXPR_PRIME]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    deriveList = [];
    SYMBOL_TYPE = SYMBOL.TERM;
    bool = false;
    deriveList.push([SYMBOL.FACTOR, SYMBOL.TERM_PRIME]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    deriveList = [];
    SYMBOL_TYPE = SYMBOL.TERM_PRIME;
    bool = true;
    deriveList.push([SYMBOL.TIMES, SYMBOL.FACTOR, SYMBOL.TERM_PRIME]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    deriveList = [];
    SYMBOL_TYPE = SYMBOL.FACTOR;
    bool = false;
    deriveList.push([SYMBOL.LP, SYMBOL.EXPR, SYMBOL.RP]);
    deriveList.push([SYMBOL.NUM_OR_ID]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    SYMBOL_TYPE = SYMBOL.SEMI;
    bool = false;
    deriveList = null;
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    SYMBOL_TYPE = SYMBOL.PLUS;
    bool = false;
    deriveList = null;
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    SYMBOL_TYPE = SYMBOL.TIMES;
    bool = false;
    deriveList = null;
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    SYMBOL_TYPE = SYMBOL.LP;
    bool = false;
    deriveList = null;
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    SYMBOL_TYPE = SYMBOL.RP;
    bool = false;
    deriveList = null;
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    SYMBOL_TYPE = SYMBOL.NUM_OR_ID;
    bool = false;
    deriveList = null;
    this.initToken(SYMBOL_TYPE, bool, deriveList);
  }

  initToken(SYMBOL_TYPE, bool, deriveList) {
    let token = new Token(SYMBOL_TYPE, bool, deriveList);
    this.tokenArr.push(token);
    this.tokenMap[SYMBOL_TYPE] = token;
  }

  runFirstSet() {
    while (true) {
      this.updateStatus = false;
      for (let i = 0; i < this.tokenArr.length; i++) {
        const token = this.tokenArr[i],
          deriveLists = token.deriveList;
        if (deriveLists && deriveLists.length > 0) {
          for (let j = 0; j < deriveLists.length; j++) {
            this.addFirstSet(token, deriveLists[j], 0);
          }
        }
      }
      this.printFirstSet();
      if (!this.updateStatus) {
        break;
      }
    }
    // console.log("最后打印");
    // this.printFirstSet();
  }

  needUpdate(parent, child) {
    let bool = true;
    for (let val of child) {
      if (!parent.has(val)) {
        bool = false;
        break;
      }
    }
    return bool;
  }

  addFirstSet(token, deriveList, idx) {
    const firstToken = this.tokenMap[deriveList[idx]];
    if (!this.needUpdate(token.firstSet, firstToken.firstSet)) {
      this.updateStatus = true;
      token.firstSetAddSet(firstToken.firstSet);
    }
    if (firstToken.isNullable && idx + 1 < deriveList.length) {
      this.addFirstSet(token, deriveList, idx + 1);
    }
  }

  printFirstSet() {
    console.log(`------------`);
    for (let i = 0; i < this.tokenArr.length; i++) {
      const token = this.tokenArr[i],
        firstSet = token.firstSet;
      if(token.deriveList){
        let str = getSymbolStr(token.val) + "{ ";
        for (let val of firstSet) {
          str += getSymbolStr(val) + ", ";
        }
        str += "}";
        console.log(str);
      }
    }
  }
}

module.exports = ParseTableBuilder;
