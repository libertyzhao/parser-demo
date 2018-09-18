const { SYMBOL, getSymbolStr } = require("../top_down_parser/SymbolDefine");



/**
 *  look ahead set:能合法的跟在某个非终结符后面的符号集合，它是follow set的子集
 *  需要考虑的是：当前输入字符，当做了reduce操作后，在状态机当前上下文环境下，是否能合法的跟在reduce后的非终结符的后面
 *  做了reduce之后，能合法的跟在该非终结符后面的集合，就叫look ahead set
 */
class Production {
  constructor(left, dotPos, right){
    this.dotPos = dotPos;
    this.left = left;
    this.right = right;
    this.lookAheadSet = new Set([SYMBOL.EOI]); //针对于该推导式的后面能够输入的集合
  }

  dotForward(step){
    const prod = new Production(this.left, this.dotPos + step, this.right);
    prod.lookAheadSet = new Set();
    for (let item of this.lookAheadSet) {
      prod.lookAheadSet(item);
    }
    return prod
  }

  cloneSelf(){
    return this.dotForward(0)
  }

  addLookAheadSet(symbolType){
    this.lookAheadSet.add(symbolType);
  }

  getLeft(){
    return this.left;
  }

  getRight(){
    return this.right
  }

  getDotPosition(){
    return this.dotPos;
  }

  getDotSymbol(){
    if(this.dotPos >= this.right.length){
      return SYMBOL.UNKNOWN_SYMBOL;
    }
    return this.right[this.dotPos];
  }

  equals(prod){
    let bool = false;
    if(this.left === prod.getLeft() && this.right.toString() === prod.getRight().toString() && this.dotPos === prod.getDotPosition()){
      bool = true;
    }
    return bool;
  }

  toString(){
    let str = '    ' + getSymbolStr(this.left) + " -> ", printDot = false;
    for(let i = 0 ; i < this.right.length ; i++){
      if(i === this.dotPos){
        printDot = true;
        str += ". ";
      }
      str += getSymbolStr(this.right[i]) + ' '

    }
    if(!printDot){
      str += " . ";
    }
    return str
  }

  print(){
    const str = this.toString()
    console.log(str)
  }
}

module.exports = Production;
