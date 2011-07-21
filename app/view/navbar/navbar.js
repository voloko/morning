requireCss('./navbar.css');

var v = require('muv/v');
var u = require('muv/u');

var NavBar = module.exports = v.Base.createClass();
var p = NavBar.prototype;

p.defaultClassName = CLS('m-navbar');

p._createDom = function() {
  this.refs = {};
  this.dom = v({ tag: 'div', className: p.defaultClassName, children: [
    { tag: 'a', href: '#', className: CLS('m-navbar-back'), as: 'back' },
    { tag: 'div', className: CLS('m-navbar-title'), as: 'title' },
    { tag: 'div', className: CLS('m-navbar-menu'), as: 'menu' }
  ] }, this.refs);
  this.refs.back.addEventListener('click', u.bindOnce(function(e) {
    e.preventDefault();
    require('app/app').goBack();
  }, this));
};

Object.defineProperty(p, 'title', {
  set: function(value) {
    this.refs.title.innerHTML = '';
    this.refs.title.appendChild(value ?
      v({ text: value }) :
      v({ tag: 'i', className: CLS('m-navbar-facebook') }));
  },
  get: function() {
    return this.refs.title.innerHTML;
  }
});

Object.defineProperty(p, 'isHome', {
  set: function(value) {
    u.cls.toggle(this, CLS('m-navbar_home'), !!value);
  }
});
