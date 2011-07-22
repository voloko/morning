var v = require('muv/v');
var u = require('muv/u');

var Datalist = module.exports = v.Base.createClass();
var p = Datalist.prototype;

p.defaultClassName = CLS('m-datalist');

p._createDom = function() {
  this.dom = v({ tag: 'div', className: this.defaultClassName, children: [
    this._loadingView(),
    { tag: 'div', as: 'container' },
    this._moreView()
  ]}, this);

  this._initDom();
};

p._initDom = function() {
  u.cls.add(this.more, CLS('hidden'));
  u.cls.add(this.loading, CLS('hidden'));
  this.more.addEventListener('click', u.bind(function() {
    if (!this.isLoading) {
      this.trigger({ type: 'loadMore', items: this._items });
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
      u.cls.toggle(this.loading, CLS('hidden'), !value);
    },
    get: function() {
      return !u.cls.has(this.loading, CLS('hidden'));
    }
  },
  hasMore: {
    set: function(value) {
      u.cls.toggle(this.more, CLS('hidden'), !value);
    },
    get: function() {
      return !u.cls.has(this.more, CLS('hidden'));
    }
  },
  items: {
    set: function(items) {
      this._items = items || [];
      this.container.innerHTML = '';
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

p._compareItems = function(a, b) {
  return a.order > b.order;
};

p.assimilate = function(items) {
  if (this._items.length) {
    var groups = [[]];
    var j = 0;
    var children = [].slice.call(this.container.children, 0);
    for (var i = 0; i < items.length; i++) {
      while (this._items[j] && this._compareItems(this._items[j], items[i])) {
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
          v({ fragment: true, children: this._itemsToViews(group) }),
          children[i]
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
