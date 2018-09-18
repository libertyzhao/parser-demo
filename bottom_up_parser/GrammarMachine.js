const GrammarState = require("./GrammarState");
const ProductionManager = require("./ProductionManager");
const { SYMBOL, getSymbolStr } = require("../top_down_parser/SymbolDefine");

/**
 * 1、初始化0号节点，含有起始语法推导 s -> . e
 * 2、对 . 右边的非终结符做闭包操作：. 右边的符号是非终结符，那么找到该符号作为推导式左边的所有表达式如: e -> a, e -> a + b，并且把这些推导式加入集合，并重复做闭包操作，直到没有新的推导式加入集合为止
 * 3、对该集合进行分区，把 . 右边是相同符号的划入一个分区
 * 4、对不同分区进行节点生成操作：
 *    （1）如果该分区没有出现过，那么生成一个新的节点，并且把推导式对象的点号后移，产生新的推导式对象并放入新节点中
 *    （2）如果该分区以前出现过，则通过该分区找到以前的节点，处理依赖跳转关系
 */

 /**
  * 处理矛盾的算法
  * 1、如果有一个点号在末尾，另一个在中间（SLR(1)语法），如：
  *     e -> t .
  *     t -> t . * f
  *     当前输入字符如果属于 e 的 FOLLOW set, 那么我们就做reduce操作，否则做shift操作
  * 2、
  */
class GrammarMachine {
  constructor(productionManager) {
    this.productionManager = new ProductionManager(); // 用来管理推导式对象
    this.productionManager.initProductions(); // 初始化语法对象列表
    this.closureProductionSet = new Set(); // 记录在每一次语法节点进行闭包运算的时候，所推出的所有推导式节点
    this.prodSetToGrammarStateMap = new Map(); // 记录该推导式节点属于哪个语法节点对象
    this.symbolTypeToProductionList = new Map(); // 记录在每一次语法节点进行分区操作时，推倒类型所对应的推倒节点列表，
    this.grammarStateList = []; // 用来存储节点
    this.init();
  }
  // 初始化grammarStateList
  init() {
    const startSymbolType = SYMBOL.STMT;
    // 因为起始推导式节点肯定只有一个，所以拿到该起始节点
    const startProduction = this.productionManager.getProductionList(
      startSymbolType
    )[0];
    // 初始化0号语法节点
    const startGrammarState = new GrammarState();
    startGrammarState.addProduction(startProduction);
    this.grammarStateList.push(startGrammarState);
  }

  build() {
    /**
     * 遍历语法节点列表中的所有节点，然后拿到该节点的所有的推导式，对推导式进行闭包计算，得到该节点闭包运算时的所有推导式集合closureProductionSet
     * 然后对该集合进行分区，分区规则：把 " . " 右边拥有相同非终结符的表达式划入同一个分区，将分区转为新的节点，并且将点号后移后的production对象放入节点中，然后构建原有节点和新增节点对应的跳转关系
     */
    for (let idx = 0; idx < this.grammarStateList.length; idx++) {
      const grammarState = this.grammarStateList[idx];
      // 看节点是否访问过
      if (!grammarState.isVisited) {
        for (let prod of grammarState.productionList) {
          // 对推导式进行闭包计算
          this.makeClosure(prod.getDotSymbol(), prod);
        }
        // 打印
        this.printDerive();
        // 分区
        this.partition(grammarState);
        // 根据分区创建新节点
        this.createNewGrammarState(grammarState);
        this.printGrammarStateList();
        this.closureProductionSet.clear();
        this.symbolTypeToProductionList.clear();
        // this.prodSetToGrammarStateMap.clear();
      }
    }

    this.printDerive();
  }

