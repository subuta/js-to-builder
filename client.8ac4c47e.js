webpackJsonp([1],{

/***/ 157:
/*!*****************************!*\
  !*** ./lib/utils/recast.js ***!
  \*****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSuperTypeList = exports.getAllFields = exports.getBuildParams = exports.getTypeName = exports.getBuilderName = undefined;

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

var _astTypes = __webpack_require__(/*! ast-types */ 30);

var types = _interopRequireWildcard(_astTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var n = types.namedTypes,
    b = types.builders,
    Type = types.Type;

var def = Type.def;

// FROM https://github.com/benjamn/ast-types/blob/master/lib/types.js#L612
var getBuilderName = exports.getBuilderName = function getBuilderName(typeName) {
  return typeName.replace(/^[A-Z]+/, function (upperCasePrefix) {
    var len = upperCasePrefix.length;
    switch (len) {
      case 0:
        return '';
      // If there's only one initial capital letter, just lower-case it.
      case 1:
        return upperCasePrefix.toLowerCase();
      default:
        // If there's more than one initial capital letter, lower-case
        // all but the last one, so that XMLDefaultDeclaration (for
        // example) becomes xmlDefaultDeclaration.
        return upperCasePrefix.slice(0, len - 1).toLowerCase() + upperCasePrefix.charAt(len - 1);
    }
  });
};

// builderName -> nodeType
var getTypeName = exports.getTypeName = function getTypeName(builderName) {
  return builderName.replace(/^[a-z]+/, function (lowerCasePrefix) {
    if (lowerCasePrefix === 'jsx') return 'JSX'; // Fix for irregular builderName
    var len = lowerCasePrefix.length;
    switch (len) {
      case builderName.length:
        return _lodash2.default.upperFirst(builderName);
      case 1:
      default:
        return _lodash2.default.upperFirst(lowerCasePrefix);
    }
  });
};

// get buildParams from builderName
var getBuildParams = exports.getBuildParams = function getBuildParams(builderName) {
  return _lodash2.default.clone(def(getTypeName(builderName)).buildParams);
};

// get buildParams from builderName
var getAllFields = exports.getAllFields = function getAllFields(builderName) {
  return _lodash2.default.clone(def(getTypeName(builderName)).allFields);
};

// get superTypeList from builderName
var getSuperTypeList = exports.getSuperTypeList = function getSuperTypeList(builderName) {
  return _lodash2.default.clone(def(getTypeName(builderName)).supertypeList);
};

/***/ }),

/***/ 158:
/*!******************!*\
  !*** ./lib/h.js ***!
  \******************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

var _icepick = __webpack_require__(/*! icepick */ 156);

var _icepick2 = _interopRequireDefault(_icepick);

var _recast = __webpack_require__(/*! ./utils/recast */ 157);

var _astTypes = __webpack_require__(/*! ast-types */ 30);

var types = _interopRequireWildcard(_astTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var b = types.builders;


var isArrayParam = function isArrayParam(param) {
  return (/\[.*\]/.test(param)
  );
};
var isOnlyBooleanParam = function isOnlyBooleanParam(param) {
  return _lodash2.default.trim(param) === 'boolean';
};

var h = function h(tagName, props) {
  for (var _len = arguments.length, _children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    _children[_key - 2] = arguments[_key];
  }

  // initialize props with empty object if not defined.
  if (!props) props = {};

  var children = function () {
    // prefer props.children if defined
    if (props.children) return props.children;
    // allow array style children.
    if (_lodash2.default.isArray(_lodash2.default.first(_children)) && _children.length === 1) return _lodash2.default.first(_children);
    // otherwise use default jsx children.
    return _children;
  }();

  var renderFn = tagName;
  if (_lodash2.default.isString(tagName)) {
    renderFn = b[tagName];

    var params = (0, _recast.getBuildParams)(tagName);
    var fields = (0, _recast.getAllFields)(tagName);

    var args = [];
    var fromLast = false;
    var frozenParams = _icepick2.default.freeze([].concat(_toConsumableArray(params))); // keep original params for get index.

    while (params.length) {
      var p = fromLast ? params.pop() : params.shift();
      var i = _lodash2.default.indexOf(frozenParams, p);

      if (p === undefined) continue;

      var name = fields[p].toString();
      var typeDef = name.split(':');

      // return prop if found by param
      if (props[p] !== undefined) {
        args[i] = props[p];
        continue;
      }

      var hasChildren = children.length >= 1;
      var hasNext = params.length > 0;

      if (isOnlyBooleanParam(typeDef[1])) {
        // set false if type is boolean and no value found in props.
        args[i] = false;
        continue;
      } else if (isArrayParam(typeDef[1])) {
        if (hasNext) {
          // put param to params again and reverse search order.
          params.unshift(p);
          fromLast = true;
          continue;
        }

        if (hasChildren) {
          args[i] = children;
          continue;
        }

        // return empty array if params allows array and value not found
        args[i] = [];
        continue;
      } else if (hasChildren) {
        args[i] = fromLast ? children.pop() : children.shift();
        continue;
      }

      // throw error if no suitable value found.
      throw new Error('Cannot find value for ' + (0, _recast.getTypeName)(tagName) + ' ' + name);
    }

    var builder = renderFn.apply(this, [].concat(args));
    builder = _extends({}, builder, props); // merge extra props

    if (props.es) {
      builder = b.expressionStatement(builder);
    }

    return builder;
  } else {
    return renderFn(_extends({}, props, { children: children }));
  }
};

exports.default = h;

/***/ }),

/***/ 184:
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = exports.simple = exports.print = exports.format = exports.toBuilder = undefined;

var _transform = __webpack_require__(/*! ./transform */ 365);

var _transform2 = _interopRequireDefault(_transform);

var _formatter = __webpack_require__(/*! ./utils/formatter */ 185);

var _formatter2 = _interopRequireDefault(_formatter);

var _print = __webpack_require__(/*! ./utils/print */ 559);

var _print2 = _interopRequireDefault(_print);

var _h = __webpack_require__(/*! ./h */ 158);

var _h2 = _interopRequireDefault(_h);

var _simple = __webpack_require__(/*! ./components/simple */ 560);

var simple = _interopRequireWildcard(_simple);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// named export
exports.toBuilder = _transform2.default;
exports.format = _formatter2.default;
exports.print = _print2.default;
exports.simple = simple;
exports.h = _h2.default;

// default export

exports.default = {
  toBuilder: _transform2.default,
  format: _formatter2.default,
  print: _print2.default,
  simple: simple,
  h: _h2.default
};

/***/ }),

/***/ 185:
/*!********************************!*\
  !*** ./lib/utils/formatter.js ***!
  \********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.babylonOpts = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _babylon = __webpack_require__(/*! babylon */ 186);

var babylon = _interopRequireWildcard(_babylon);

var _prettier = __webpack_require__(/*! prettier */ 366);

var _prettier2 = _interopRequireDefault(_prettier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var babylonOpts = exports.babylonOpts = {
  sourceType: 'module',
  strictMode: false,
  tokens: false,
  plugins: ['jsx', 'flow', 'estree', 'objectRestSpread', 'classProperties', 'dynamicImport', 'optionalChaining', 'throwExpressions']
};

exports.default = function (code) {
  var RULE = {
    tabWidth: 2,
    semi: false,
    printWidth: 80,
    singleQuote: true,
    bracketSpacing: true,
    originalText: code
  };

  return _prettier2.default.format(code, _extends({}, RULE, {
    parser: function parser(text) {
      return babylon.parse(text, babylonOpts);
    }
  }));
};

/***/ }),

