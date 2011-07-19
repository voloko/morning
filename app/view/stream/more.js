requireCss('./more.css');

var v = require('../../../muv/v');
var u = require('../../../muv/u');
var tx = require('../../lib/tx');

var More = module.exports = v.Base.createClass();
var p = More.prototype;

p.defaultClassName = 'm-navbar-more';

p._createDom = function() {
  this.refs = {};
  this.dom = v({ 
    tag: 'a', href: '#', className: p.defaultClassName, children: [
      { text: tx('str:more'), as: 'text' },
      { text: ' ' },
      { tag: 'i', className: 'm-navbar-more-loader' }
    ]
  }, this.refs);

  this.addEventListener('click', u.bindOnce(function(e) {
    e.preventDefault();
    this.loading = true;
  }, this))
};

Object.defineProperty(p, 'loading', {
  get: function() {
    return u.cls.has(this, 'm-navbar-more_loading');
  },
  set: function(value) {
    var text = this.refs.text;
    text.parentNode.replaceChild(
      v({ text: value ? tx('str:loading') : tx('str:more'), as: 'text' }, this.refs),
      text);
    u.cls.toggle(this, 'm-navbar-more_loading', !!value);
  }
})
