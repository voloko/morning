requireCss('./composer.css');

var v = require('muv/v');
var u = require('muv/u');
var tx = require('app/lib/tx');

var Composer = module.exports = v.Base.createClass();
var p = Composer.prototype;

p.defaultClassName = CLS('m-composer');

p._createDom = function() {
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    { tag: 'div', className: CLS('m-composer-wrap'), children: [
      { tag: 'div', className: 'm-composer-extra', children: [
        { view: require('app/view/button/button'), text: tx('cmps:cancel'),
          as: 'cancel' },
        { view: require('app/view/button/button'), text: tx('cmps:submit'),
          use: 'confirm', as: 'post' }
      ] },
      { tag: 'div', className: CLS('m-composer-text-wrapper'), children: [
        { tag: 'textarea', type: 'text', placeholder: tx('cmps:placheolder'),
          className: CLS('m-composer-text'), as: 'text', rows: 1 }
      ]}
    ]}
  ] }, this);
  this.text.addEventListener('focus', u.bind(this.startComposing, this));
  this.cancel.addEventListener('click', u.bind(this.stopComposing, this));
  this.text.addEventListener('keydown', u.bindOnce(this.checkMentions, this));
  this.text.addEventListener('keyup', u.bindOnce(this.checkMentions, this));
  this.text.addEventListener('keypress', u.bindOnce(this.checkMentions, this));
  this.text.addEventListener('change', u.bindOnce(this.checkMentions, this));
};

p.checkMentions = function() {
  var m = this.findMentionUnderCursor();
  if (m) {
    this.showMention(m.text, m.end);
  } else {
    if (this._suggestion) {
      u.cls.add(this._suggestion, CLS('hidden'));
      this.lastMention = '';
    }
  }
};

p.findMentionUnderCursor = function() {
  var position = this.text.selectionStart;
  var text = this.text.value;
  var index = text.lastIndexOf('@', position);
  if (index > -1) {
    if (index === 0 || text.charAt(index - 1).match(/\s/)) {
      var upToSpace = text.substr(index).split(/\s/, 1)[0];
      if ((upToSpace.length + index) >= position) {
        if (upToSpace.length > 1) {
          return {
            text: upToSpace.substr(1),
            start: index + 1,
            end: upToSpace.length + index
          };
        }
      }
    }
  }
  return false;
};

Object.defineProperties(p, {
  shadow: {
    get: function() {
      if (!this._shadow) {
        this._shadow = v({ tag: 'div', className: CLS('m-composer-shadow') });
        this.text.parentNode.insertBefore(this._shadow, this.text);
      }
      return this._shadow;
    }
  },
  suggestion: {
    get: function() {
      if (!this._suggestion) {
        this._suggestion = v({
          tag: 'div',
          className: CLS('m-composer-suggestion m-composer-suggestion_loading'),
          text: tx('common:loading')
        });
        this.text.parentNode.insertBefore(this._suggestion, this.text);
        this._suggestion.addEventListener('click', u.bind(function(e) {
          if (e.target['data-name']) {
            var m = this.findMentionUnderCursor();
            var t = this.text.value;
            var name = e.target['data-name'];

            this.text.value =
              t.substr(0, m.start) + '"' + name + '"' + t.substr(m.end);
            u.cls.add(this.suggestion, CLS('hidden'));
            this.text.selectionStart = m.start + name.length + 2;
          }
        }, this));
      }
      return this._suggestion;
    }
  }
});

p.extraSuggestions = [];

p.getCursorPosition = function(position) {
  var text = this.text.value;
  this.shadow.textContent = text.substr(0, position);
  return this.shadow.offsetHeight;
};

p.showMention = function(mention, position) {
  if (mention === this.lastMention) {
    return;
  }
  this.lastMention = mention;

  var top = this.getCursorPosition(position);
  u.cls.remove(this.suggestion, CLS('hidden'));
  this.suggestion.style.top = top + 'px';
  this.findMatches(mention, u.bind(function(m, result) {
    u.cls.remove(this.suggestion, CLS('m-composer-suggestion_loading'));
    if (mention == m) {
      this.suggestion.innerHTML = '';
      u.cls.toggle(this.suggestion, CLS('hidden'), !result.length);
      var children = result.map(function(u) {
        return { tag: 'div', className: CLS('m-composer-suggestion-item'),
          'data-name': u.name, text: u.name };
      });
      this.suggestion.appendChild(v({ fragment: 1, children: children }));
    }
  }, this));
};

var SUGGESTION_NUMBER = 6;
function findIn(matches, query, users) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].match(query)) {
      matches.push(users[i]);
      if (matches.length >= SUGGESTION_NUMBER) { break; }
    }
  }
}

p.findMatches = function(mention, callback) {
  var query = ' ' + mention.toLowerCase();
  var matches = [];
  findIn(matches, query, this.extraSuggestions);
  if (matches.length) { callback(mention, matches); }
  require('app/sync/userSync').getFriendsFromSomewhere(function(users) {
    findIn(matches, query, users);
    callback(mention, matches);
  });
};

p.stopComposing = function(e) {
  if (e) e.preventDefault();
  u.cls.remove(this, CLS('m-composer_active'));
  this.text.value = '';
};

p.startComposing = function() {
  this.trigger({ type: 'compose', canBubble: true });
  var rect = this.getBoundingClientRect(true);
  u.cls.add(this, CLS('m-composer_active'));
  setTimeout(function() {
    window.scrollTo(0, rect.top + document.body.scrollTop);
  });
};

u.delegate.prop(p, 'value', 'text');