/***/ 254:
/*!************************************!*\
  !*** ./lib/transform/toBuilder.js ***!
  \************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

var _icepick = __webpack_require__(/*! icepick */ 156);

var _icepick2 = _interopRequireDefault(_icepick);

var _astTypes = __webpack_require__(/*! ast-types */ 30);

var types = _interopRequireWildcard(_astTypes);

var _recast = __webpack_require__(/*! ../utils/recast */ 157);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var n = types.namedTypes,
    b = types.builders,
    getFieldNames = types.getFieldNames,
    getFieldValue = types.getFieldValue;
var parse = exports.parse = function parse(path) {
  var node = path.value;
  var NODE_TYPE = (0, _recast.getBuilderName)(node.type);

  var fieldNames = _lodash2.default.without(getFieldNames(node), 'type');
  var params = (0, _recast.getBuildParams)(NODE_TYPE);
  var props = {};
  var children = [];

  _lodash2.default.each(fieldNames, function (param) {
    var value = getFieldValue(node, param);
    var isEmptyArray = _lodash2.default.isArray(value) && _lodash2.default.isEmpty(value);
    // return if value is falsy or empty array.
    if (!value || isEmptyArray) return;
    params = _lodash2.default.uniq([].concat(_toConsumableArray(params), [param]));
  });

  _lodash2.default.each(params, function (param) {
    var value = getFieldValue(node, param);
    var isBool = _lodash2.default.isBoolean(value);
    var isString = _lodash2.default.isString(value);

    // following params will treat as props.
    // - String
    // - Boolean(true/false)
    // - null
    if (isString || isBool || value === null) {
      props[param] = value;
      return;
    }

    // will treat as children otherwise.
    if (_lodash2.default.isArray(value)) {
      value = _lodash2.default.map(value, function (value) {
        return _lodash2.default.get(value, 'jsx', value);
      });
    } else {
      value = _lodash2.default.get(value, 'jsx', value);
    }

    children = _icepick2.default.push(children, value);
  });

  // construct props
  var propsString = ' ' + _lodash2.default.map(props, function (value, key) {
    if (value === false) {
      // should not omit props if key is required(included in params).
      if (_lodash2.default.includes(params, key)) return key + '={false}';
      return '';
    }
    if (value === true) {
      // should not omit props if key is required(included in params).
      if (_lodash2.default.includes(params, key)) return key + '={true}';
      return '' + key;
    }
    if (value === null) return key + '={null}';
    return key + '="' + value + '"';
  }).join(' ');

  // construct children
  children = _lodash2.default.flatten(children.map(function (value) {
    if (_lodash2.default.isPlainObject(value)) return '{' + value + '}';
    if (_lodash2.default.isString(value) || _lodash2.default.isObject(value)) return value;
    return '{' + value + '}';
  })).join('\n');

  return {
    tagName: NODE_TYPE,
    props: props,
    propsString: propsString,
    children: children
  };
};

exports.default = function () {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (path) {
    var _option$shouldOmitPro = option.shouldOmitProgram,
        shouldOmitProgram = _option$shouldOmitPro === undefined ? false : _option$shouldOmitPro;


    var node = path.value;

    var _parse = parse(path),
        propsString = _parse.propsString,
        children = _parse.children,
        tagName = _parse.tagName;

    if (_lodash2.default.isEmpty(children)) {
      return path.replace(_extends({}, node, { jsx: '<' + tagName + propsString + ' />' }));
    }

    if (tagName === 'program') {
      if (shouldOmitProgram) return path.replace('' + children);
      return path.replace('<' + tagName + propsString + '>' + children + '</' + tagName + '>');
    }

    path.replace(_extends({}, node, { jsx: '<' + tagName + propsString + '>' + children + '</' + tagName + '>' }));
  };
};

/***/ }),

/***/ 321:
/*!**************************************************************************!*\
  !*** multi ./node_modules/react-hot-loader/patch.js ./docs-src/index.js ***!
  \**************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/subuta/repo/js-to-builder/node_modules/react-hot-loader/patch.js */322);
module.exports = __webpack_require__(/*! /Users/subuta/repo/js-to-builder/docs-src/index.js */325);


/***/ }),

/***/ 325:
/*!***************************!*\
  !*** ./docs-src/index.js ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(/*! react */ 5);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(/*! react-dom */ 115);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

__webpack_require__(/*! ./style */ 335);

var _style = __webpack_require__(/*! ./utils/style */ 82);

var _components = __webpack_require__(/*! ./components */ 358);

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window._ = _lodash2.default;

var App = function App() {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'h1',
      null,
      'test build'
    ),
    _react2.default.createElement(_components2.default, null)
  );
};

// styleを注入する。
App = (0, _style.wrap)(App);

var render = function render() {
  var appNode = document.getElementById('app');
  _reactDom2.default.render(_react2.default.createElement(App, null), appNode);
};

// Native
// Check if the DOMContentLoaded has already been completed
if (document.readyState === 'complete' || document.readyState !== 'loading') {
  render();
} else {
  document.addEventListener('DOMContentLoaded', render);
}

/***/ }),

/***/ 335:
/*!***************************!*\
  !*** ./docs-src/style.js ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _style = __webpack_require__(/*! ./utils/style */ 82);

var app = {
  position: 'relative',
  zIndex: 0
};

var body = {
  margin: 0,
  padding: 0,
  backgroundColor: '#FFFFFF',
  color: '#333333',
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace'
};

(0, _style.registerRules)({
  body: body,
  '#app': app
});

/***/ }),

/***/ 358:
/*!**************************************!*\
  !*** ./docs-src/components/index.js ***!
  \**************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(/*! react */ 5);

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

var _recompose = __webpack_require__(/*! recompose */ 183);

var _style = __webpack_require__(/*! ./style.js */ 364);

var _style2 = _interopRequireDefault(_style);

var _lib = __webpack_require__(/*! ../../lib */ 184);

var _Editor = __webpack_require__(/*! ./common/Editor */ 562);

var _Editor2 = _interopRequireDefault(_Editor);

