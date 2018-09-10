/**
 * 构建一个first集
 * 1、如果a是一个终结符，那么first(a) = {a} ,对于推导式 s -> a b，first(s) = {a}.
 * 2、如果a是一个nullable的非终结符，那么对于 s -> a b，first(s) = {a,b}
 *
 * 构建一个follow集
 * 1、如果一个非终结符a后面跟着一个终结符b，那么follow(a) = {b},
 * 2、如果一个非终结符a在推导式b的末尾，形如：b -> c d a，那么follow(a) = follow(b),
 * 3、如果一个非终结符a后面跟着一个nullable的非终结符b，形如 c -> a b，那么 follow(a) = follow(b) + follow(c)
 *
 * 构建一个select集
 * 1、对于一个推导式 s -> a b，如果a是0个或多个nullable非终结符，当b为终结符时，那么select(s) = firstSet(a) + firstSet(b),
 * 2、对于一个推导式 s -> a b，如果a是0个或多个nullable非终结符，当b为非nullable的非终结符时，那么select(s) = firstSet(a) + follow(b),
 * 3、对于一个推导式 s -> a b，如果a是一个nullable的非终结符，select(s) = followSet(s)
 *
 * 构建解析表
 *    其实就是把select集拿出来，放到解析表中
 */

const { SYMBOL, getSymbolStr } = require("./SymbolDefine");
const Token = require("./Token");

class ParseTableBuilder {
  constructor() {
    this.tokenArr = [];
    this.tokenMap = {};
    this.parseTable = {};
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
      if (!this.updateStatus) {
        break;
      }
    }
    // console.log("最后打印");
    // this.printFirstSet();
  }

  needUpdate(parent, child) {
    let bool = false;
    for (let val of child) {
      if (!parent.has(val)) {
        bool = true;
        break;
      }
    }
    return bool;
  }

  addFirstSet(token, deriveList, idx) {
    const firstToken = this.tokenMap[deriveList[idx]];
    if (this.needUpdate(token.firstSet, firstToken.firstSet)) {
      this.updateStatus = true;
      token.firstSetAddSet(firstToken.firstSet);
    }
    if (firstToken.isNullable && idx + 1 < deriveList.length) {
      this.addFirstSet(token, deriveList, idx + 1);
    }
  }

  runFollowSet() {
    while (true) {
      this.updateStatus = false;
      for (let i = 0; i < this.tokenArr.length; i++) {
        const token = this.tokenArr[i],
          deriveLists = token.deriveList;
        if (deriveLists && deriveLists.length > 0) {
          for (let j = 0; j < deriveLists.length; j++) {
            this.addFollowSet(token, deriveLists[j]);
          }
        }
      }
      if (!this.updateStatus) {
        break;
      }
    }
  }

  addFollowSet(token, deriveList) {
    for (let idx = 0; idx < deriveList.length; idx++) {
      const deriveToken = this.tokenMap[deriveList[idx]];
      let targetToken = deriveToken,
        followToken = token,
        setType = "followSet";
      if (idx + 1 < deriveList.length) {
        followToken = this.tokenMap[deriveList[idx + 1]];
        setType = "firstSet";
      }
      this.updateFollowSet(targetToken, followToken[setType]);
      // 如果后面是nullable的值，那么它的follow集包含左边token的follow集
      if (
        idx + 1 < deriveList.length &&
        this.tokenMap[deriveList[idx + 1]].isNullable
      ) {
        followToken = token;
        setType = "followSet";
        this.updateFollowSet(targetToken, followToken[setType]);
      }
    }
  }

  updateFollowSet(targetToken, followSet) {
    if (this.needUpdate(targetToken.followSet, followSet)) {
      targetToken.followSetAddSet(followSet);
      this.updateStatus = true;
    }
  }

  runSelectionSet() {
    this.runFirstSet();
    this.runFollowSet();

    for (let i = 0; i < this.tokenArr.length; i++) {
      const token = this.tokenArr[i],
        deriveLists = token.deriveList;
      if (deriveLists && deriveLists.length > 0) {
        for (let j = 0; j < deriveLists.length; j++) {
          this.addSelectionSet(token, deriveLists[j]);
        }
      }
      if (token.isNullable) {
        token.selectionSetAddSet([...token.followSet]);
      }
    }
  }

  addSelectionSet(token, deriveList) {
    let nullableFirstSet = [];
    for (let idx = 0; idx < deriveList.length; idx++) {
      const deriveToken = this.tokenMap[deriveList[idx]];
      nullableFirstSet = nullableFirstSet.concat([...deriveToken.firstSet]);
      if (!deriveToken.isNullable) {
        token.selectionSetAddSet(nullableFirstSet);
        break;
      } else if (deriveToken.isNullable && idx === deriveList.length - 1) {
        token.selectionSetAddSet(
          nullableFirstSet.concat([...deriveToken.followSet])
        );
      }
    }
  }

  printSet(key) {
    for (let i = 0; i < this.tokenArr.length; i++) {
      const token = this.tokenArr[i],
        set = token[key];
      if (key === "selectionSet") {
        for (let list of set) {
          consoleSingle(token, list);
        }
      } else {
        consoleSingle(token, set);
      }
    }

    function consoleSingle(token, set) {
      if (token.deriveList && set) {
        let str = getSymbolStr(token.val) + " : { ";
        for (let val of set) {
          str += getSymbolStr(val) + ", ";
        }
        str += "}";
        console.log(str);
      }
    }
  }

  initParseTable() {
    this.runSelectionSet();
    let index = 0;
    for (let i = 0; i < this.tokenArr.length; i++) {
      const token = this.tokenArr[i];
      if (token.selectionSet && token.selectionSet.length > 0) {
        this.parseTable[token.val] = {};
        for (let j = 0; j < token.selectionSet.length; j++) {
          const selectionSet = token.selectionSet[j];
          selectionSet.forEach(val => {
            this.parseTable[token.val][val] = index;
          });
          index++;
        }
      }
    }
  }
}

module.exports = ParseTableBuilder;
