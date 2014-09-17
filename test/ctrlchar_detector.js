var chai = require("chai"),
    expect = chai.expect,
    fs = require("fs"),
    path = require("path"),
    tokenize = require("../").tokenize,
    CtrlCharDetector = require("../lib/ctrlchar_detector");
    
function parse(sourceFile, ctrlcharDetector, done) {
    var seen = [],
        tk;
        
    function onToken(src, target) {
        seen.push({ type: target.type, source: src });
        ctrlcharDetector.onToken(src, target.type);
    }
    
    tk = tokenize(onToken);
                
    fs.createReadStream(path.join(__dirname, sourceFile)).pipe(tk);
    
    tk.on('data', function (chunk) {});
    tk.on('end', function () {
        done(null, seen);
    });
}
    
describe('Ctrlchar detector', function () {
    it('should detect changed ctrlchar in fine code', function (done) {
        var ctrlchar = '^',
            ctrlcharDetector = new CtrlCharDetector(function (cc) {
                ctrlchar = cc;
            });
        
        parse("ctrlchar_detector/fine.sma", ctrlcharDetector, function (err, seen) {
            expect(ctrlchar).to.equal("\\");
            done();
        });
    });
    
    it('should detect changed ctrlchar in fine multiline code', function (done) {
        var ctrlchar = '^',
            ctrlcharDetector = new CtrlCharDetector(function (cc) {
                ctrlchar = cc;
            });
        
        parse("ctrlchar_detector/fine_two_lines.sma", ctrlcharDetector, function (err, seen) {
            expect(ctrlchar).to.equal("\\");
            done();
        });
    });
    
    it('should not detect changed ctrlchar when missing whitespace', function (done) {
        var ctrlchar = '^',
            ctrlcharDetector = new CtrlCharDetector(function (cc) {
                ctrlchar = cc;
            });
        
        parse("ctrlchar_detector/wrong_missing_whitespace.sma", ctrlcharDetector, function (err, seen) {
            expect(ctrlchar).to.equal("^");
            done();
        });
    });
    
    it('should not detect changed ctrlchar when in inline comment', function (done) {
        var ctrlchar = '^',
            ctrlcharDetector = new CtrlCharDetector(function (cc) {
                ctrlchar = cc;
            });
        
        parse("ctrlchar_detector/wrong_inline_comment.sma", ctrlcharDetector, function (err, seen) {
            expect(ctrlchar).to.equal("^");
            done();
        });
    });
    
    it('should not detect changed ctrlchar when in multiline comment', function (done) {
        var ctrlchar = '^',
            ctrlcharDetector = new CtrlCharDetector(function (cc) {
                ctrlchar = cc;
            });
        
        parse("ctrlchar_detector/wrong_multiline_comment.sma", ctrlcharDetector, function (err, seen) {
            expect(ctrlchar).to.equal("^");
            done();
        });
    });
    
    it('should not detect changed ctrlchar when in string', function (done) {
        var ctrlchar = '^',
            ctrlcharDetector = new CtrlCharDetector(function (cc) {
                ctrlchar = cc;
            });
        
        parse("ctrlchar_detector/wrong_string.sma", ctrlcharDetector, function (err, seen) {
            expect(ctrlchar).to.equal("^");
            done();
        });
    });
    
    it('should not detect changed ctrlchar when in string', function (done) {
        var ctrlchar = '^',
            ctrlcharDetector = new CtrlCharDetector(function (cc) {
                ctrlchar = cc;
            });
        
        parse("ctrlchar_detector/wrong_multiline_pragma.sma", ctrlcharDetector, function (err, seen) {
            expect(ctrlchar).to.equal("^");
            done();
        });
    });
});
