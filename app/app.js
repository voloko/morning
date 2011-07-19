requireCss('./app.css');

var app = global.app = {};
var refs = {};

app.init = function() {
  var v = require('../muv/v');

  document.head.appendChild(
    v({ tag: 'style', text: __requiredCss })
  );

  document.body.appendChild(
    v({ fragment: true, children: [
      { view: require('./view/navbar/navbar'), as: 'navbar', title: 'Facebook' },
      { view: require('./view/stream/stream'), as: 'stream' }
    ]}, refs)
  );
};


app.run = function() {
  require('sync/postSync').fetchHome({ limit: 25 }, function(posts) {
    refs.stream.appendPosts(posts);
    setTimeout(function(){
      window.scrollTo(0, 1);
    }, 1);
  });
};