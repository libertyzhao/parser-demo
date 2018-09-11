const SYMBOL = {
  BASE: 256,
  EXPR: 257,
  EXPR_PRIME: 259,
  FACTOR: 260,
  STMT: 256,
  TERM: 258,
  TERM_PRIME: 261,

  ACTION_0: 512,
  ACTION_1: 513,
  ACTION_2: 514,
  ACTION_3: 515,
  ACTION_4: 516,

  LP: 5,
  NUM_OR_ID: 4,
  PLUS: 2,
  RP: 6,
  SEMI: 1,
  TIMES: 3,
  EOI: 0,
  WHITE_SPACE: 7,
  UNKNOWN_SYMBOL: 8
};

const TYPE_TO_SYMBOL = {
  [SYMBOL.EXPR]: "EXPR",
  [SYMBOL.EXPR_PRIME]: "EXPR_PRIME",
  [SYMBOL.FACTOR]: "FACTOR",
  [SYMBOL.STMT]: "STMT",
  [SYMBOL.TERM]: "TERM",
  [SYMBOL.TERM_PRIME]: "TERM_PRIME",
  [SYMBOL.LP]: "LP",
  [SYMBOL.NUM_OR_ID]: "NUM_OR_ID",
  [SYMBOL.PLUS]: "PLUS",
  [SYMBOL.RP]: "RP",
  [SYMBOL.SEMI]: "SEMI",
  [SYMBOL.TIMES]: "TIMES"
};

function getSymbolStr(symbolType) {
  return TYPE_TO_SYMBOL[symbolType];
}

module.exports = { SYMBOL, getSymbolStr };
