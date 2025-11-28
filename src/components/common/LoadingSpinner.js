"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoadingSpinner;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
function LoadingSpinner(_a) {
    var _b = _a.fullScreen, fullScreen = _b === void 0 ? false : _b, text = _a.text, _c = _a.className, className = _c === void 0 ? '' : _c;
    if (fullScreen) {
        return (<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <lucide_react_1.Loader2 className="h-12 w-12 animate-spin text-primary"/>
                {text && <p className="mt-4 text-lg font-medium text-muted-foreground">{text}</p>}
            </div>);
    }
    return (<div className={"flex flex-col items-center justify-center p-4 ".concat(className)}>
            <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-primary"/>
            {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
        </div>);
}
