
var Tokenizer = require('./dynamic_tokenizer'),
    CtrlcharDetector = require('./ctrlchar_detector');

module.exports = function (cb) {
    
    function escapeRegexText(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    
    function getQuoteRegex(ctrlchar) {
        return new RegExp('^"([^"\n]|' + escapeRegexText(ctrlchar) + '")*"?$');
    }
    
    var t = new Tokenizer(cb),
        keywords = [
            "if", "else", "for", "while", "do", 
            "switch", "case", "default", "break",
            "new", "const", "return",
            "public", "stock", "forward", "native",
            "state"
        ],
        ctrlcharDetector;
    
    t.addRule(/^\/\*([^*]|\*(?!\/))*\*\/$/, 'area comment');
    t.addRule(/^\/\*([^*]|\*(?!\/))*\*?$/, 'area comment continue');
    
    t.addRule(/^\/\/[^\n]*$/, 'line comment');
    t.addRule(getQuoteRegex('^'), 'quote');
    t.addRule(/^'(\\?[^'\n]|\\')'?$/, 'char');
    t.addRule(/^'[^']*$/, 'char continue');
    
    t.addRule(/^#(\S*)$/, 'directive');
    
    t.addRule(/^\($/, 'open paren');
    t.addRule(/^\)$/, 'close paren');
    t.addRule(/^\[$/, 'open square');
    t.addRule(/^\]$/, 'close square');
    t.addRule(/^{$/, 'open curly');
    t.addRule(/^}$/, 'close curly');
    
    t.addRule(
        /^([-<>~!%^&*\/+=?|.,:;]|->|<<|>>|\*\*|\|\||&&|--|\+\+|[-+*|&%\/=]=)$/,
        'operator'
    );
    
    t.addRule(new RegExp("^(" + keywords.join("|") + ")$"), 'keyword');
    t.addRule(/^([_A-Za-z]\w*)$/, 'identifier');
    
    t.addRule(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/, 'number');
    t.addRule(/^(\s)$/, 'whitespace');
    
    t.addRule(/^\\\n?$/, 'line continue');
    
    ctrlcharDetector = new CtrlcharDetector(function (ctrlchar) {
        t.updateRule(getQuoteRegex(ctrlchar), 'quote');
    });
    
    t.on('token', ctrlcharDetector.onToken);
    
    return t;
};
