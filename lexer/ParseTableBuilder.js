var SYMBOL = require("./SymbolDefine");
var Token = require("./Token");

class ParseTableBuilder {
  constructor() {
    this.tokenArr = [];
    this.tokenMap = {};
    this.init();
  }
  init() {
    let deriveList = [],
      SYMBOL_TYPE = SYMBOL.STMT,
      bool = false;
    deriveList.push([SYMBOL.EXPR, SYMBOL.SEMI]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    (deriveList = []), (SYMBOL_TYPE = SYMBOL.EXPR), (bool = true);
    deriveList.push([SYMBOL.TERM, SYMBOL.EXPR_PRIME]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    (deriveList = []), (SYMBOL_TYPE = SYMBOL.EXPR_PRIME), (bool = true);
    deriveList.push([SYMBOL.PLUS, SYMBOL.TERM, SYMBOL.EXPR_PRIME]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    (deriveList = []), (SYMBOL_TYPE = SYMBOL.TERM), (bool = false);
    deriveList.push([SYMBOL.FACTOR, SYMBOL.TERM_PRIME]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    (deriveList = []), (SYMBOL_TYPE = SYMBOL.TERM_PRIME), (bool = true);
    deriveList.push([SYMBOL.TIMES, SYMBOL.FACTOR, SYMBOL.TERM_PRIME]);
    deriveList.push([SYMBOL.NUM_OR_ID]);
    this.initToken(SYMBOL_TYPE, bool, deriveList);

    (deriveList = []), (SYMBOL_TYPE = SYMBOL.FACTOR), (bool = false);
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
    for (let i = 0; i < this.tokenArr.length; i++) {
        let token = tokenArr[i];
    }
  }
}
