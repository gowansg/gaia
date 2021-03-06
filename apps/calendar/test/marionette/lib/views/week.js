'use strict';

var View = require('./view');

function Week() {
  View.apply(this, arguments);
}
module.exports = Week;

Week.prototype = {
  __proto__: View.prototype,

  selector: '#week-view',

  get sideBarHours() {
    return this.findElements('.md__sidebar .md__hour .md__display-hour');
  },

  get events() {
    return this.findElements('.md__event');
  },

  get todayDates() {
    return this.findElements('.md__sticky .md__allday h1.is-today');
  },

  get dayNames() {
    return this.findElements('.md__day-name').map(function(el) {
      return el.text();
    });
  },

  get days() {
    return this.findElements('.md__day');
  },

  get hours() {
    return this.findElements('.md__hour');
  },

  get currentTime() {
    return this.findElement('.md__current-time');
  },

  get currentHour() {
    var now = new Date();
    return this.findElement('.md__hour-'+ now.getHours());
  },

  get currentDisplayHour() {
    return this.currentHour.findElement('.md__display-hour');
  },

  get main() {
    return this.findElement('.md__main');
  },

  get allDayIcon() {
    return this.findElement('.md__all-day');
  },

  get allDay() {
    return this.findElements('.md__allday')[1];
  },

  get scrollTop() {
    return this.main.scriptWith(function(el) {
      return el.scrollTop;
    });
  },

  waitForHourScrollEnd: function() {
    // if displaying current day it scrolls to current time, if not it scrolls
    // to 8AM
    var hour = this.todayDates.length ? new Date().getHours() - 1 : 8;
    var expected = this.getDestinationScrollTop(hour);
    this._waitForScrollEnd(expected);
  },

  _waitForScrollEnd: function(expected) {
    this.client.waitFor(function() {
      return this.scrollTop === expected;
    }.bind(this));
  },

  getDestinationScrollTop: function(hour) {
    var bottomScrollTop = this.main.scriptWith(function(el) {
      return el.scrollHeight - el.clientHeight;
    });
    var hourOffsetTop = this.hours[hour].scriptWith(function(el) {
      return el.offsetTop;
    });
    return Math.min(hourOffsetTop, bottomScrollTop);
  },

  scrollToTop: function() {
    var height = this.element.scriptWith(function(el) {
      return el.clientHeight;
    });

    this.actions
      .flick(this.element, 10, 10, 10, height - 10)
      .perform();

    this._waitForScrollEnd(0);
  }
};
