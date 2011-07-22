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
    ] }
  ] }, this);
};

Object.defineProperty(p, 'likes', {
  set: function(value) {
    if (value*1) {
      if (!this.count) {
        this.appendChild(
          v(
            { tag: 'div', className: 'm-comment-header-likes', as: 'count' },
            this)
        )
      }
      this.count.innerHTML = '';
      var text = value > 1 ? tx('cmt:nlikes', {count: value}) : tx('cmt:1like');
      this.count.appendChild(
        v({ tag: 'a', href: '#', text: text,
          className: CLS('m-comment-header-like-number m-bg-like') })
      );
      this.count.appendChild(v({ text: ' ' + tx('cmt:likethis') }));
    } else {
      if (this.count) {
        this.count.parentNode.removeChild(this.count);
        this.count = '';
      }
    }
  }
});
