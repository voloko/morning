requireCss('./app.css');

var app = global.app = {};

app.init = function() {
  var v = require('../muv/v');
  
  document.head.appendChild(
    v({ tag: 'style', text: __requiredCss })
  );
};


app.run = function() {
  var v = require('../muv/v');
  var List = require('../common/view/list/list');
  var Post = require('../app/view/post/post');
  
  require('sync/postSync').fetchHome({ limit: 25 }, function(posts) {
    document.body.appendChild(
      v({ view: List, style: 'margin: 5px 0', children: posts.map(function(post) {
        return { view: Post, value: post };
      }) }).dom
    );
  });
};