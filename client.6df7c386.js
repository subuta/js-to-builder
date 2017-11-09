webpackJsonp([1],{104:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.snippets=t.print=t.format=t.toBuilder=void 0;var o=r(47),a=n(o),u=r(48),i=n(u),s=r(146),l=n(s),c=r(190),d=n(c);t.toBuilder=a.default,t.format=i.default,t.print=l.default,t.snippets=d.default,t.default={toBuilder:a.default,format:i.default,print:l.default,snippets:d.default}},134:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(53),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(n);t.default=function(){var e=o.Parser.prototype,t=o.tokTypes,r=[];return e.parseImport=function(e){return this.next(),this.type===t.string?(e.specifiers=r,e.sourcep=this.parseExprAtom()):(e.specifiers=this.parseImportSpecifiers(),this.expectContextual("from"),e.sourcep=this.type===t.string?this.parseExprAtom():this.unexpected()),this.semicolon(),this.finishNode(e,"ImportDeclaration")},o}()},145:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(17),o=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return function(t){var r=e.shouldOmitProgram,n=void 0===r||r,a=t.type;if("Program"===a){if(n)return;var u=o.default.map(t.body,function(e){return e.source()}).join("\n");return t.update("\n      <Program>"+u+"</Program>\n    ")}if("CallExpression"===a){var i=o.default.map(t.arguments,function(e){return e.source()}).join("\n");return t.update("\n      <CallExpression>"+t.callee.source()+(o.default.isEmpty(t.arguments)?[]:i)+"</CallExpression>\n    ")}if("MemberExpression"===a)return t.update("\n      <MemberExpression>"+t.object.source()+t.property.source()+"</MemberExpression>\n    ");if("ArrowFunctionExpression"===a){var s=o.default.map(t.params,function(e){return e.source()}).join("\n");return t.update("\n      <ArrowFunctionExpression>"+s+t.body.source()+"</ArrowFunctionExpression>\n    ")}if("ObjectExpression"===a){var l=o.default.map(t.properties,function(e){return e.source()}).join("\n");return t.update("\n      <ObjectExpression>"+l+"</ObjectExpression>\n    ")}if("ArrayExpression"===a){var c=o.default.map(t.elements,function(e){return e.source()}).join("\n");return t.update("\n      <ArrayExpression>"+(o.default.isEmpty(t.elements)?[]:c)+"</ArrayExpression>\n    ")}if("BinaryExpression"===a)return t.update('\n      <BinaryExpression operator="'+t.operator+'">\n        '+t.left.source()+t.right.source()+"\n      </BinaryExpression>\n    ");if("AssignmentExpression"===a)return t.update('\n      <AssignmentExpression operator="'+t.operator+'">\n        '+t.left.source()+t.right.source()+"\n      </AssignmentExpression>\n    ");if("UpdateExpression"===a)return t.update('\n      <UpdateExpression operator="'+t.operator+'" prefix={'+t.prefix+"}>\n        "+t.argument.source()+"\n      </UpdateExpression>\n    ");if("FunctionExpression"===a)return t.update("\n      <FunctionExpression id={"+t.id+"}>\n        "+t.params+t.body.source()+"\n      </FunctionExpression>\n    ");if("ExpressionStatement"===a)return t.update("<ExpressionStatement>"+t.expression.source()+"</ExpressionStatement>");if("BlockStatement"===a){var d=o.default.map(t.body,function(e){return e.source()}).join("\n");return t.update("\n      <BlockStatement>"+d+"</BlockStatement>\n    ")}if("ReturnStatement"===a)return t.update("\n      <ReturnStatement>"+t.argument.source()+"</ReturnStatement>\n    ");if("DebuggerStatement"===a)return t.update("\n      <DebuggerStatement />\n    ");if("IfStatement"===a)return t.update("\n      <IfStatement>\n        "+t.test.source()+t.consequent.source()+(t.alternate?t.alternate.source():"")+"\n      </IfStatement>\n    ");if("BreakStatement"===a)return t.update("\n      <BreakStatement>\n        "+(t.label?t.label.source():"")+"\n      </BreakStatement>\n    ");if("ContinueStatement"===a)return t.update("\n      <ContinueStatement>\n        "+(t.label?t.label.source():"")+"\n      </ContinueStatement>\n    ");if("ForStatement"===a)return t.update("\n      <ForStatement>\n        "+t.init.source()+t.test.source()+t.update.source()+t.body.source()+"\n      </ForStatement>\n    ");if("ForInStatement"===a)return t.update("\n      <ForInStatement>\n        "+t.left.source()+t.right.source()+t.body.source()+"\n      </ForInStatement>\n    ");if("ForOfStatement"===a)return t.update("\n      <ForOfStatement>\n        "+t.left.source()+t.right.source()+t.body.source()+"\n      </ForOfStatement>\n    ");if("DoWhileStatement"===a)return t.update("\n      <DoWhileStatement>\n        "+t.body.source()+t.test.source()+"\n      </DoWhileStatement>\n    ");if("WhileStatement"===a)return t.update("\n      <WhileStatement>\n        "+t.test.source()+t.body.source()+"\n      </WhileStatement>\n    ");if("LabeledStatement"===a)return t.update("\n      <LabeledStatement>\n        "+t.label.source()+t.body.source()+"\n      </LabeledStatement>\n    ");if("Literal"===a){var p=o.default.isString(t.value)?t.value:"{"+t.value+"}";return t.update("<Literal>"+p+"</Literal>")}if("Identifier"===a)return t.update("<Identifier>"+t.name+"</Identifier>");if("Property"===a){var f=t.key.source();return"Identifier"===t.key.type&&(f="<Identifier>"+t.key.name+"</Identifier>"),t.update('\n      <Property kind="'+t.kind+'" method={'+t.method+"} shorthand={"+t.shorthand+"} computed={"+t.computed+"}>\n        "+f+t.value.source()+"\n      </Property>\n    ")}if("AssignmentPattern"===a)return t.update("\n      <AssignmentPattern>"+t.left.source()+t.right.source()+"</AssignmentPattern>\n    ");if("ObjectPattern"===a){var m=o.default.map(t.properties,function(e){return e.source()}).join("\n");return t.update("\n      <ObjectPattern>"+m+"</ObjectPattern>\n    ")}if("ImportDeclaration"===a){var y=o.default.map(t.specifiers,function(e){return e.source()}).join("\n");return t.update("\n      <ImportDeclaration>"+y+t.sourcep.source()+"</ImportDeclaration>\n    ")}if("ImportDefaultSpecifier"===a)return t.update("\n      <ImportDefaultSpecifier>"+t.local.source()+"</ImportDefaultSpecifier>\n    ");if("ImportNamespaceSpecifier"===a)return t.update("\n      <ImportNamespaceSpecifier>"+t.local.source()+"</ImportNamespaceSpecifier>\n    ");if("ImportSpecifier"===a)return t.update("\n      <ImportSpecifier>"+t.imported.source()+t.local.source()+"</ImportSpecifier>\n    ");if("ExportDefaultDeclaration"===a)return t.update("\n      <ExportDefaultDeclaration>"+t.declaration.source()+"</ExportDefaultDeclaration>\n    ");if("ExportNamedDeclaration"===a)return t.update("\n      <ExportNamedDeclaration>"+t.declaration.source()+"</ExportNamedDeclaration>\n    ");if("VariableDeclarator"===a)return t.update("\n      <VariableDeclarator>"+t.id.source()+(t.init?t.init.source():"")+"</VariableDeclarator>\n    ");if("VariableDeclaration"===a){var v=o.default.map(t.declarations,function(e){return e.source()}).join("\n");return t.update('\n      <VariableDeclaration kind="'+t.kind+'">'+v+"</VariableDeclaration>\n    ")}throw new Error(t.type+" not found")}}},146:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(147),o=r(33),a=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(o),u=(a.namedTypes,a.builders),i=(a.visit,a.getFieldNames,a.getFieldValue,function(e){return(0,n.print)(u.program(e)).code});t.default=i},189:function(e,t){},190:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(191),o=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={redux:o.default}},191:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.genActionCreator=t.genActionType=void 0;var o=r(47),a=n(o),u=r(17),i=n(u),s=t.genActionType=function(e){var t=i.default.snakeCase(e).toUpperCase(),r="\n    const "+t+" = '"+t+"'\n  ";return(0,a.default)(r).builder},l=t.genActionCreator=function(e){var t=i.default.camelCase(e),r=i.default.snakeCase(e).toUpperCase(),n="\n    const "+t+" = () => {\n      return {\n        type: "+r+"\n      }\n    }\n  ";return(0,a.default)(n).builder};t.default={genActionType:s,genActionCreator:l}},47:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},a=r(48),u=n(a),i=r(129),s=n(i),l=r(17),c=(n(l),r(134)),d=n(c),p=r(33),f=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(p),m=r(145),y=n(m);f.namedTypes,f.builders;t.default=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.sourceType,n=void 0===r?"module":r,a={sourceType:n},i=(0,s.default)(e,o({parser:d.default},a),(0,y.default)(t)),l="const render = () => (\n    "+i.toString()+"\n  )";return{code:(0,u.default)(l)}}},48:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(105),o=function(e){return e&&e.__esModule?e:{default:e}}(n),a=r(49),u=r(128);t.default=function(e){var t={tabWidth:2,semi:!1,printWidth:80,singleQuote:!0,bracketSpacing:!0,originalText:e},r=(0,o.default)(e),n=(0,a.printAstToDoc)(r,t);return(0,u.printDocToString)(n,t).formatted}},82:function(e,t,r){r(83),e.exports=r(86)},86:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var o=r(23),a=n(o),u=r(88),i=n(u),s=r(17),l=n(s),c=r(97),d=n(c);window._=l.default;var p=function(){return a.default.createElement("div",null,a.default.createElement(d.default,null))},f=function(){var e=document.getElementById("app");i.default.render(a.default.createElement(p,null),e)};"complete"===document.readyState||"loading"!==document.readyState?f():document.addEventListener("DOMContentLoaded",f)},97:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=r(23),a=n(o),u=r(17),i=n(u),s=r(98),l=r(104),c=(0,s.compose)((0,s.withState)("code","setCode",'const hoge = "fuga";'),(0,s.withState)("error","setError",null),(0,s.withPropsOnChange)(["code","setCode"],function(e){var t=e.code,r=e.setCode,n="",o=null;if(!i.default.isEmpty(t)){try{n=(0,l.format)((0,l.toBuilder)(t,{to:"jsx"}).code)}catch(e){o=e.toString()}return{jsx:n,error:o,setCode:i.default.debounce(r,100)}}}));t.default=c(function(e){var t=e.code,r=e.setCode,n=e.jsx,o=e.error;return a.default.createElement("div",{style:{display:"flex",alignItems:"flex-start",height:"100vh",fontFamily:'"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',fontSize:13,color:"#24292e",wordWrap:"normal",whiteSpace:"pre"}},a.default.createElement("textarea",{onInput:function(e){return r(e.target.value)},style:{padding:8,flex:1,height:"90%",fontSize:13},defaultValue:t,cols:"30",rows:"10"}),a.default.createElement("pre",{style:{margin:"0 0 0 16px",padding:8,color:o?"red":"inherit",flex:1,height:"90%"}},o?o.toString():n))})}},[82]);
//# sourceMappingURL=client.6df7c386.js.map