requireCss('./timestamp.css');

var timeSince = require('../../lib/timeSince');
var v = require('../../../muv/v');

var Timestamp = module.exports = v.Base.createClass();
var p = Timestamp.prototype;

p.defaultClassName = 'm-timestamp';

Object.defineProperty(p, 'value', {
  configurable: true,
  set: function(value) {
    this._value = value;
    this.dom.innerHTML = timeSince(value);
  },
  get: function() {
    return this._value;
  }});
