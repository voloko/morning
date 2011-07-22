requireCss('./loading.css');

var v = require('muv/v');
var u = require('muv/u');
var tx = require('app/lib/tx');

var Loading = module.exports = v.Base.createClass();
var p = Loading.prototype;

p.defaultClassName = CLS('m-datalist-loading');

p._createDom = function() {
  this.dom = v({
    tag: 'div', className: p.defaultClassName, children: [
      { tag: 'div', className: CLS('m-datalist-loading-label'), children: [
        { text: tx('dtl:loading'), as: 'text' },
        { text: ' ' },
        { tag: 'i', className: CLS('m-datalist-loading-loader') }
      ] },
      { tag: 'div', className: CLS('m-datalist-loading-updated hidden'), children: [
        { text: tx('dtl:lastupdated') },
        { view: require('app/view/timestamp/timestamp'), as: 'timestamp' }
      ], as: 'updated' }
    ]
  }, this);
};

u.delegate.prop(p, 'time', 'timestamp', 'value');

Object.defineProperties(p, {
  time: {
    get: function() {
      return this.timestamp.value;
    },
    set: function(value) {
      this.timestamp.value = value;
      u.cls.toggle(this.updated, CLS('hidden'), !value);
    }
  }
});
