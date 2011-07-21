var v = require('muv/v');
var u = require('muv/u');

var Home = module.exports = u.createClass(require('./base'));
var p = Home.prototype;

p.show = function(container, options) {
  this.refs = {};
  this.container = container;
  this.container.appendChild(
    v({ view: require('app/view/stream/stream'), as: 'stream', isLoading: true }, this.refs).dom
  );

  var postSync = require('app/sync/postSync');
  var posts = postSync.getHomeFromCache();
  var stream = this.refs.stream;
  if (posts) {
    stream.assimilate(posts.slice(0, 10));
    setTimeout(function() {
      stream.assimilate(posts.slice(10));
    }, 100);
  }

  stream.addEventListener('loadMore', function(e) {
    var posts = e.data.items;
    postSync.fetchHome({ limit: 10, after: posts[posts.length - 1].created_time }, function(posts) {
      stream.assimilate(posts);
      stream.hasMore = true;
      stream.isLoading = false;
    });
  });

  postSync.fetchHome({ limit: 25 }, function(posts) {
    stream.assimilate(posts);
    stream.hasMore = true;
    stream.isLoading = false;
  });
};

p.title = 'Facebook';
p.isHome = true;
