class Attribute{
    constructor(){
        this.left = null;
        this.right = null;
        this._parseGrammar = '';
    }

    static getAttribute(attrVal){
        let obj = new Attribute();
        obj.left = attrVal;
        obj.right = attrVal;

        return obj;
    }

    setGrammar(s){
        this._parseGrammar = s;
    }

    getGrammar(){
        return this._parseGrammar;
    }
}

module.exports = Attribute;
