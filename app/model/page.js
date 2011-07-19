var m = require('../../muv/m');
var u = require('../../muv/u');

var Page = require('./base').createClass();
var p = Page.prototype;

var obj = {};
m.defineProperties(p, {
  page_id:          obj,
  name:             obj,
  pic_small:        obj,
  pic_big:          obj,
  pic_square:       obj,
  pic:              obj,
  pic_large:        obj,
  page_url:         obj,
  fan_count:        obj,
  type:             obj,
  website:          obj,
  has_added_app:    obj,
  founded:          obj,
  company_overview: obj,
  mission:          obj,
  products:         obj,
  location:         obj,
  parking:          obj,
  public_transit:   obj,
  hours:            obj
});
u.alias.prop(p, 'page_url', 'url');

u.alias.prop(p, 'page_id', 'id');
// remove id as real prop
p.propNames = p.propNames.slice(1);

module.exports = Page;
