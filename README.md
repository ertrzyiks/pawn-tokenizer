pawn-tokenizer [![Build Status](https://travis-ci.org/ertrzyiks/pawn-tokenizer.svg?branch=master)](https://travis-ci.org/ertrzyiks/pawn-tokenizer)
==============

Based on [c-tokenizer](https://github.com/substack/c-tokenizer)

# example

``` js
var tokenize = require('../lib');
var t = tokenize(function (src, token) {
    console.log(token.type + ' => ' + JSON.stringify(src));
});
process.stdin.pipe(t);
```

For the input file plugin.sma:

``` c
#include <amxmodx>

public plugin_init(){
    register("Plugin Name", "1.0", "Author");
}
```

output:

```
$ node example/tokens.js < example/plugin.sma
directive => "#include"
whitespace => " "
operator => "<"
identifier => "amxmodx"
operator => ">"
whitespace => "\n"
whitespace => "\n"
keyword => "public"
whitespace => " "
identifier => "plugin_init"
open paren => "("
close paren => ")"
open curly => "{"
whitespace => "\n"
whitespace => " "
whitespace => " "
whitespace => " "
whitespace => " "
identifier => "register"
open paren => "("
quote => "\"Plugin Name\""
operator => ","
whitespace => " "
quote => "\"1.0\""
operator => ","
whitespace => " "
quote => "\"Author\""
close paren => ")"
operator => ";"
whitespace => "\n"
close curly => "}"
whitespace => "\n"
```

# install

With [npm](https://npmjs.org) do:

```
npm install pawn-tokenizer
```

# license

MIT
