var chai = require("chai"),
    expect = chai.expect,
    fs = require("fs"),
    path = require("path");
    tokenize = require("../").tokenize;
    
function parse(sourceFile, tokensFile, ctrlchar, done) {
    var seen = [],
        expected = require(tokensFile),
        tk;
        
    function onToken(src, target) {
        seen.push({ type: target.type, source: src });
    }
    
    if ("undefined" === typeof done) {
        tk = tokenize(onToken);
        done = ctrlchar;
    } else {
        tk = tokenize(onToken, ctrlchar);
    }
                
    fs.createReadStream(path.join(__dirname, sourceFile)).pipe(tk);
    
    tk.on('data', function(chunk) {});
    tk.on('end', function () {
        done(null, seen, expected);
    });
}
    
describe('Pawn tokenizer', function(){
    describe('Recognizing comments', function(){
        it('should recognize one line comments', function(done){
            parse('comments/comments.sma', './comments/comments.json',  function(err, seen, expected){
                expect(seen).to.deep.equal(expected);
                done();
            });
        });
        
        it('should recognize multiline comments', function(done){
            parse('comments/comments_multiline.sma', './comments/comments_multiline.json',  function(err, seen, expected){
                expect(seen).to.deep.equal(expected);
                done();
            });
        });
    });
    
    describe('Recognizing strings', function(){
        it('should recognize empty string, normal string and string with escaped quote mark', function(done){
            parse('strings/strings.sma', './strings/strings.json',  function(err, seen, expected){
                expect(seen).to.deep.equal(expected);
                done();
            });
        });
        
        it('should recognize empty string, normal string and string with escaped quote mark with custom ctrlchar', function(done){
            parse(
                'strings/strings_custom_ctrlchar.sma', 
                './strings/strings_custom_ctrlchar.json', 
                '\\', 
                function(err, seen, expected){
                    expect(seen).to.deep.equal(expected);
                    done();
                }
            );
        });
    });
    
    describe('Tokenizing', function(){
        it('should be able to tokenize complex code', function(done){
            parse('tokens/tokens.sma', './tokens/tokens.json', function(err, seen, expected){
                expect(seen).to.deep.equal(expected);
                done();
            });
        });
    });
});