var _babel = __webpack_require__(/*! ../utils/babel */ 734);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enhance = (0, _recompose.compose)((0, _recompose.withState)('code', 'setCode', ''), (0, _recompose.withState)('isSimple', 'setIsSimple', false), (0, _recompose.withState)('codeTemplate', 'setCodeTemplate', 'const hoge = \'fuga\''), (0, _recompose.withState)('builderError', 'setBuilderError', null), (0, _recompose.withPropsOnChange)(['code', 'setCode', 'isSimple', 'setCodeTemplate'], function (_ref) {
  var code = _ref.code,
      setCode = _ref.setCode,
      isSimple = _ref.isSimple,
      setCodeTemplate = _ref.setCodeTemplate;

  var jsx = null;
  var error = null;

  if (_lodash2.default.isEmpty(code)) return;

  // because toBuilder will throw syntax error while editing :)
  try {
    jsx = (0, _lib.toBuilder)(code, { simple: isSimple }).code;
  } catch (e) {
    error = e.toString();
  }

  return {
    jsx: jsx,
    codeError: error,
    setCode: _lodash2.default.debounce(setCode, 1000 / 60), // debounce setCode call
    setCodeTemplate: _lodash2.default.debounce(setCodeTemplate, 1000 / 60) // debounce setCodeTemplate call
  };
}), (0, _recompose.withHandlers)({
  handleToggleSimpleChange: function handleToggleSimpleChange(_ref2) {
    var setIsSimple = _ref2.setIsSimple;
    return function (e) {
      setIsSimple(e.target.checked);
    };
  },
  handleBuilderChange: function handleBuilderChange(_ref3) {
    var setCodeTemplate = _ref3.setCodeTemplate,
        setBuilderError = _ref3.setBuilderError;
    return function (value) {
      if (_lodash2.default.isEmpty(value)) return;
      var jsxCode = '/** @jsx h */ ' + value;
      try {
        var code = (0, _lib.format)((0, _babel.babelAndEval)(jsxCode));
        setBuilderError(null);
        setCodeTemplate((0, _lib.format)('\n          ' + code + '\n        '));
      } catch (e) {
        setBuilderError(e);
      }
    };
  }
}));

exports.default = enhance(function (props) {
  var setCode = props.setCode,
      jsx = props.jsx,
      codeError = props.codeError,
      builderError = props.builderError,
      codeTemplate = props.codeTemplate,
      handleToggleSimpleChange = props.handleToggleSimpleChange,
      handleBuilderChange = props.handleBuilderChange,
      isSimple = props.isSimple;


  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      { className: _style2.default.Content },
      _react2.default.createElement(
        'h3',
        null,
        'js-to-builder'
      ),
      _react2.default.createElement(
        'a',
        { href: 'https://github.com/subuta/js-to-builder', target: '_blank' },
        'https://github.com/subuta/js-to-builder'
      ),
      _react2.default.createElement(
        'div',
        { className: _style2.default.ToggleSimple },
        _react2.default.createElement(
          'b',
          null,
          'EXPERIMENTAL:'
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.ToggleSimpleInput },
          _react2.default.createElement(
            'label',
            { htmlFor: 'is-simple' },
            'simple?'
          ),
          _react2.default.createElement('input', {
            id: 'is-simple',
            type: 'checkbox',
            defaultChecked: isSimple,
            onChange: handleToggleSimpleChange
          })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: _style2.default.Editors },
        _react2.default.createElement(_Editor2.default, {
          onChange: function onChange(value) {
            setCode(value);
          },
          template: codeTemplate,
          error: codeError
        }),
        _react2.default.createElement(_Editor2.default, {
          onChange: handleBuilderChange,
          template: jsx || '',
          error: builderError
        })
      )
    ),
    _react2.default.createElement(
      'div',
      { className: _style2.default.Footer },
      _react2.default.createElement(
        'a',
        { href: 'https://github.com/subuta', target: '_blank' },
        'by @subuta'
      )
    )
  );
});

/***/ }),

/***/ 364:
/*!**************************************!*\
  !*** ./docs-src/components/style.js ***!
  \**************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _style = __webpack_require__(/*! ../utils/style */ 82);

var Content = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  padding: 16,
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  fontSize: 13,
  color: '#24292e',

  '& > h3': {
    marginTop: 0
  }
};

var ToggleSimple = {
  margin: '16px 0 0'
};

var ToggleSimpleInput = {
  margin: '4px 0 0',
  cursor: 'pointer',

  '& > label': {
    margin: '0 4px 0 0',
    userSelect: 'none'
  }
};

var Editors = {
  margin: '16px 0 0',
  display: 'flex',
  alignItems: 'flex-start',
  flex: '1 1 100%',
  '& > *': {
    margin: '0 16px 0 0',
    '&:nth-of-type(2)': {
      margin: 0
    }
  }
};

var Footer = {
  margin: '0 0 16px',
  padding: '0 16px',
  display: 'flex',
  justifyContent: 'flex-end',

  '& > a': {
    marginTop: 0
  }
};

exports.default = (0, _style.registerStyles)({
  Content: Content,
  ToggleSimple: ToggleSimple,
  ToggleSimpleInput: ToggleSimpleInput,
  Editors: Editors,
  Footer: Footer
});

/***/ }),

/***/ 365:
/*!********************************!*\
  !*** ./lib/transform/index.js ***!
  \********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _formatter = __webpack_require__(/*! ../utils/formatter */ 185);

var _formatter2 = _interopRequireDefault(_formatter);

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

var _recast = __webpack_require__(/*! recast */ 225);

var _recast2 = _interopRequireDefault(_recast);

var _astTypes = __webpack_require__(/*! ast-types */ 30);

var types = _interopRequireWildcard(_astTypes);

var _babylon = __webpack_require__(/*! babylon */ 186);

var babylon = _interopRequireWildcard(_babylon);

var _toSimple = __webpack_require__(/*! ./toSimple */ 558);

var _toSimple2 = _interopRequireDefault(_toSimple);

var _toBuilder = __webpack_require__(/*! ./toBuilder */ 254);

var _toBuilder2 = _interopRequireDefault(_toBuilder);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var n = types.namedTypes,
    b = types.builders;

exports.default = function (code) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _option$simple = option.simple,
      simple = _option$simple === undefined ? false : _option$simple;


  var recastOpts = {
    parser: {
      parse: function parse(source) {
        return babylon.parse(source, _formatter.babylonOpts);
      }
    }
  };

  var transform = simple ? (0, _toSimple2.default)(option) : (0, _toBuilder2.default)(option);
  var ast = _recast2.default.parse(code, recastOpts);

  // modify ast.
  types.visit(ast, {
    visitComment: function visitComment(path) {
      this.traverse(path);
      transform(path);
    },
    visitNode: function visitNode(path) {
      this.traverse(path);
      transform(path);
    }
  });

  var jsxCode = _recast2.default.print(ast).code;

  var result = 'const render = () => (\n    ' + jsxCode + '\n  )';

  return {
    code: (0, _formatter2.default)(result)
  };
};

/***/ }),

/***/ 557:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 558:
/*!***********************************!*\
  !*** ./lib/transform/toSimple.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

var _icepick = __webpack_require__(/*! icepick */ 156);

var _icepick2 = _interopRequireDefault(_icepick);

var _astTypes = __webpack_require__(/*! ast-types */ 30);

var types = _interopRequireWildcard(_astTypes);

var _recast = __webpack_require__(/*! ../utils/recast */ 157);

var _os = __webpack_require__(/*! os */ 142);

var _os2 = _interopRequireDefault(_os);

var _toBuilder = __webpack_require__(/*! ./toBuilder */ 254);

var _toBuilder2 = _interopRequireDefault(_toBuilder);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var n = types.namedTypes,
    b = types.builders,
    getFieldNames = types.getFieldNames,
    getFieldValue = types.getFieldValue;

