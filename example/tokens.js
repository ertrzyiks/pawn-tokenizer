var tokenize = require('../lib');
var t = tokenize(function (src, token) {
    console.log(token.type + ' => ' + JSON.stringify(src));
});
process.stdin.pipe(t);
