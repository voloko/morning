requireCss('./action.css');

var v = require('muv/v');
var u = require('muv/u');

var Action = module.exports = v.Base.createClass();
var p = Action.prototype;

p.defaultClassName = CLS('m-comment-list-action');

p._createDom = function() {
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    { view: require('app/view/composer/composer'), as: 'composer' }
  ]}, this);
};

u.delegate.call(p, 'stopComposing', 'composer');


