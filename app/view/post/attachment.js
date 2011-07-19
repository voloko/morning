requireCss('./post.css');
requireCss('./attachment.css');
requireCss('./../image-block/image-block.css');

var v = require('../../../muv/v');
var u = require('../../../muv/u');

var PostAttachment = v.PostAttachment = v.Base.createClass();
var p = PostAttachment.prototype;

p.defaultClassName = 'm-post-attch m-image-block';

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

p.compose = function() {
  var value = this.value;
  var media = this.value.media;
  u.cls.toggle(this, 'u-post-attch_multi-media', media && media.length > 1);
  
  return v({ fragment: true, children: [
    this.composeMedia(media),
    
    { tag: 'div', className: "m-post-attch-content m-image-block-content", children: [
      { tag: 'a', className: 'm-post-attch-name', href: value.href, text: value.name, target: '_blank' },
      value.descitpion && { tag: 'div', className: 'm-post-attch-desc', text: value.descitpion },
      value.caption && { tag: 'div', className: 'm-post-attch-caption', text: value.caption }
    ]},
    
    { tag: 'div', className: 'clear' }
  ] });
};

p.composeMedia = function(media) {
  if (media && media.length && media[0].src) {
    u.cls.remove(this, 'u-post-attch_without-media');
    var children = media.map(function(media) {
      return v({ tag: 'a', href: media.href, className: "m-post-attch-media m-image-block-left", 
        target: '_blank', children: [
        { tag: 'img', className: 'm-post-attch-icon-img', src: media.src }
      ] });
    });
    return v({ fragment: true, children: children });
  } else {
    u.cls.add(this, 'u-post-attch_without-media');
    return null;
  }
};



module.exports = PostAttachment;
