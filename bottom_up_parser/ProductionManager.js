const { SYMBOL } = require("../top_down_parser/SymbolDefine");
const Production = require("./Production");

// 语法
class ProductionManager {
  constructor() {
    this.productionMap = new Map();
  }

  initProductions() {
    let right, production;

    //s -> e
    right = [SYMBOL.EXPR];
    production = new Production(SYMBOL.STMT, 0, right);
    this.addProduction(production);

    //e -> e + t
    right = [SYMBOL.EXPR, SYMBOL.PLUS, SYMBOL.TERM];
    production = new Production(SYMBOL.EXPR, 0, right);
    this.addProduction(production);

    //e -> t
    right = [SYMBOL.TERM];
    production = new Production(SYMBOL.EXPR, 0, right);
    this.addProduction(production);

    //t -> t * f
    right = [SYMBOL.TERM, SYMBOL.TIMES, SYMBOL.FACTOR];
    production = new Production(SYMBOL.TERM, 0, right);
    this.addProduction(production);

    //t -> f
    right = [SYMBOL.FACTOR];
    production = new Production(SYMBOL.TERM, 0, right);
    this.addProduction(production);

    //f -> ( e )
    right = [SYMBOL.LP, SYMBOL.EXPR, SYMBOL.RP];
    production = new Production(SYMBOL.FACTOR, 0, right);
    this.addProduction(production);

    //f -> NUM
    right = [SYMBOL.NUM_OR_ID];
    production = new Production(SYMBOL.FACTOR, 0, right);
    this.addProduction(production);
  }

  addProduction(production) {
    let productionList = this.productionMap.get(production.getLeft());
    if (!productionList) {
      productionList = [];
      this.productionMap.set(production.getLeft(), productionList);
    }

    if (productionList.indexOf(production) === -1) {
      productionList.push(production);
    }
  }

  getProductionList(left) {
    return this.productionMap.get(left);
  }

  printAllProductions() {
    for(let productionList of this.productionMap.values()){
      for(let production of productionList){
        production.print();
      }
    }
  }
}

module.exports = ProductionManager
