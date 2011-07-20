var v = require('muv/v');

var Composable = v.Base.createClass();
var p = Composable.prototype;

p.defaultBindingOptions = { modelProp: '', viewProp: 'value' };

p.compose = function() {
  return v({});
};

Object.defineProperty(p, 'value', {
  set: function(value) {
    this._value = value;
    this.dom.innerHTML = '';
    this.dom.appendChild(this.compose());
  },
  get: function() {
    return this._value;
  }
});


module.exports = Composable;
