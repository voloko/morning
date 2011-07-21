var v = require('muv/v');
var u = require('muv/u');

var Datalist = module.exports = v.Base.createClass();
var p = Datalist.prototype;

p.defaultClassName = CLS('m-datalist');

p._createDom = function() {
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    this._loadingView(),
    { tag: 'container', as: 'container' },
    this._moreView()
  ]}, this);
  
  u.cls.add(this.more, 'hidden');
  u.cls.add(this.loading, 'hidden');
  this.more.addEventListener('click', u.bind(function() {
    if (!this.isLoading) {
      this.trigger({ type: 'loadMore', posts: this._items });
    }
  }, this));
};

p._loadingView = function() {
  return { view: require('./loading'), as: 'loading' };
};

p._moreView = function() {
  return { view: require('./more'), as: 'more' };
};

p._setup = function() {
  this._items = [];
};

Object.defineProperties(p, {
  isLoading: {
    set: function(value) {
      this.more.isLoading = value;
      u.cls.toggle(this.loading, 'hidden', !value);
    },
    get: function() {
      return !u.cls.has(this.loading, 'hidden');
    }
  },
  hasMore: {
    set: function(value) {
      u.cls.toggle(this.more, 'hidden', !value);
    },
    get: function() {
      return !u.cls.has(this.more, 'hidden');
    }
  },
  items: {
    set: function(items) {
      this._items = items || [];
      this.container.appendChild(
        v({ fragment: true, children: this._itemsToViews(items) })
      );
    },
    get: function() {
      return this._items;
    }
  }
});

p.itemsToViews = function(items) {
  return items.map(function(item) {
    return { tag: 'div', text: item };
  });
};

p._updateExistingView = function(view, item) {};

p.assimilate = function(items) {
  if (this._items.length) {
    var groups = [[]];
    var j = 0;
    var children = [].slice.call(this.container.children, 0);
    for (var i = 0; i < items.length; i++) {
      while (this._items[j] && this._items[j].order > items[i].order) {
        groups[++j] = [];
      }
      if (!this._items[j] && !groups[j]) {
        groups[j] = [];
      }
      if (this._items[j] && items[i].id == this._items[j].id) {
        this._updateExistingView(children[j], this._items[j]);
      } else {
        groups[j].push(items[i]);
      }
    }
    for (i = 0; i < groups.length; i++) {
      var group = groups[i];
      if (group.length) {
        this.container.insertBefore(
          v({ fragment: true, children: this._itemsToViews(group) }), children[i]
        );
      }
    }
    this._items = [];
    children = this.container.children;
    for (i = 0; i < children.length; i++) {
      var view = v.nearest(children[i]);
      view.value && this._items.push(view.value);
    };
  } else {
    this.items = items;
  }
};
