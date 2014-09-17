
var Tokenizer = require('tokenizer'),
    util = require('util');

function DynamicTokenizer(check_token_cb, options) {
    Tokenizer.call(this, check_token_cb, options);
}

util.inherits(DynamicTokenizer, Tokenizer);

DynamicTokenizer.prototype.updateRule = function (regex, type) {
    for (var i = 0; i < this._regexes.length; i++) {
        if (this._regexes[i].type === type) {
            this._regexes[i].regex = regex;
            return true;
        }
    }
    
    return false;
};

module.exports = DynamicTokenizer;