exports.default = function () {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var builderTransform = (0, _toBuilder2.default)(option);

  var _option$shouldOmitPro = option.shouldOmitProgram,
      shouldOmitProgram = _option$shouldOmitPro === undefined ? false : _option$shouldOmitPro,
      _option$shouldAddFiel = option.shouldAddFieldNames,
      shouldAddFieldNames = _option$shouldAddFiel === undefined ? false : _option$shouldAddFiel;


  return function (path) {
    var node = path.node;

    var replace = function replace(jsx) {
      return path.replace(_extends({}, node, { jsx: jsx }));
    };

    var _parse = (0, _toBuilder.parse)(path),
        tagName = _parse.tagName,
        props = _parse.props,
        children = _parse.children;

    if (!node) return;

    var NODE_TYPE = tagName;

    if (NODE_TYPE === 'program') {
      if (shouldOmitProgram) return path.replace('' + children);
      return path.replace('<program>' + children + '</program>');
    }

    // run toBuilder first to get jsx.
    builderTransform(path);

    // Expression
    if (NODE_TYPE === 'callExpression') {
      var args = _lodash2.default.map(node.arguments, function (argument) {
        return argument.jsx;
      }).join('\n');
      var withES = n.ExpressionStatement.check(path.parentPath.node);
      var calleeNode = node.callee;

      var callee = getFieldValue(node.callee, 'name');
      // if nested FnCall
      if (n.MemberExpression.check(calleeNode) && n.CallExpression.check(calleeNode.object)) {
        return replace('\n          <FnCall callee="' + node.callee.property.name + '" ' + (withES ? 'es' : '') + '>\n            ' + node.callee.jsx + '\n            ' + args + '\n          </FnCall>\n        ');
      } else if (n.MemberExpression.check(calleeNode)) {
        callee = getFieldValue(calleeNode, 'jsx');
      }

      if (!callee) {
        return replace('<FnCall ' + (withES ? 'es' : '') + '>' + node.callee.jsx + args + '</FnCall>');
      }

      return replace('<FnCall ' + (callee ? 'callee="' + callee + '"' : '') + ' ' + (withES ? 'es' : '') + '>' + args + '</FnCall>');
    } else if (NODE_TYPE === 'memberExpression') {
      // if nested FnCall
      var objectNode = node.object;
      var propertyNode = node.property;
      if (n.CallExpression.check(objectNode)) {
        return replace('' + objectNode.jsx);
      } else if (n.Identifier.check(objectNode)) {
        return replace(objectNode.name + '.' + propertyNode.name);
      } else if (n.ThisExpression.check(objectNode)) {
        return replace(objectNode.jsx + '.' + propertyNode.name);
      }
      return replace(objectNode.jsx + '.' + propertyNode.jsx);
    } else if (NODE_TYPE === 'arrowFunctionExpression') {
      var params = _lodash2.default.map(node.params, function (param) {
        return param.jsx;
      }).join('\n');
      return replace('<ArrowFn ' + (node.async ? 'async' : '') + ' ' + (node.generator ? 'generator' : '') + '>' + params + node.body.jsx + '</ArrowFn>');
    } else if (NODE_TYPE === 'objectExpression') {
      var properties = _lodash2.default.transform(node.properties, function (result, property) {
        var value = '';
        if (n.Identifier.check(property.value)) {
          value = property.value.name;
        } else if (n.Literal.check(property.value)) {
          value = '\'' + property.value.value + '\'';
        }
        result.push([property.key.name, value]);
      }, []);
      properties = '{' + _lodash2.default.map(properties, function (property) {
        return property.join(':');
      }) + '}';

      var _withES = n.ExpressionStatement.check(node.parent);

      // if JSX
      if (n.JSXExpressionContainer.check(path.parentPath.node)) {
        return replace('' + properties);
      }

      return replace('\n        <Value ' + (_withES ? 'es' : '') + '>{' + properties + '}</Value>\n      ');
    } else if (NODE_TYPE === 'arrayExpression') {
      var elements = _lodash2.default.trim(_lodash2.default.map(node.elements, function (element) {
        return element.value;
      }).join(','));
      var _withES2 = n.ExpressionStatement.check(path.parentPath.node);
      return replace('<Value ' + (_withES2 ? 'es' : '') + '>{[' + (_lodash2.default.isEmpty(node.elements) ? '' : elements) + ']}</Value>');
    } else if (NODE_TYPE === 'BinaryExpression') {
      return path.replace('\n      <binaryExpression operator="' + node.operator + '">\n        ' + node.left.jsx + node.right.jsx + '\n      </binaryExpression>\n    ');
    } else if (NODE_TYPE === 'assignmentExpression') {
      return replace('\n      <assignmentExpression operator="' + node.operator + '">\n        ' + node.left.jsx + '\n        ' + node.right.jsx + '\n      </assignmentExpression>\n    ');
    } else if (NODE_TYPE === 'UpdateExpression') {
      return path.replace('\n      <updateExpression operator="' + node.operator + '" prefix={' + node.prefix + '}>\n        ' + node.argument.jsx + '\n      </updateExpression>\n    ');
    } else if (NODE_TYPE === 'functionExpression') {
      var _params = _lodash2.default.map(node.params, function (param) {
        return param.jsx;
      }).join('\n');
      return replace('<Fn ' + (node.id ? 'id="' + node.id.name + '"' : '') + ' ' + (node.async ? 'async' : '') + ' ' + (node.generator ? 'generator' : '') + '>' + _params + node.body.jsx + '</Fn>');
    } else if (NODE_TYPE === 'thisExpression') {
      return replace('this');
    }

    // Statement
    if (NODE_TYPE === 'expressionStatement') {
      return replace('' + children);
    } else if (NODE_TYPE === 'BlockStatement') {
      return;
    } else if (NODE_TYPE === 'ReturnStatement') {
      return path.replace('\n      <returnStatement>' + node.argument.jsx + '</returnStatement>\n    ');
    } else if (NODE_TYPE === 'DebuggerStatement') {
      return path.replace('\n      <debuggerStatement />\n    ');
    } else if (NODE_TYPE === 'IfStatement') {
      return path.replace('\n      <ifStatement>\n        ' + node.test.jsx + node.consequent.jsx + (node.alternate ? node.alternate.jsx : '') + '\n      </ifStatement>\n    ');
    } else if (NODE_TYPE === 'BreakStatement') {
      return path.replace('\n      <breakStatement>\n        ' + (node.label ? node.label.jsx : '') + '\n      </breakStatement>\n    ');
    } else if (NODE_TYPE === 'ContinueStatement') {
      return path.replace('\n      <continueStatement>\n        ' + (node.label ? node.label.jsx : '') + '\n      </continueStatement>\n    ');
    } else if (NODE_TYPE === 'ForStatement') {
      return path.replace('\n      <forStatement>\n        ' + node.init.jsx + node.test.jsx + path.replace.jsx + node.body.jsx + '\n      </forStatement>\n    ');
    } else if (NODE_TYPE === 'ForInStatement') {
      return replace('<forInStatement>' + node.left.jsx + node.right.jsx + node.body.jsx + '</forInStatement>\n    ');
    } else if (NODE_TYPE === 'ForOfStatement') {
      return path.replace('\n      <forOfStatement>\n        ' + node.left.jsx + node.right.jsx + node.body.jsx + '\n      </forOfStatement>\n    ');
    } else if (NODE_TYPE === 'DoWhileStatement') {
      return path.replace('\n      <doWhileStatement>\n        ' + node.body.jsx + node.test.jsx + '\n      </doWhileStatement>\n    ');
    } else if (NODE_TYPE === 'WhileStatement') {
      return path.replace('\n      <whileStatement>\n        ' + node.test.jsx + node.body.jsx + '\n      </whileStatement>\n    ');
    } else if (NODE_TYPE === 'LabeledStatement') {
      return path.replace('\n      <labeledStatement>\n        ' + node.label.jsx + node.body.jsx + '\n      </labeledStatement>\n    ');
    }

    // Primitive
    if (NODE_TYPE === 'literal') {
      var value = '{' + node.value + '}';
      if (_lodash2.default.isString(node.value)) {
        value = node.value;
      }
      if (node.value === '') {
        return replace('<Value value={""}/>');
      }
      return replace('<Value>' + value + '</Value>');
    } else if (NODE_TYPE === 'identifier') {
      var _withES3 = n.ExpressionStatement.check(path.parentPath.node);
      return replace('<identifier ' + (_withES3 ? 'es' : '') + '>' + node.name + '</identifier>');
    }

    // Other
    if (NODE_TYPE === 'Property') {
      // TODO: なぜかnode.key.jsxとnode.value.jsxの結果が同じになるのの調査
      var key = node.key.jsx;
      if (node.key.type === 'Identifier') {
        key = '<identifier>' + node.key.name + '</identifier>';
      }
      return path.replace('\n      <property ' + (node.kind ? 'kind="' + node.kind + '"' : '') + '\n                ' + (node.method ? 'method' : '') + '\n                ' + (node.shorthand ? 'shorthand' : '') + '\n                ' + (node.computed ? 'computed' : '') + '\n      >\n        ' + key + node.value.jsx + '\n      </property>\n    ');
    }

    // Pattern
    if (NODE_TYPE === 'assignmentPattern') {
      return replace('<assignmentPattern>' + node.left.jsx + node.right.jsx + '</assignmentPattern>');
    } else if (NODE_TYPE === 'objectPattern') {
      var _properties = _lodash2.default.map(node.properties, function (property) {
        return property.jsx;
      }).join('\n');
      return replace('<objectPattern>' + _properties + '</objectPattern>');
    }

    // ES6 import
    if (NODE_TYPE === 'importDeclaration') {
      var specifier = _lodash2.default.first(node.specifiers);
      if (node.specifiers.length > 1 || n.ImportSpecifier.check(specifier)) {
        var specifiers = _lodash2.default.map(node.specifiers, function (specifier) {
          return specifier.jsx;
        }).join('\n');
        return replace('<Import source="' + node.source.value + '">' + specifiers + '</Import>');
      } else {
        var _specifier = _lodash2.default.first(node.specifiers);
        var isDefault = n.ImportDefaultSpecifier.check(_specifier);
        return replace('<Import name="' + _specifier.jsx + '" source="' + node.source.value + '" ' + (isDefault ? 'default' : '') + '/>');
      }
    } else if (NODE_TYPE === 'importDefaultSpecifier') {
      return replace('' + node.local.name);
    } else if (NODE_TYPE === 'importNamespaceSpecifier') {
      return replace('' + node.local.name);
    } else if (NODE_TYPE === 'importSpecifier') {
      // Fix circular.
      return replace('<importSpecifier>' + node.imported.jsx + node.local.jsx + '</importSpecifier>');
    }

    // ES6 export
    if (NODE_TYPE === 'exportDefaultDeclaration') {
      return replace('<Export default>' + node.declaration.jsx + '</Export>');
    } else if (NODE_TYPE === 'exportNamedDeclaration') {
      return replace('<Export>' + node.declaration.jsx + '</Export>');
    }

    // Variable
    if (NODE_TYPE === 'variableDeclarator') {
      var declarations = path.parentPath.value;

      // apply update if id.type === ObjectPattern
      if (n.ObjectPattern.check(node.id)) {
        return replace('<Declarator>' + node.id.jsx + (node.init ? node.init.jsx : '') + '</Declarator>');
      }

      // skip update if parent not use declarator.
      if (declarations.length <= 1) return;

      return replace('<Declarator name="' + node.id.name + '">' + (node.init ? node.init.jsx : '') + '</Declarator>');
    } else if (NODE_TYPE === 'variableDeclaration') {
      // defaults
      var name = null;
      var _declarations = _lodash2.default.map(node.declarations, function (declaration) {
        return declaration.jsx;
      }).join('\n');

      // if single variable declaration
      if (node.declarations.length === 1 && n.VariableDeclarator.check(_lodash2.default.first(node.declarations))) {
        var declarator = _lodash2.default.first(node.declarations);
        _declarations = declarator.init ? ['' + declarator.init.jsx] : [];
        // set name only if id.type = 'Identifier'
        if (n.Identifier.check(declarator.id)) {
          name = declarator.id.name;
        } else if (n.ObjectPattern.check(declarator.id)) {
          _declarations = ['' + declarator.jsx];
        } else if (n.ArrayPattern.check(declarator.id)) {
          _declarations = ['' + declarator.jsx];
        }
      }

      if (_lodash2.default.toLower(node.kind) === 'const') {
        return replace('<Const ' + (name ? 'name="' + name + '"' : '') + '>' + _declarations + '</Const>');
      } else if (_lodash2.default.toLower(node.kind) === 'let') {
        return replace('<Let ' + (name ? 'name="' + name + '"' : '') + '>' + _declarations + '</Let>');
      } else if (_lodash2.default.toLower(node.kind) === 'var') {
        return replace('<Var ' + (name ? 'name="' + name + '"' : '') + '>' + _declarations + '</Var>');
      }
    }

    // jsx
    if (NODE_TYPE === 'jsxIdentifier') {
      return replace('' + node.name);
    } else if (NODE_TYPE === 'JSXOpeningElement') {
      return;
    } else if (NODE_TYPE === 'JSXClosingElement') {
      return;
    } else if (NODE_TYPE === 'jsxText') {
      return replace('' + node.value);
    } else if (NODE_TYPE === 'jsxElement') {
      var openingElement = node.openingElement;

      var _children = _lodash2.default.map(node.children, function (child) {
        return child.jsx;
      }).join('\n');
      var attributes = _lodash2.default.map(openingElement.attributes, function (child) {
        return child.jsx;
      }).join('\n');
      var _tagName = openingElement.name.jsx;
      return replace('\n        <JSX\n          tagName="' + _tagName + '"\n          ' + attributes + '\n        >\n          ' + _children + '\n        </JSX>\n      ');
    } else if (NODE_TYPE === 'jsxAttribute') {
      if (!node.name) return replace('');

      var _value = node.value ? '{' + node.value.jsx + '}' : '';
      if (n.Literal.check(node.value)) {
        _value = '"' + node.value.value + '"';
      }

      return replace('' + node.name.jsx + (_value ? '=' + _value : ''));
    } else if (NODE_TYPE === 'jsxExpressionContainer') {
      return replace(node.expression.jsx);
    }

    // ES6
    if (NODE_TYPE === 'yieldExpression') {
      return;
    }

    if (NODE_TYPE === 'classDeclaration') {
      return replace('<ClassDef id="' + (node.id ? node.id.name : 'null') + '">' + (node.superClass ? node.superClass.jsx : '') + node.body.jsx + '</ClassDef>');
    } else if (NODE_TYPE === 'ClassExpression') {
      var _args = _lodash2.default.map(node.arguments, function (argument) {
        return argument.jsx;
      }).join('\n');
      return path.replace('<classExpression>' + _args + '</classExpression>');
    } else if (NODE_TYPE === 'classBody') {
      var body = _lodash2.default.map(node.body, function (row) {
        return row.jsx;
      }).join('\n');
      return replace('' + body);
    } else if (NODE_TYPE === 'methodDefinition') {
      if (n.Expression.check(node.key)) {
        return replace('<Method kind="' + node.kind + '" ' + (node.static ? 'static' : '') + '>' + node.key.jsx + node.value.jsx + '</Method>');
      }
      return replace('<Method kind="' + node.kind + '" key={' + node.key.jsx + '} ' + (node.static ? 'static' : '') + '>' + node.value.jsx + '</Method>');
    }

    // ES7
    if (NODE_TYPE === 'AwaitExpression') {
      return path.replace('<awaitExpression>' + node.argument.jsx + '</awaitExpression>');
    }
  };
};

