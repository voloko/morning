requireCss('./more.css');
requireCss('../bg/bg.css');

var v = require('muv/v');
var u = require('muv/u');

var More = module.exports = v.Base.createClass();
var p = More.prototype;

p.defaultClassName = CLS('m-datalist-more');

p._createDom = function() {
  this.refs = {};
  this.dom = v({
    tag: 'a', href: '#', className: this.defaultClassName, children: [
      { text: this._moreText(), as: 'text' },
      { text: ' ' },
      { tag: 'i', className: CLS('m-datalist-more-loader m-bg-loading') }
    ]
  }, this.refs);

  this.addEventListener('click', u.bindOnce(function(e) {
    e.preventDefault();
    this.isLoading = true;
  }, this))
};

p._moreText = function() {
  return 'more';
};

p._loadingText = function() {
  return 'loading';
};

Object.defineProperty(p, 'isLoading', {
  get: function() {
    return u.cls.has(this, CLS('m-datalist-more_loading'));
  },
  set: function(value) {
    var text = this.refs.text;
    text.parentNode.replaceChild(
      v(
        { text: value ? this._loadingText() : this._moreText(), as: 'text' },
        this.refs
      ),
      text);
    u.cls.toggle(this, CLS('m-datalist-more_loading'), !!value);
  }
})