  /**
   * 进行推导式的闭包计算
   * 对于语法规则：
   *  s -> . e
   *  e -> . e Plus t
   *  e -> . t
   *  t -> . NUM
   *  当对s -> . e进行闭包推导的时候，其实是对所有点号右边的非终结符做语法推倒，即先推出e -> . e Plus t，e -> . t，然后推t的
   */
  makeClosure(symbolType, production) {
    // 拿到symbolType对应的推导式集合
    const productionList = this.productionManager.getProductionList(symbolType);
    // 可能到末尾了，productionList不存在
    if (productionList) {
      for (let prod of productionList) {
        // 如果该推导式对象在本轮闭包计算中出现过，就不重新计算，closureProductionSet会在每轮闭包计算的时候刷新清空
        if (!this.closureProductionSet.has(prod)) {
          // 记录一下已经对该推导式进行过计算了，如果本轮计算中还碰到他，就不用处理了
          this.closureProductionSet.add(prod);
          // 获取当前点号的symbolType
          const dotSymbolType = prod.getDotSymbol();
          // 进行反复递归推倒，比如 a -> .b，b -> c，拿到b的推导式之后，继续递归推出c的推导式
          this.makeClosure(dotSymbolType, prod);
        }
      }
    }
    // 送进来的推导式，应该也在本轮的推导式集合中
    this.closureProductionSet.add(production);
  }

  /**
   * 对本轮推导式集合进行分区：把 " . " 右边拥有相同非终结符的表达式划入同一个分区
   * symbolTypeToProductionList 为分区的容器，在每轮闭包计算完之后，会被刷新清空
   */
  partition(parentGrammarState) {
    // 说明该节点访问过
    parentGrammarState.setVisited();
    for (let prod of this.closureProductionSet) {
      // 拿到推导式的点号对应的类型 s -> a . b , 则为b
      const dotSymbol = prod.getDotSymbol();
      if (dotSymbol !== SYMBOL.UNKNOWN_SYMBOL) {
        // 获取当前非终结符对应的区域集合，如果没有该集合就初始化一下，后面相同非终结符获取集合的时候，直接往里面添加就行，
        let productionSet = this.symbolTypeToProductionList.get(dotSymbol);
        if (!productionSet) {
          productionSet = new Set();
          this.symbolTypeToProductionList.set(dotSymbol, productionSet);
        }

        productionSet.add(prod);
      }
    }
  }

  /**
   * 将分区转换为新节点
   */
  createNewGrammarState(parentGrammarState) {
    // 遍历分区信息
    for (let productionSet of this.symbolTypeToProductionList.values()) {
      let grammarState, dotSymbol, targetGrammarState, oldGrammarState = this.prodSetToGrammarStateMap.get(this.stringify(productionSet));
      if(!oldGrammarState){
        // 如果以前没出现过该分区，则生成新的节点
        grammarState = new GrammarState();
        this.prodSetToGrammarStateMap.set(this.stringify(productionSet), grammarState);
        this.grammarStateList.push(grammarState);
      }
      targetGrammarState = grammarState;
      for (let prod of productionSet) {
        dotSymbol = prod.getDotSymbol();
        // 如果是指向旧节点，则获取一个dotSymbol就可以跳出循环了
        if(oldGrammarState){
          targetGrammarState = oldGrammarState
          break;
        }
        // 将推导式的点后移，并将新的prod对象传入节点
        grammarState.addProduction(prod.dotForward(1));
      }
      // 处理跳转逻辑
      parentGrammarState.setEdgeToNextGrammarState(dotSymbol, targetGrammarState);
    }
  }

  stringify(productionSet){
    let arr = [];
    for(let prod of productionSet){
      // 重写了prod的toString
      arr.push(prod.toString());
    }
    return arr.sort().join('')
  }

  // 分区分节点

  printDerive(production) {
    console.log("ClosureSet:");
    for (let prod of this.closureProductionSet) {
      prod.print();
    }
    console.log("------------");
    console.log();
  }

  printGrammarStateList() {
    console.log("分区信息:");
    for (let i = 0; i < this.grammarStateList.length; i++) {
      const grammar = this.grammarStateList[i];
      grammar.print();
    }
    console.log("------------");
    console.log();
  }
}

module.exports = GrammarMachine;
