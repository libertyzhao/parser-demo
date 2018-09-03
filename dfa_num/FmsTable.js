
const STATE_COUNT = 6; // 图的点

class FmsTable {
  constructor(){
    this.fmsTable = new Array(STATE_COUNT);
    for(let i = 0 ; i < this.fmsTable.length ; i++){
      this.fmsTable[i] = [];
    }
    this.init();
  }
  // 初始化图的数据
  init(){

    this.initForNumber(0,1);
    this.initForNumber(1,1);
    this.initForNumber(2,2);
    this.initForNumber(3,2);
    this.initForNumber(4,4);
    this.initForNumber(5,4);

    this.fmsTable[0]['.'] = 3;
    this.fmsTable[1]['.'] = 2;
    this.fmsTable[1]['e'] = 5;
    this.fmsTable[2]['e'] = 5;

  }
  // 这些点输入0-9 ，会进入相应的状态
  initForNumber(row, val){
    for(let i = 0 ; i < 10 ; i++){
      this.fmsTable[row][i] =  val;
    }
  }
  // 该点上输入数值，会跳到哪个点
  nextState(state, input){
    if(state >= 0 && state < STATE_COUNT){
      return this.fmsTable[state][input];
    }
    return -1;
  }
}

module.exports = FmsTable