/***/ }),

/***/ 559:
/*!****************************!*\
  !*** ./lib/utils/print.js ***!
  \****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _recast = __webpack_require__(/*! recast */ 225);

var _astTypes = __webpack_require__(/*! ast-types */ 30);

var types = _interopRequireWildcard(_astTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var n = types.namedTypes,
    b = types.builders,
    visit = types.visit,
    getFieldNames = types.getFieldNames,
    getFieldValue = types.getFieldValue;


var builderToCode = function builderToCode(builders) {
  return (0, _recast.print)(builders).code;
};

exports.default = builderToCode;

/***/ }),

/***/ 560:
/*!**********************************!*\
  !*** ./lib/components/simple.js ***!
  \**********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrowFn = exports.Var = exports.Let = exports.Const = exports.Method = exports.ClassDef = exports.Fn = exports.Export = exports.Import = exports.JSX = exports.FnStatement = exports.FnCall = exports.Declarator = exports.Value = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

var _hoc = __webpack_require__(/*! ./hoc */ 561);

var _h = __webpack_require__(/*! ../h */ 158);

var _h2 = _interopRequireDefault(_h);

var _astTypes = __webpack_require__(/*! ast-types */ 30);

var types = _interopRequireWildcard(_astTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /** @jsx h */

var n = types.namedTypes,
    b = types.builders;
var Value = exports.Value = (0, _hoc.withES)(function (props) {
  // try to parse as object first.
  var children = props.children;

  var value = _lodash2.default.get(props, 'value', _lodash2.default.first(children));
  if (_lodash2.default.isPlainObject(value)) {
    return (0, _h2.default)(
      'objectExpression',
      null,
      _lodash2.default.map(value, function (v, k) {
        return (0, _h2.default)(
          'property',
          { kind: 'init', method: false, shorthand: false, computed: false },
          (0, _h2.default)(
            'identifier',
            null,
            k
          ),
          (0, _h2.default)(
            'literal',
            null,
            v
          )
        );
      })
    );
  }

  // if value not defined and has empty children.
  if (value === undefined && _lodash2.default.isArray(children) && children.length === 0) return (0, _h2.default)('arrayExpression', null);

  if (_lodash2.default.isArray(children) && children.length > 1) {
    return (0, _h2.default)(
      'arrayExpression',
      null,
      _lodash2.default.map(children, function (value) {
        return (0, _h2.default)(
          'literal',
          null,
          value
        );
      })
    );
  }

  return (0, _h2.default)(
    'literal',
    null,
    value
  );
});

var Declarator = exports.Declarator = function Declarator(props) {
  var children = props.children;


  var value = props.value;
  if (props.value) {
    value = (0, _h2.default)(
      Value,
      null,
      props.value
    );
  } else {
    value = _lodash2.default.last(children);
  }

  var name = _lodash2.default.first(children);
  if (props.name) {
    name = (0, _h2.default)(
      'identifier',
      null,
      props.name
    );
  }

  return (0, _h2.default)(
    'variableDeclarator',
    null,
    name,
    value || null
  );
};

var VariableDeclarationCreator = function VariableDeclarationCreator(kind) {
  return function (props) {
    var children = function () {
      // props.value or if not wrapped with VariableDeclarator.
      if (props.value || !n.VariableDeclarator.check(_lodash2.default.first(props.children))) {
        return (0, _h2.default)(Declarator, props);
      }
      return props.children;
    }();

    return (0, _h2.default)(
      'variableDeclaration',
      { kind: kind },
      children
    );
  };
};

// function call
var FnCall = exports.FnCall = (0, _hoc.withES)(function (props) {
  var children = props.children;

  // if callee omitted.
  if (!props.callee) return (0, _h2.default)(
    'callExpression',
    null,
    children
  );

  var callee = (0, _h2.default)(
    'identifier',
    null,
    props.callee
  );
  if (n.CallExpression.check(_lodash2.default.first(children))) {
    // Check for nested FnCall
    // shift first child and pass CallExpression as MemberExpression's object.
    callee = (0, _h2.default)(
      'memberExpression',
      null,
      children.shift(),
      (0, _h2.default)(
        'identifier',
        null,
        props.callee
      )
    );
  } else if (_lodash2.default.indexOf(props.callee, '.') > -1 && props.callee.split('.').length > 1) {
    // if callee has dot notation.
    callee = (0, _h2.default)(
      'memberExpression',
      null,
      _lodash2.default.map(props.callee.split('.'), function (item) {
        return (0, _h2.default)(
          'identifier',
          null,
          item
        );
      })
    );
  }

  return (0, _h2.default)(
    'callExpression',
    null,
    [callee].concat(_toConsumableArray(children))
  );
});

var FnStatement = exports.FnStatement = function FnStatement(_ref) {
  var children = _ref.children;

  if (children.length === 1) {
    var child = _lodash2.default.first(children);
    // if FnCall passed.
    if (n.ExpressionStatement.check(child)) {
      return child.expression;
    }
    return child;
  }

  return (0, _h2.default)(
    'blockStatement',
    null,
    children
  );
};

var JSX = function JSX(props) {
  var tagName = props.tagName,
      children = props.children,
      rest = _objectWithoutProperties(props, ['tagName', 'children']);

  var attributes = _lodash2.default.reduce(rest, function (result, value, key) {
    var jsxValue = (0, _h2.default)(
      Value,
      null,
      value
    );

    // if object or false(bool)
    if (_lodash2.default.isPlainObject(value) || value === false) {
      jsxValue = (0, _h2.default)(
        'jsxExpressionContainer',
        null,
        jsxValue
      );
    }

    // if key only props(eg: hidden)
    if (value === true) {
      jsxValue = null;
    }

    return [].concat(_toConsumableArray(result), [(0, _h2.default)('jsxAttribute', {
      name: (0, _h2.default)('jsxIdentifier', { name: key }),
      value: jsxValue
    })]);
  }, []);

  var jsxChildren = _lodash2.default.map(children, function (child) {
    if (_lodash2.default.isString(child)) {
      return (0, _h2.default)('jsxText', { value: child });
    }
    return child;
  });

  return (0, _h2.default)(
    'jsxElement',
    null,
    [(0, _h2.default)(
      'jsxOpeningElement',
      { selfClosing: false },
      [(0, _h2.default)('jsxIdentifier', { name: tagName })].concat(_toConsumableArray(attributes))
    ), (0, _h2.default)(
      'jsxClosingElement',
      null,
      (0, _h2.default)('jsxIdentifier', { name: tagName })
    )].concat(_toConsumableArray(jsxChildren))
  );
};

exports.JSX = JSX;
var Import = exports.Import = function Import(props) {
  var specifiers = [];

  if (props.name) {
    specifiers = [(0, _h2.default)(
      'importNamespaceSpecifier',
      null,
      (0, _h2.default)('identifier', { name: props.name })
    )];

    if (props.default) {
      specifiers = [(0, _h2.default)(
        'importDefaultSpecifier',
        null,
        (0, _h2.default)('identifier', { name: props.name })
      )];
    }
  }

  if (!_lodash2.default.isEmpty(props.children)) {
    specifiers = props.children;
  }

  return (0, _h2.default)(
    'importDeclaration',
    { importKind: 'value' },
    [].concat(_toConsumableArray(specifiers), [(0, _h2.default)('literal', { value: props.source })])
  );
};

var Export = exports.Export = function Export(props) {
  var children = props.children;


  if (props.default) {
    return (0, _h2.default)(
      'exportDefaultDeclaration',
      null,
      children
    );
  }

  // otherwise treat as named export.
  return (0, _h2.default)(
    'exportNamedDeclaration',
    { source: null },
    children
  );
};

var Fn = exports.Fn = function Fn(props) {
  var nextProps = _extends({}, props, {
    // wrap id with identifier.
    id: props.id ? (0, _h2.default)(
      'identifier',
      null,
      props.id
    ) : null
  });
  return (0, _h2.default)('functionExpression', nextProps);
};

var ClassDef = exports.ClassDef = function ClassDef(props) {
  var children = props.children;

  var id = props.id ? (0, _h2.default)(
    'identifier',
    null,
    props.id
  ) : null;
  return (0, _h2.default)(
    'classDeclaration',
    { id: id },
    (0, _h2.default)(
      'classBody',
      null,
      children
    )
  );
};

var Method = exports.Method = function Method(props) {
  var kind = props.kind,
      children = props.children;

  var key = props.key ? (0, _h2.default)(
    'identifier',
    null,
    props.key
  ) : children.shift();
  return (0, _h2.default)(
    'methodDefinition',
    { kind: kind, 'static': props.static },
    key,
    children
  );
};

// const
var Const = exports.Const = VariableDeclarationCreator('const');
var Let = exports.Let = VariableDeclarationCreator('let');
var Var = exports.Var = VariableDeclarationCreator('var');

var ArrowFn = exports.ArrowFn = function ArrowFn(props) {
  return (0, _h2.default)('arrowFunctionExpression', props);
};

/***/ }),

