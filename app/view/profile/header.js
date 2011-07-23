/**
* Copyright 2004-present Facebook. All Rights Reserved.
*/
requireCss('./header.css');
requireCss('../image-block/image-block.css');
requireCss('../bg/bg.css');

var v = require('muv/v');
var u = require('muv/u');
var tx = require('app/lib/tx');

var Header = module.exports = require('app/view/composable').createClass();
var p = Header.prototype;

p.defaultClassName = CLS('m-profile-header m-image-block');

p.compose = function() {
  u.cls.toggle(this, CLS('m-profile-header_min'), this.value.fieldSet == 'min');
  return this.value.fieldSet == 'min' ?
    this.composeMin() :
    this.composeAll();
};


p.composeMin = function() {
  return v({ fragment: true, children: [
    { tag: 'img',
      className: CLS("m-profile-header-pic m-image-block-left"),
      src: this.value.pic_square
    },
    { tag: 'div', className: CLS('m-image-block-content m-profile-header-c'),
      children: [
        { tag: 'h1', className: CLS('m-image-block-name'),
          text: this.value.name },

        { tag: 'div', className: CLS('m-image-block-loading m-bg-loading') }
      ] },
    { tag: 'div', className: CLS('clear') }
  ] }, this);
};

p.composeAll = function() {
  return v({ fragment: true, children: [
    { tag: 'img', className: CLS("m-profile-header-pic m-image-block-left"),
      src: this.value.pic
    },
    { tag: 'div', className: CLS('m-image-block-content m-profile-header-c'),
      children: [
        { tag: 'h1', className: CLS('m-image-block-name'),
          text: this.value.name },
        composeWork.call(this),
        composeEducation.call(this),
        composeRel.call(this),
        composeLocation.call(this),
        composeHometown.call(this)
      ] },
    { tag: 'div', className: CLS('clear') }
  ] }, this);
};

function composeWork() {
  var work = this.value.work_history;
  return work && work[0] &&
    { tag: 'div',
      className: CLS('m-image-block-with-icon m-image-block-with-icon_work'),
      text: tx(work[0].end_date ? 'profile:workpast' : 'profile:work', {
        company: work[0].company_name,
        position: work[0].position
      } ) };
}

function composeEducation() {
  var edu = this.value.education_history;
  return edu && edu[0] &&
    { tag: 'div',
      className: CLS('m-image-block-with-icon m-image-block-with-icon_school'),
      text: tx(edu[0].year ? 'profile:edupast' : 'profile:edu', {
        school: edu[0].name,
        concentration: edu[0].concentrations && edu[0].concentrations[0]
      } ) };
}

function composeHometown() {
  var loc = this.value.hometown_location;
  return loc &&
    { tag: 'div',
      className: CLS('m-image-block-with-icon m-image-block-with-icon_origin'),
      text: tx('profile:hometown', {
        name: loc.name,
      } ) };
}

function composeLocation() {
  var loc = this.value.current_location;
  return loc &&
    { tag: 'div',
      className: CLS('m-image-block-with-icon m-image-block-with-icon_place'),
      text: tx('profile:location', {
        name: loc.name,
      } ) };
}

function composeRel() {
  var other = this.value.significant_other;
  return other &&
    { tag: 'div',
      className: CLS('m-image-block-with-icon m-image-block-with-icon_relationship'),
      children: [
        { text: tx(
          'profile:relationship',
          { status: this.value.relationship_status }) },
        { text: ' '},
        other && { tag: 'a', href: '#', text: other.name,
          'data-click-action': function() {
            require('app/app').goTo({ name: 'profile', options: { id: other.id } }, true)
          } }
      ] };
}

p.composeBrief = function(name, start) {};