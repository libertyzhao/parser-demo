// 状态机，里面是简单的正则匹配，复杂的正则匹配其实也是简单的正则匹配合起来的

let NfaManage = require("./NfaManage");
let Nfa = require("./Nfa");
let Lexer = require("./Lexer");
let NfaPair = require("./NfaPair");
let Print = require("./Print");

class NfaMachine {
  constructor(lexer) {
    this.NfaManage = new NfaManage();
    this.lexer = lexer;
  }
  run() {
    let nfaPair = new NfaPair();
    this.nfaForSingleCharacter(nfaPair);
    this.nfaForDot(nfaPair);
    // this.nfaForCharacterSetWithoutNegative(nfaPair);
    this.nfaForCharacterSet(nfaPair);

    Print.printNfa(nfaPair.startNode);
  }
  // 匹配单个字符，b
  nfaForSingleCharacter(nfaPair) {
    if (!this.lexer.match(Lexer.LITERAL)) {
      return false;
    }
    nfaPair.startNode = this.NfaManage.getNfa();
    nfaPair.startNode.next = nfaPair.endNode = this.NfaManage.getNfa();

    nfaPair.startNode.setEdge(Nfa.CCL);
    nfaPair.startNode.addSet(this.lexer.symbol);

    this.lexer.advance();
    return true;
  }
  // 匹配任意字符 .
  nfaForDot(nfaPair) {
    if (!this.lexer.match(Lexer.ANY)) {
      return false;
    }
    nfaPair.startNode = this.NfaManage.getNfa();
    nfaPair.startNode.next = nfaPair.endNode = this.NfaManage.getNfa();

    nfaPair.startNode.setEdge(Nfa.CCL);

    nfaPair.startNode.addSet("\n");
    nfaPair.startNode.addSet("\r");
    nfaPair.startNode.reverseFill(); // 取反，不能有\n和\r

    this.lexer.advance();
    return true;
  }
  // 匹配字符集 [a-zA-Z]
  nfaForCharacterSetWithoutNegative(nfaPair) {
    if (!this.lexer.match(Lexer.CCL_START)) {
      return false;
    }
    this.lexer.advance();

    nfaPair.startNode = this.NfaManage.getNfa();
    nfaPair.startNode.next = nfaPair.endNode = this.NfaManage.getNfa();

    nfaPair.startNode.setEdge(Nfa.CCL);
    if (!this.lexer.match(Lexer.CCL_END)) {
      this.doConnect(nfaPair.startNode);
    }
    // 最后跳出来，要么是],要么是字符串结尾，不是结尾才能前进
    if (!this.lexer.match(Lexer.EOF)) {
      this.lexer.advance();
    }
    return true;
  }
  // 匹配字符集 [^a-zA-Z]
  nfaForCharacterSet(nfaPair) {
    if(!this.lexer.match(Lexer.CCL_START)){
        return false;
    }
    this.lexer.advance();
    if(!this.lexer.match(Lexer.AT_BOL)){
        return false;
    }
    nfaPair.startNode = this.NfaManage.getNfa();
    nfaPair.startNode.next = nfaPair.endNode = this.NfaManage.getNfa();

    nfaPair.startNode.setEdge(Nfa.CCL);
    if (!this.lexer.match(Lexer.CCL_END)) {
      this.doConnect(nfaPair.startNode);
    }
    // 最后跳出来，要么是],要么是字符串结尾，不是结尾才能前进
    if (!this.lexer.match(Lexer.EOF)) {
      this.lexer.advance();
    }

    nfaPair.startNode.reverseFill(); // 取反
    return true;
  }
  // a-z  连接
  doConnect(node) {
    let start = 0,
      end = 0;
    while (!this.lexer.match(Lexer.CCL_END) && !this.lexer.match(Lexer.EOF)) {
      start = this.lexer.symbol.charCodeAt();
      this.lexer.advance();
      // 匹配到了连接符
      if (this.lexer.match(Lexer.CONNECT)) {
        this.lexer.advance();
        // 只要后面不是结束,就把ascii集合放到set中
        if (!this.lexer.match(Lexer.EOF)) {
          end = this.lexer.symbol.charCodeAt();
          this.lexer.advance();
          for (let i = start; i < end; i++) {
            node.addSetAsciiCode(i);
          }
        }
      }
    }
  }
}

module.exports = NfaMachine;