/***/ 561:
/*!*******************************!*\
  !*** ./lib/components/hoc.js ***!
  \*******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withES = undefined;

var _h = __webpack_require__(/*! ../h */ 158);

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /** @jsx h */

// withExpression hoc
var withES = function withES(BaseComponent) {
  return function (_ref) {
    var es = _ref.es,
        rest = _objectWithoutProperties(_ref, ['es']);

    if (es) {
      return (0, _h2.default)(
        'expressionStatement',
        null,
        (0, _h2.default)(BaseComponent, rest)
      );
    }
    return (0, _h2.default)(BaseComponent, rest);
  };
};
exports.withES = withES;

/***/ }),

/***/ 562:
/*!****************************************************!*\
  !*** ./docs-src/components/common/Editor/index.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(/*! react */ 5);

var _react2 = _interopRequireDefault(_react);

var _slatePlainSerializer = __webpack_require__(/*! slate-plain-serializer */ 255);

var _slatePlainSerializer2 = _interopRequireDefault(_slatePlainSerializer);

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

var _recompose = __webpack_require__(/*! recompose */ 183);

var _style = __webpack_require__(/*! ./style */ 684);

var _style2 = _interopRequireDefault(_style);

var _plugins = __webpack_require__(/*! ./plugins */ 685);

