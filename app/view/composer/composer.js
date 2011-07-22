requireCss('./composer.css');

var v = require('muv/v');
var u = require('muv/u');

var Composer = module.exports = v.Base.createClass();
var p = Composer.prototype;

p.defaultClassName = CLS('m-composer');

p._createDom = function() {
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    { tag: 'div', className: CLS('m-composer-wrap'), children: [
      { tag: 'div', className: 'm-composer-extra', children: [
        { view: require('app/view/button/button'), text: 'Cancel', 
          as: 'cancel' },
        { view: require('app/view/button/button'), text: 'Post', 
          use: 'confirm', as: 'post' }
      ] },
      { tag: 'textarea', type: 'text', placeholder: 'Comment',
        className: CLS('m-composer-text'), as: 'text', rows: 1 },
    ]}
  ] }, this);
  this.text.addEventListener('focus', u.bind(this.startComposing, this));
  this.cancel.addEventListener('click', u.bind(this.stopComposing, this))
};

p.stopComposing = function() {
  u.cls.remove(this, CLS('m-composer_active'));
  this.text.value = '';
};

p.startComposing = function() {
  this.trigger({ type: 'compose', canBubble: true });
  var rect = this.getBoundingClientRect(true);
  u.cls.add(this, CLS('m-composer_active'));
  setTimeout(function() {
    window.scrollTo(0, rect.top + document.body.scrollTop);
  })
};

u.delegate.prop(p, 'value', 'text');