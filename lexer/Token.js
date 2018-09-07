class Token {
  constructor(val, isNullable, deriveList) {
    this.isNullable = isNullable;
    this.firstSet = [];
    if (deriveList !== null) {
      this.firstSetAdd(val);
    }
    this.deriveList = deriveList;
  }
  firstSetAdd(val) {
    this.firstSet.push(val);
  }
}
