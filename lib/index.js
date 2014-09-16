var Tokenizer = require('tokenizer');

module.exports = function (cb, ctrlchar) {
    function regex_escape(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    var t = new Tokenizer(cb),
        keywords = [
            "if", "else", "for", "while", "do", 
            "switch", "case", "default", "break",
            "new", "const", "return",
            "public", "stock", "forward", "native"
        ];
        
    ctrlchar = ctrlchar || '^';
    
    t.addRule(/^\/\*([^*]|\*(?!\/))*\*\/$/, 'area comment');
    t.addRule(/^\/\*([^*]|\*(?!\/))*\*?$/, 'area comment continue');
    
    t.addRule(/^\/\/[^\n]*$/, 'line comment');
    t.addRule(new RegExp('^"([^"\n]|' + regex_escape(ctrlchar) + '")*"?$'), 'quote');
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
    
    return t;
};
