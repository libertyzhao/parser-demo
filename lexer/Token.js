const { getSymbolStr } = require("./SymbolDefine");

class Token {
  constructor(val, isNullable, deriveList) {
    this.isNullable = isNullable;
    this.firstSet = new Set();
    this.followSet = new Set();
    this.val = val;
    this.text = getSymbolStr(val);
    if (deriveList === null) {
      this._setAdd(this.firstSet, val);
    }
    this.deriveList = deriveList;
  }
  _setAdd(set, val) {
    set.add(val);
  }
  firstSetAddSet(addSet) {
    for (let value of addSet) {
      this._setAdd(this.firstSet, value);
    }
  }
  followSetAddSet(addSet) {
    for (let value of addSet) {
      this._setAdd(this.followSet, value);
    }
  }
}

module.exports = Token;
