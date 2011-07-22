requireCss('./header.css');
requireCss('../bg/bg.css');

var v = require('muv/v');
var u = require('muv/u');
var tx = require('app/lib/tx');

var Header = module.exports = v.Base.createClass();
var p = Header.prototype;

p.defaultClassName = CLS('m-comment-header');

p._createDom = function() {
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    { tag: 'div', className: CLS('m-comment-header-line'), children: [
      { tag: 'i', className: CLS('m-comment-header-nub') }
    ] },
    { tag: 'div', className: CLS('m-comment-header-likes'), as: 'count' }
  ] }, this);
};

p.defaultBindingOptions = {
  modelEvents: ['change.likes'],
  modelProp: ''
};

Object.defineProperty(p, 'value', {
  get: function() {
    return this._value;
  },
  
  set: function(value) {
    this._value = value;
    var count = value.likes.count*1;
    u.cls.toggle(this.count, CLS('hidden'), !count);
    if (count) {
      this.count.innerHTML = '';
      var text = count > 1 ? tx('cmt:nlikes', {count: count}) : tx('cmt:1like');
      this.count.appendChild(
        v({ tag: 'a', href: '#', text: text,
          className: CLS('m-comment-header-like-number m-bg-like') })
      );
      this.count.appendChild(v({ text: ' ' + tx('cmt:likethis') }));
    }
  }
});
