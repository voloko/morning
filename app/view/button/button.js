requireCss('./button.css');

var v = require('muv/v');
var u = require('muv/u');

var Composer = module.exports = v.Base.createClass();
var p = Composer.prototype;

p.defaultClassName = CLS('m-button');

p._createDom = function() {
  this.dom = v({ tag: 'a', className: this.defaultClassName, href: '#' });
};

u.delegate.prop(p, 'text', 'dom', 'innerText');

Object.defineProperty(p, 'use', {
  set: function(use) {
    u.cls.add(this, use == 'confirm' ? 'm-button_confirm' : 'm-button_normal')
  }
})
