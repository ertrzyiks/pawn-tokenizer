var tokenize = require("./lib");

function tokenizeFileWithCtrlChar(sourceFile, ctrlchar, onToken, done) {
    var tk = tokenize(onToken, ctrlchar);
    
    fs.createReadStream(path.join(__dirname, sourceFile)).pipe(tk);
    
    tk.on('data', function (chunk) {});
    tk.on('end', function () {
        done();
    });
}

function tokenizeFile(sourceFile, onToken, done) {
    tokenizeFileWithCtrlChar(sourceFile, null, onToken, done);
}

function fetchCtrlChar(sourceFile, next) {
    var ctrlchar = null,
        tokens = [],
        toListen = -1;
        
    function validatePragma() {
        var token;
        console.log(tokens);

        token = tokens[0];
        if ('directive' !== token.type || '#pragma' !== token.src) {
            return;
        }

        token = tokens[1];
        if ('whitespace' !== token.type || ' ' === token.src) {
            return;
        }
        
        token = tokens[2];
        if ('char' !== token.type) {
            return;
        }
        
        ctrlchar = token.src.slice(1, 2);
    }
    
    function onToken(src, target) {
        if ('directive' === target.type && "#pragma" === src) {
            toListen = 3;
            tokens.length = 0;
        }
        
        if (toListen > 0) {
            tokens.push({src: src, type: target.type});
            toListen = toListen - 1;
        }       

        if (0 === toListen) {
            validatePragma();
            toListen = -1;
        }
    }

    function done(err) {
        if (err) {
            next(err);
        } else {
            next(null, ctrlchar);
        }
    }
    
    tokenizeFile(sourceFile, onToken, done);
}

exports.tokenize = tokenize;

exports.tokenizeFile = function (sourceFile, onToken, done) {
    fetchCtrlChar(sourceFile, function (err, ctrlchar) {
        tokenizeFileWithCtrlChar(sourceFile, ctrlchar, onToken, done);
    });
};
