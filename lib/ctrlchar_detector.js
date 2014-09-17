var STATUS_NONE = 0,
    STATUS_PRAGMA = 1,
    STATUS_CTRLCHAR = 2,
    STATUS_WAIT_FOR_CHAR = 3;

function CtrlcharDetector(cb) {
    this.cb = cb;
    this.onToken = this.onToken.bind(this);
}

CtrlcharDetector.prototype.status = STATUS_NONE;
CtrlcharDetector.prototype.cb = function () {};

CtrlcharDetector.prototype.onToken = function (src, type) {  
    src = src + "";
    
    switch (this.status) {
        case STATUS_NONE:
            this.onTokenAfterNone(src, type);
            break;
            
        case STATUS_PRAGMA:
            this.onTokenAfterPragma(src, type);
            break;
            
        case STATUS_CTRLCHAR:
            this.onTokenAfterCtrlchar(src, type);
            break;
            
        case STATUS_WAIT_FOR_CHAR:
            this.onTokenAfterWaitingForChar(src, type);
            break;
    }
};

CtrlcharDetector.prototype.onTokenAfterNone = function (src, type) {
    if ("directive" === type && "#pragma" === src) {
        this.status = STATUS_PRAGMA;
    }
};

CtrlcharDetector.prototype.onTokenAfterPragma = function (src, type) {
    if ("identifier" === type) {
        if ("ctrlchar" === src) {
            this.status = STATUS_CTRLCHAR;
        } else {
            this.status = STATUS_NONE;
        }
    } else if ("whitespace" !== type) {
        this.status = STATUS_NONE;
    }
};

CtrlcharDetector.prototype.onTokenAfterCtrlchar = function (src, type) {
    if ("whitespace" === type) {
        if ('\n' !== src) {
            this.status = STATUS_WAIT_FOR_CHAR;
        } else {
            this.status = STATUS_NONE;
        }
    }
};

CtrlcharDetector.prototype.onTokenAfterWaitingForChar = function (src, type) {
    if ('char' === type) {
        this.cb(src.slice(1, 2));
    }
    
    this.status = STATUS_NONE;
};

module.exports = CtrlcharDetector;
