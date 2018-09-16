const GrammarState = require("./GrammarState");
const ProductionManager = require("./ProductionManager");
const { SYMBOL, getSymbolStr } = require("../top_down_parser/SymbolDefine");

class GrammarMachine {
  constructor(productionManager) {
    this.productionManager = new ProductionManager(); // 用来管理推导式对象
    this.productionManager.initProductions(); // 初始化语法对象列表
    this.closureProductionSet = new Set(); // 记录在每一次语法节点进行闭包运算的时候，所推出的所有推导式节点
    this.prodToGrammarStateMap = new Map(); // 记录该推导式节点属于哪个语法节点对象
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
        this.createNewGrammarState(grammarState, idx);
        this.printGrammarStateList();
        this.closureProductionSet.clear();
        this.symbolTypeToProductionList.clear();
        // this.prodToGrammarStateMap.clear();
      }
    }

    this.printDerive();
    this.prodToGrammarStateMap.clear();
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
  createNewGrammarState(parentGrammarState, idx) {
    let i = 0;
    // 便遍历分区信息
    for (let productionSet of this.symbolTypeToProductionList.values()) {
      let grammarState, oldGrammarState;
      // 遍历分区中的推导式对象，此次循环只是用来检测是否存在新节点
      // 如果存在新节点，则不管该推导式是否之前出现在其他节点过，全部加入新的节点,所以要先看该分区中是否存在新节点的诞生
      for (let prod of productionSet) {
        // 注意：推导式对象中点的位置不同，该推导式对象也不同
        // 所以这里如果该推导式属于其他节点，那这里应该记录，但是注意，如果该分区中有一个推导式对象没有出现过，那么所有该分区的推导式应该组成一个新的节点
        oldGrammarState = this.prodToGrammarStateMap.get(prod.toString());
        if (!oldGrammarState) {
          grammarState = grammarState || new GrammarState();
          this.prodToGrammarStateMap.set(prod.toString(), grammarState);
        }
      }
      // 如果出现新节点就插入
      if(grammarState){
        i++;
        this.grammarStateList.splice(idx + i, 0, grammarState);
      }
      // 重新循环，上面第一次循环只是用来检测是否存在新节点，而这一次则是根据是否存在新节点来做出相应的操作
      for (let prod of productionSet) {
        const dotSymbol = prod.getDotSymbol();
        let targetGrammarState;
        // 如果存在新节点，则不管该推导式是否之前出现在其他节点过，全部加入新的节点
        if (grammarState) {
          grammarState.addProduction(prod.dotForward());
          // 设置父节点到子节点的路径
          targetGrammarState = grammarState;
        } else {
          oldGrammarState = this.prodToGrammarStateMap.get(prod.toString());
          targetGrammarState = oldGrammarState;
        }
        // 设置跳转关系
        parentGrammarState.setEdgeToNextGrammarState(dotSymbol, targetGrammarState);
      }
    }
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
