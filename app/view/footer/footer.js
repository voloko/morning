/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
requireCss('./footer.css');

var v = require('muv/v');

var Footer = module.exports = v.Base.createClass();
var p = Footer.prototype;

p.defaultClassName = CLS('m-footer');

p._createDom = function() {
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    { text: 'MSite prototype ' },
    { tag: 'a', href: 'http://github.com/voloko/morning', text: 'source' }
  ] });
};
