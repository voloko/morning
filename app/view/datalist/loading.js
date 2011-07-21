requireCss('./loading.css');

var v = require('muv/v');
var u = require('muv/u');
var tx = require('app/lib/tx');

var Loading = module.exports = v.Base.createClass();
var p = Loading.prototype;

p.defaultClassName = CLS('m-datalist-loading');

p._createDom = function() {
  this.refs = {};
  this.dom = v({
    tag: 'div', className: p.defaultClassName, children: [
      { text: tx('str:loading'), as: 'text' },
      { text: ' ' },
      { tag: 'i', className: CLS('m-datalist-loading-loader') }
    ]
  }, this.refs);
};

Object.defineProperty(p, 'text', {
  get: function() {
    return this.refs.text.toString();
  },
  set: function(value) {
    var text = this.refs.text;
    text.parentNode.replaceChild(
      v({ text: value, as: 'text' }, this.refs),
      text);
  }
})
