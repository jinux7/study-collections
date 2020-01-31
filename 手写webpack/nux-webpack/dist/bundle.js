(function(modules) {
    function require(id) {
      const fn = modules[id][0],
            mapping = modules[id][1];
      function localRequire(relativePath) {
        return require(mapping[relativePath]);
      }
      const module = {
        exports: {}
      };
      fn(localRequire, module, module.exports);
      return module.exports;
    }
    require(0);
  })({
      0: [
        function(require, module, exports) {
          "use strict";

var _a = _interopRequireDefault(require("./a.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function fn() {
  console.log(_a["default"]);
}

fn();
        },
        {"./a.js":1}
      ],
    
      1: [
        function(require, module, exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _b = _interopRequireDefault(require("./b.js"));

var _c = _interopRequireDefault(require("./c.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var a = 'aaaaa';

var _default = a + _b["default"] + _c["default"];

exports["default"] = _default;
        },
        {"./b.js":2,"./c.js":3}
      ],
    
      2: [
        function(require, module, exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var b = 'bbbbb';
var _default = b;
exports["default"] = _default;
        },
        {}
      ],
    
      3: [
        function(require, module, exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var c = 'ccccc';
var _default = c;
exports["default"] = _default;
        },
        {}
      ],
    })