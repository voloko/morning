requireCss('./list.css');

var v = require('../../../muv/v');

v.List = v.Base.createClass();
var p = v.List.prototype;

p.defaultClassName = 'muv-list';

function wrap(child) {
  return v({ tag: 'li', className: 'muv-list-item', children: [child] });
}
p.appendChild = function(child) {
  this.dom.appendChild(wrap(child));
  return child;
};

p.removeChild = function(child) {
  this.dom.removeChild(child.parentNode);
  return child;
};

p.insertBefore = function(child, refChild) {
  this.dom.insertBefore(wrap(child), refChild.parentNode);
  return child;
};

p.replaceChild = function(child, refChild) {
  this.dom.replaceChild(wrap(child), refChild.parentNode);
  return child;
};

Object.defineProperty(p, 'childViews', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.children.map(function(child) {
      return v.nearest(child.firstChild);
    });
  } });


module.exports = v.List;
