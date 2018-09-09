const { SYMBOL } = require("./SymbolDefine");
const Attribute = require("./Attribute");
const ParseTable = require("./ParseTable");
const Lexer = require("./Lexer");

class TopdownPaserWithParseTable {
  constructor(lexer) {
    this.lexer = lexer;
    this.parseTable = null;
    this.pdaStack = null;
    this.valueStack = null;
    this.parentAttribute = null;
    this.names = null;
    this.nameIdx = undefined;

    this.init();
    this.pusGrammarSymbol(SYMBOL.STMT);

    this.lexer.advance();
  }

  getName() {
    return this.names[this.nameIdx];
  }

  freeName(name) {
    this.nameIdx--;
    if (this.nameIdx >= 0) {
      this.names[this.nameIdx] = name;
    }
  }

  init() {
    this.parseTable = new ParseTable();
    this.pdaStack = [];
    this.valueStack = [];
    this.names = ["t0", "t1", "t2", "t3", "t4", "t5", "t6"];
    this.nameIdx = 0;
    this.parentAttribute = Attribute.getAttribute(null);
    Array.prototype.peek = function() {
      return this[this.length - 1];
    };
  }

  parser() {
    while (this.pdaStack.length > 0) {
      const symbol = this.pdaStack.peek();
      switch (symbol) {
        case SYMBOL.ACTION_0: {
          this.pdaStack.pop();
          const name = this.getName(),
            curPos = this.valueStack.length - 1;

          this.valueStack[curPos - 1].right = name;
          this.valueStack[curPos - 2].right = name;
          this.valueStack.pop();
          break;
        }
        case SYMBOL.ACTION_1: {
          this.pdaStack.pop();
          const name = this.valueStack.pop().right;
          this.freeName(name);
          break;
        }
        case SYMBOL.ACTION_2: {
          this.pdaStack.pop();
          const curAttribute = this.valueStack.pop(),
            parentAttribute = curAttribute.left,
            childAttribute = curAttribute.right;
          console.log(`${parentAttribute} += ${childAttribute}`);
          this.freeName(childAttribute);
          break;
        }
        case SYMBOL.ACTION_3: {
          this.pdaStack.pop();
          const curAttribute = this.valueStack.pop();
          console.log(`${curAttribute.left} *= ${curAttribute.right}`);
          break;
        }
        case SYMBOL.ACTION_4: {
          this.pdaStack.pop();
          const curAttribute = this.valueStack.pop();
          console.log(`${curAttribute.left} = ${this.lexer.symbol}`);
          this.lexer.advance();
          break;
        }
        case SYMBOL.EOI: {
          if (this.lexer.match(Lexer.EOI)) {
            return;
          } else {
            this.parseError();
          }
          break;
        }
        case SYMBOL.NUM_OR_ID: {
          this.popStacks();
          if (!this.lexer.match(Lexer.NUM)) {
            this.parseError();
          }
          break;
        }
        case SYMBOL.PLUS: {
          this.popStacks();
          if (!this.lexer.match(Lexer.PLUS)) {
            this.parseError();
          }
          this.lexer.advance();
          break;
        }
        case SYMBOL.TIMES: {
          this.popStacks();
          if (!this.lexer.match(Lexer.TIMES)) {
            this.parseError();
          }
          this.lexer.advance();
          break;
        }
        case SYMBOL.LP: {
          this.popStacks();
          if (!this.lexer.match(Lexer.LP)) {
            this.parseError();
          }
          this.lexer.advance();
          break;
        }
        case SYMBOL.RP: {
          this.popStacks();
          if (!this.lexer.match(Lexer.RP)) {
            this.parseError();
          }
          this.lexer.advance();
          break;
        }
        case SYMBOL.SEMI: {
          this.popStacks();
          if (!this.lexer.match(Lexer.SEMI)) {
            this.parseError();
          }
          this.lexer.advance();
          break;
        }
        default: {
          const whatToDo = this.parseTable.getWhatToDo(
            symbol,
            this.lexer.lookAhead
          );
          if (whatToDo === -1) {
            this.parseError();
          } else {
            this.popStacks();
            const nextSymbols = this.parseTable.getPushTableItems(whatToDo);
            if (nextSymbols) {
              for (let i = 0; i < nextSymbols.length; i++) {
                this.pusGrammarSymbol(nextSymbols[i]);
              }
            }
          }
          break;
        }
      }
    }
  }

  popStacks() {
    this.pdaStack.pop();
    this.parentAttribute = this.valueStack.pop();
  }

  pusGrammarSymbol(grammar) {
    this.pdaStack.push(grammar);
    const attr = Attribute.getAttribute(this.parentAttribute.right);

    this.valueStack.push(attr);
  }

  parseError() {
    throw "pda parse error";
  }
}

module.exports = TopdownPaserWithParseTable;
