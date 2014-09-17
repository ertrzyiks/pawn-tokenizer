var chai = require("chai"),
    expect = chai.expect,
    fs = require("fs"),
    path = require("path"),
    tokenize = require("../").tokenize;
    
function parse(sourceFile, tokensFile, done) {
    var seen = [],
        expected = require(tokensFile),
        tk;
        
    function onToken(src, target) {
        seen.push({ type: target.type, source: src });
    }
    
    tk = tokenize(onToken);
                
    fs.createReadStream(path.join(__dirname, sourceFile)).pipe(tk);
    
    tk.on('data', function (chunk) {});
    tk.on('end', function () {
        done(null, seen, expected);
    });
}
    
describe('Pawn tokenizer', function () {
    describe('Recognizing comments', function () {
        it('should recognize one line comments', function (done) {
            parse('comments/comments.sma', './comments/comments.json',  function (err, seen, expected) {
                expect(seen).to.deep.equal(expected);
                done();
            });
        });
        
        it('should recognize multiline comments', function (done) {
            parse(
                'comments/comments_multiline.sma', 
                './comments/comments_multiline.json',  
                function (err, seen, expected) {
                    expect(seen).to.deep.equal(expected);
                    done();
                }
            );
        });
    });
    
    describe('Recognizing directives', function () {
        it('should recognize different directives', function (done) {
            parse('directives/directives.sma', './directives/directives.json',  function (err, seen, expected) {
                expect(seen).to.deep.equal(expected);
                done();
            });
        });
    });
    
    describe('Recognizing strings', function () {
        it('should recognize strings with default ctrlchar', function (done) {
            parse('strings/strings.sma', './strings/strings.json',  function (err, seen, expected) {
                expect(seen).to.deep.equal(expected);
                done();
            });
        });
    });
    
    describe('Changing ctrl char', function () {
        it('should recognize ctrl char change', function (done) {
            parse('ctrlchar/custom_ctrlchar.sma', './ctrlchar/custom_ctrlchar.json',  function (err, seen, expected) {
                expect(seen).to.deep.equal(expected);
                done();
            });
        });
    });
    
    describe('Tokenizing', function () {
        it('should be able to tokenize complex code', function (done) {
            parse('tokens/tokens.sma', './tokens/tokens.json', function (err, seen, expected) {
                expect(seen).to.deep.equal(expected);
                done();
            });
        });
    });
});
