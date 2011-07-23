/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
var re = /(.*?)\b((http:\/\/|www\.|http:\/\/www\.)[^ ]{2,300})\b/g;
function urlize(string, textProcessor, linkProcessor) {
  return string.replace(re, function(match) {
    return textProcessor(RegExp.$1) + linkProcessor(RegExp.$2);
  });
}

module.exports = function(string) {
  var u = require('muv/u');
  return urlize(string, u.escapeHTML, function(link) {
    link = u.escapeHTML(link);
    return '<a href="' + link + '" target="_blank">' + link + '</a>';
  });
}
