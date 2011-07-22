requireCss('./post.css');

var v = require('muv/v');
var u = require('muv/u');
var tx = require('app/lib/tx');

var Post = module.exports = require('app/view/composable').createClass();
var p = Post.prototype;

p.defaultClassName = CLS('m-post m-post_stream');

p.composeFrom = function() {
  u.cls.add(this, CLS('m-post_with-icon'), !this.value.message);
  if (this.value.actor) {
    return v({
      tag: 'img', className: CLS("m-post-from-pic"),
      src: this.value.actor.pic_square
    }, this);
  } else {
    var attachment = this.value.attachment;
    return attachment && attachment.icon && v({
      tag: 'img', className: CLS("m-post-from-icon"),
      src: attachment.icon
    }, this);
  }
};

p.composeContent = function() {
  var attachment = this.value.attachment;
  return v({ tag: 'div', className: CLS("m-post-content"), children: [
    this.composeVoice(),
    { text: ' ' },
    this.composeMessage(),
    attachment.media &&
      { view: require('./attachment'), value: this.value.attachment },

    { tag: 'div', className: CLS('m-post-actions'), children: [
      { view: require('app/view/timestamp/timestamp'),
        value: this.value.datetime, tag: 'span' },
      { text: ' \u00B7 '},
      { view: require('app/view/like/post'), value: this.value }
    ] },
    this.composeCounts(),
    this.composeActions()
  ] }, this.refs);
};

p.composeCounts = function() {
  return { view: require('./counts'), as: 'counts', model: this.value };
};


p.composeActions = function() {
  var id = this.value.id;
  return { tag: 'a', className: CLS('m-post-more'), href: '#', as: 'more',
    'data-click-action': function() {
      require('app/app').goTo({ name: 'post', options: { id: id } }, true);
    } };
};

p.composeVoice = function() {
  var target = this.value.target;
  var actor = this.value.actor;

  if (target) {
    return v({ fragment: true, children: [
      { tag: 'a', className: CLS('m-post-actor'), text: actor.name,
        href: actor.url },
      { tag: 'span', className: CLS('m-post-arrow'), text: ' \u25B6 '},
      { tag: 'a', className: CLS('m-post-target'), text: target.name,
        href: target.url }
    ] });
  }
  return actor && v({ tag: 'a', className: CLS('m-post-actor'),
    text: actor.name, href: actor.url });
};

p.composeMessage = function() {
  return v({ tag: 'span',
    innerHTML: require('app/lib/urlize')(this.value.message) });
};

p.compose = function() {
  this.refs = {};
  return v({ fragment: true, children: [
    this.composeFrom(),
    this.composeContent()
  ] });
};

