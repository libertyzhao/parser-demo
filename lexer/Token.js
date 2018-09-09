const { getSymbolStr } = require("./SymbolDefine");

class Token {
  constructor(val, isNullable, deriveList) {
    this.isNullable = isNullable;
    this.firstSet = new Set();
    this.val = val;
    this.text = getSymbolStr(val);
    if (deriveList === null) {
      this._firstSetAdd(val);
    }
    this.deriveList = deriveList;
  }
  _firstSetAdd(val) {
    this.firstSet.add(val);
  }
  firstSetAddSet(list) {
    for (let value of list) {
      this._firstSetAdd(value);
    }
  }
}

module.exports = Token;
