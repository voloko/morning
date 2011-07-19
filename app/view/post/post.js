requireCss('./post.css');

var v = require('../../../muv/v');
var u = require('../../../muv/u');

v.Post = require('../composable').createClass();
var p = v.Post.prototype;

p.defaultClassName = 'm-post';

p.composeFrom = function() {
  u.cls.add(this, 'm-post_with-icon', !this.value.message);
  if (this.value.actor) {
    return v({
      tag: 'img', className: "m-post-from-pic", 
      src: this.value.actor.pic_square
    }, this);
  } else {
    var attachment = this.value.attachment;
    return attachment && attachment.icon && v({
      tag: 'img', className: "m-post-from-icon", 
      src: attachment.icon 
    }, this);
  }
};

p.composeContent = function() {
  var attachment = this.value.attachment;
  return v({ tag: 'div', className: "m-post-content", children: [
    this.composeVoice(),
    { text: ' ' },
    this.composeMessage(),
    attachment.media && { view: require('./attachment'), value: this.value.attachment },
    { tag: 'div', className: 'm-post-actions', children: [
      { view: require('../timestamp/timestamp'), value: this.value.time }
    ] },
    this.value.hasCommentsOrLikes && { view: require('./counts'), value: this.value },
    { tag: 'a', className: 'm-post-more', href: '#' }
  ] });
};

p.composeVoice = function() {
  var target = this.value.target;
  var actor = this.value.actor;
  
  if (target) {
    return v({ fragment: true, children: [
      { tag: 'a', className: 'm-post-actor', text: actor.name, href: actor.url },
      { tag: 'span', className: 'm-post-arrow', text: ' \u25B6 '},
      { tag: 'a', className: 'm-post-target', text: target.name, href: target.url }
    ] });
  }
  return actor && v({ tag: 'a', className: 'm-post-actor', text: actor.name, href: actor.url });
};

p.composeMessage = function() {
  return v({ tag: 'span', innerHTML: require('../../lib/urlize')(this.value.message) });
};

p.compose = function() {
  return v({ fragment: true, children: [
    this.composeFrom(),
    this.composeContent()
  ] });
};


function profilePic(id) {
  return '//graph.facebook.com/' + id + '/picture';
}

module.exports = v.Post;