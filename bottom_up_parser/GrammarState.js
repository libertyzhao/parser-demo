let STATUS_NUMBER = 0; // 节点编号

/**
 * 用来描述节点对象
 */
class GrammarState {
  constructor() {
    this.edgeToNextGrammarState = new Map();// 边，指向另外一个节点
    this.status = STATUS_NUMBER++;// 节点编号
    this.productionList = []; // 该节点内部的推导式对象
    this.isVisited = false;
  }

  setEdgeToNextGrammarState(edge, grammarState) {
    this.edgeToNextGrammarState.set(edge, grammarState);
  }

  getNextGrammarStateByEdge(edge) {
    this.edgeToNextGrammarState.get(edge);
  }

  setVisited(){
    this.isVisited = true;
  }

  addProduction(production) {
    let bool = true;
    for(let prod of this.productionList){
      if(prod.equals(production)){
        bool = false;
      }
    }
    if(bool){
      this.productionList.push(production);
    }
  }

  print() {
    console.log(this.status + ' ');
    for (let item of this.productionList) {
      item.print();
    }
  }
}

module.exports = GrammarState;
