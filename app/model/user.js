/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var m = require('muv/m');
var u = require('muv/u');

var User = module.exports = require('./base').createClass();
var p = User.prototype;

var obj = {};
m.defineProperties(p, {
  uid:                   obj,
  // first_name:            obj,
  // middle_name:           obj,
  // last_name:             obj,
  name:                  obj,
  // pic_small:             obj,
  // pic_big:               obj,
  pic_square:            obj,
  pic:                   obj,
  affiliations:          obj,
  profile_update_time:   obj,
  timezone:              obj,
  religion:              obj,
  birthday:              obj,
  birthday_date:         obj,
  sex:                   obj,
  hometown_location:     obj,
  meeting_sex:           obj,
  meeting_for:           obj,
  relationship_status:   obj,
  significant_other_id:  obj,
  political:             obj,
  current_location:      obj,
  activities:            obj,
  interests:             obj,
  is_app_user:           obj,
  music:                 obj,
  tv:                    obj,
  movies:                obj,
  books:                 obj,
  quotes:                obj,
  about_me:              obj,
  hs_info:               obj,
  education_history:     obj,
  work_history:          obj,
  notes_count:           obj,
  wall_count:            obj,
  status:                obj,
  has_added_app:         obj,
  online_presence:       obj,
  locale:                obj,
  proxied_email:         obj,
  profile_url:           obj,
  email_hashes:          obj,
  // pic_small_with_logo:   obj,
  // pic_big_with_logo:     obj,
  // pic_square_with_logo:  obj,
  // pic_with_logo:         obj,
  // allowed_restrictions:  obj,
  verified:              obj,
  // profile_blurb:         obj,
  family:                obj,
  username:              obj,
  website:               obj,
  is_blocked:            obj,
  contact_email:         obj,
  email:                 obj,
  third_party_id:        obj
});

u.alias.prop(p, 'profile_url', 'url');

p.match = function(mention) {
  return this.searchIndex.indexOf(mention) > -1;
};

Object.defineProperties(p, {
  searchIndex: {
    get: function() {
      if (!this._searchIndex) {
        this._searchIndex = (' ' + this.name + ' ' + this.username).toLowerCase();
      }
      return this._searchIndex;
    }
  },
  significant_other: {
    get: function() {
      console.log(this.significant_other_id);
      return require('app/sync/baseSync').cached(this.significant_other_id);
    }
  }
});


u.alias.prop(p, 'uid', 'id');
// remove id as real prop
p.propNames = p.propNames.slice(1);