var _plugins2 = _interopRequireDefault(_plugins);

var _createInitialState = __webpack_require__(/*! ./createInitialState */ 732);

var _createInitialState2 = _interopRequireDefault(_createInitialState);

var _slateReact = __webpack_require__(/*! slate-react */ 307);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enhance = (0, _recompose.compose)((0, _recompose.withState)('value', 'setValue', function (_ref) {
  var _ref$template = _ref.template,
      template = _ref$template === undefined ? '' : _ref$template;
  return (0, _createInitialState2.default)(template.split('\n'));
}), (0, _recompose.withPropsOnChange)(['onChange'], function (_ref2) {
  var onChange = _ref2.onChange;
  return {
    onChange: _lodash2.default.debounce(onChange, 10)
  };
}), (0, _recompose.withPropsOnChange)(['template'], function (_ref3) {
  var template = _ref3.template,
      setValue = _ref3.setValue;

  // update Value and parent htmlPart.
  setValue((0, _createInitialState2.default)(template.split('\n')));
}), (0, _recompose.withHandlers)({
  handleChange: function handleChange(props) {
    return function (_ref4) {
      var value = _ref4.value;
      var onChange = props.onChange,
          setValue = props.setValue;

      if (value.document !== props.value.document) {
        // trigger onChange only if document changed.
        onChange(_slatePlainSerializer2.default.serialize(value));
      }
      setValue(value);
    };
  }
}));

// Import the Slate editor.
exports.default = enhance(function (props) {
  var value = props.value,
      handleChange = props.handleChange,
      error = props.error,
      className = props.className;


  var editorWrapperClass = _style2.default.EditorWrapper;
  if (className) {
    editorWrapperClass += ' ' + className;
  }

  return _react2.default.createElement(
    'div',
    { className: editorWrapperClass },
    _react2.default.createElement(_slateReact.Editor, {
      className: _style2.default.Editor,
      placeholder: 'enter some code',
      plugins: _plugins2.default,
      value: value,
      onChange: handleChange
    }),
    error && _react2.default.createElement(
      'pre',
      { className: _style2.default.Error },
      error.toString()
    )
  );
});

/***/ }),

/***/ 684:
/*!****************************************************!*\
  !*** ./docs-src/components/common/Editor/style.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _style = __webpack_require__(/*! ../../../utils/style */ 82);

var LineNumber = {
  content: 'counter(linenumber)',
  color: 'rgba(27,31,35,0.3)',
  display: 'block',
  padding: '0 8px',
  textAlign: 'right'
};

var EditorWrapper = {
  position: 'relative',
  flex: '1 1 auto',
  height: '100%',
  width: '50%'
};

var Editor = {
  padding: '0 8px',
  '-webkit-font-smoothing': 'auto',
  border: '1px solid #cccccc',
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;',
  height: '100%',
  overflow: 'scroll',

  '& > pre': {
    margin: '8px 0',

    '& > code': {
      '& > *': {
        fontSize: 14,
        lineHeight: '20px',
        verticalAlign: 'top'
      }
    }
  },

  '& > pre.line-numbers': {
    position: 'relative',
    paddingLeft: 32,
    counterReset: 'linenumber',

    '& > code': {
      position: 'relative',
      whiteSpace: 'inherit'
    }
  },

  '& .line': {
    position: 'relative'
  },

  '& .line-numbers-rows': {
    position: 'absolute',
    top: 0,
    left: -32,
    width: 32, /* works for line-numbers below 1000 lines */
    letterSpacing: '-1px',
    borderRight: '1px solid transparent',
    userSelect: 'none'
  },

  '& span.line-numbers-rows': {
    display: 'block',
    counterIncrement: 'linenumber'
  },

  '& span.line-numbers-rows:before': LineNumber,
  '& span.line-numbers-rows.has-error:before': _extends({}, LineNumber, {
    color: 'red'
  })
};

