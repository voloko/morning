requireCss('./navbar.css');

var v = require('../../../muv/v');
var u = require('../../../muv/u');

var NavBar = module.exports = v.Base.createClass();
var p = NavBar.prototype;

p.defaultClassName = 'm-navbar';

p._createDom = function() {
  this.refs = {};
  this.dom = v({ tag: 'div', className: p.defaultClassName, children: [
    { tag: 'a', href: '#', className: 'm-navbar-back', as: 'back' },
    { tag: 'div', className: 'm-navbar-title', as: 'title' },
    { tag: 'div', className: 'm-navbar-menu', as: 'menu' }
  ] }, this.refs);
};

Object.defineProperty(p, 'title', {
  set: function(value) {
    this.refs.title.innerHTML = '';
    this.refs.title.appendChild(v({ text: value }));
  },
  get: function() {
    return this.refs.title.innerHTML;
  }
});
