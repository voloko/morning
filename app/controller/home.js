var v = require('muv/v');
var u = require('muv/u');

var Home = module.exports = u.createClass(require('./base'));
var p = Home.prototype;

p.show = function(container, options) {
  this.container = container;
  this.container.appendChild(
    v({ view: require('app/view/stream/stream'), as: 'stream' }, this).dom
  );

  var postSync = require('app/sync/postSync');
  var posts = postSync.getHomeFromCache();
  var stream = this.stream;
  if (posts) {
    stream.assimilate(posts.slice(0, 10));
    setTimeout(function() {
      stream.assimilate(posts.slice(10));
    }, 100);
  }

  stream.addEventListener('loadMore', function(e) {
    var posts = e.data.items;
    postSync.fetchHome({ limit: 10, after: posts[posts.length - 1].created_time },
      function(posts) {
      stream.assimilate(posts);
      stream.hasMore = posts.length == 10;
      stream.isLoading = false;
    });
  });
  
  this.refresh();
};

var REFRESH_EVERY = 1000*60*5;

p.update = function() {
  var postSync = require('app/sync/postSync');
  if (new Date - postSync.getHomeFromCacheTime() > REFRESH_EVERY) {
    this.refresh();
  }
};

p.refresh = function() {
  var postSync = require('app/sync/postSync');
  var stream = this.stream;
  stream.loading.time = postSync.getHomeFromCacheTime();
  stream.isLoading = true;
  postSync.fetchHome({ limit: 25 }, function(posts) {
    stream.assimilate(posts);
    stream.hasMore = posts.length == 25;
    stream.isLoading = false;
  });
};

p.title = 'Facebook';
p.isHome = true;