var Error = {
  margin: 0,
  padding: 8,
  position: 'absolute',
  whiteSpace: 'pre-wrap',
  left: 0,
  bottom: 0,
  right: 0,
  background: '#EEEEEE',
  color: 'red',
  opacity: 0.8,
  fontWeight: 'bold'
};

exports.default = (0, _style.registerStyles)({
  EditorWrapper: EditorWrapper,
  Editor: Editor,
  Error: Error
});

/***/ }),

/***/ 685:
/*!************************************************************!*\
  !*** ./docs-src/components/common/Editor/plugins/index.js ***!
  \************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slatePrism = __webpack_require__(/*! slate-prism */ 686);

var _slatePrism2 = _interopRequireDefault(_slatePrism);

__webpack_require__(/*! prismjs/components/prism-jsx */ 689);

var _slateEditCode = __webpack_require__(/*! slate-edit-code */ 690);

var _slateEditCode2 = _interopRequireDefault(_slateEditCode);

var _IMEFix = __webpack_require__(/*! ./IMEFix */ 730);

var _IMEFix2 = _interopRequireDefault(_IMEFix);

var _Code = __webpack_require__(/*! ./Code */ 731);

var _Code2 = _interopRequireDefault(_Code);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import jsx syntax
exports.default = [(0, _IMEFix2.default)(), (0, _Code2.default)(), (0, _slatePrism2.default)({
  onlyIn: function onlyIn(node) {
    return node.type === 'code';
  },
  getSyntax: function getSyntax(node) {
    return node.data.get('className').split('-')[1];
  }
}), (0, _slateEditCode2.default)({
  containerType: 'code',
  lineType: 'code_line',
  exitBlockType: null
})];

/***/ }),

/***/ 730:
/*!*************************************************************!*\
  !*** ./docs-src/components/common/Editor/plugins/IMEFix.js ***!
  \*************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

// Workaround for text deleted on IME input.
// Only tested for Japanese IME and Latest Chrome.
// https://github.com/ianstormtaylor/slate/blob/master/src/components/content.js#L603
exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var isIME = false;
  return {
    onKeyDown: function onKeyDown(e, data, change, editor) {
      var code = e.nativeEvent.code.toLowerCase();
      if (data.code === 229 && code === 'enter') {
        isIME = true;
        return change;
      }
    },
    onBeforeInput: function onBeforeInput(e, data, change) {
      if (isIME) {
        var text = e.nativeEvent.data;
        e.preventDefault();
        isIME = false;
        change.insertText(text);
        return true;
      }
    }
  };
};

/***/ }),

/***/ 731:
/*!***********************************************************!*\
  !*** ./docs-src/components/common/Editor/plugins/Code.js ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(/*! react */ 5);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CodeLine = function CodeLine(props) {
  var node = props.node;

  var error = node.data.get('error');

  var rowClass = 'line-numbers-rows';
  if (error) {
    rowClass += ' has-error';
  }

  return _react2.default.createElement(
    'div',
    {
      className: 'line',
      'data-key': node.key
    },
    _react2.default.createElement('span', {
      className: rowClass,
      contentEditable: false,
      title: error
    }),
    props.children
  );
};

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return {
    renderNode: function renderNode(props) {
      var node = props.node,
          attributes = props.attributes,
          children = props.children;

      if (node.type === 'code') {
        return _react2.default.createElement(
          'pre',
          { className: 'line-numbers' },
          _react2.default.createElement(
            'code',
            attributes,
            children
          )
        );
      } else if (node.type === 'code_line') {
        return _react2.default.createElement(
          CodeLine,
          props,
          children
        );
      }
    }
  };
};

/***/ }),

/***/ 732:
/*!*****************************************************************!*\
  !*** ./docs-src/components/common/Editor/createInitialState.js ***!
  \*****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slateHyperscript = __webpack_require__(/*! slate-hyperscript */ 733);

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx h */

var h = (0, _slateHyperscript.createHyperscript)({
  blocks: {
    code: 'code',
    code_line: 'code_line'
  },
  inlines: {},
  marks: {}
});

module.exports = function (children) {
  return h(
    'value',
    null,
    h(
      'document',
      null,
      h(
        'code',
        { className: 'language-jsx', style: { color: 'red' } },
        _lodash2.default.map(children, function (child, i) {
          return h(
            'code_line',
            null,
            child
          );
        })
      )
    )
  );
};

/***/ }),

/***/ 734:
/*!*********************************!*\
  !*** ./docs-src/utils/babel.js ***!
  \*********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.babelAndEval = undefined;

var _standalone = __webpack_require__(/*! @babel/standalone */ 735);

var Babel = _interopRequireWildcard(_standalone);

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

var _lib = __webpack_require__(/*! ../../lib */ 184);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// expose h to window for eval
window.h = _lib.h;

// transpile source code by babel.
var babelAndEval = exports.babelAndEval = function babelAndEval(builderCode) {
  var Const = _lib.simple.Const,
      Let = _lib.simple.Let,
      Var = _lib.simple.Var,
      Value = _lib.simple.Value,
      ArrowFn = _lib.simple.ArrowFn,
      FnStatement = _lib.simple.FnStatement,
      FnCall = _lib.simple.FnCall,
      Fn = _lib.simple.Fn,
      Declarator = _lib.simple.Declarator,
      Import = _lib.simple.Import,
      Export = _lib.simple.Export,
      JSX = _lib.simple.JSX,
      ClassDef = _lib.simple.ClassDef,
      Method = _lib.simple.Method;


  var code = _lodash2.default.get(Babel.transform(builderCode, {
    'presets': ['es2015', 'stage-2', 'react']
  }), 'code', '');

  var builder = eval('\n    (() => {\n      ' + (0, _lib.format)(code) + '\n      return render()\n    })()\n  ');

  return (0, _lib.print)(builder);
};

exports.default = babelAndEval;

/***/ }),

/***/ 82:
/*!*********************************!*\
  !*** ./docs-src/utils/style.js ***!
  \*********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrap = exports.registerRules = exports.registerStyles = undefined;

var _lodash = __webpack_require__(/*! lodash */ 9);

var _lodash2 = _interopRequireDefault(_lodash);

var _reactFreeStyle = __webpack_require__(/*! react-free-style */ 336);

var _static = __webpack_require__(/*! inline-style-prefixer/static */ 339);

var _static2 = _interopRequireDefault(_static);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Style = _reactFreeStyle.FreeStyle.create();

var registerStyles = exports.registerStyles = function registerStyles(styles) {
  return _lodash2.default.reduce(styles, function (result, style, key) {
    // result[key] = Style.registerStyle(prefixAll(style))
    result[key] = Style.registerStyle(style);
    return result;
  }, {});
};

var registerRules = exports.registerRules = function registerRules(styles) {
  return _lodash2.default.each(styles, function (style, key) {
    Style.registerRule(key, (0, _static2.default)(style));
  });
};

var wrap = exports.wrap = function wrap(Component) {
  return (0, _reactFreeStyle.wrap)(Component, Style);
};

exports.default = Style;

/***/ })

},[321]);
//# sourceMappingURL=client.8ac4c47e.js.map