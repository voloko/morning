var m = require('../../muv/m');
var api = require('../lib/api');

var Profile = m.Base.createClass();
var p = Profile.prototype;

m.defineProperties(p, {
  name:        {},
  url:         {},
  pic:         {},
  pic_square:  {},      
  pic_small:   {},     
  pic_big:     {},   
  type:        {},
  username:    {}
});

Profile.buildSELECT = function(options) {
  var fields = options.fields || p.propNames.slice(1);
  return 'SELECT ' + fields.join(', ') + ' FROM profile';
};


module.exports = Profile;
