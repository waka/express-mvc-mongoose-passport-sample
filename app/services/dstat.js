/**
 * @fileoverview Provide business logic for dstat results.
 */


/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Dstat = mongoose.model('Dstat');


/**
 * Public
 */

exports.getLatestAll = function(callback) {
  var today = createBeginningOfToday();
  var group = {
    key: {hostname: true},
    cond: {time: {'$gte': today}},
    initial: {},
    reduce: function(doc, out) {
      for (var key in doc) {
        out[key] = doc[key];
      }
    },
    finalize: function(out) {}
  };

  Dstat.collection.group(group.key, group.cond, group.initial, 
      group.reduce, group.finalize, true, 
      function(err, dstats) {
    if (err) {
      throw err;
    }
    if (!dstats) {
      dstats = [];
    }
    var header = {labels: [], cols: []};

    if (dstats.length > 0) {
      var dstat = dstats[0]['dstat'];

      for (var key in dstat) {
        var item = dstat[key];
        header.labels.push({
          name: key,
          count: Object.keys(item).length
        });
        for (var key2 in item) {
          header.cols.push(key2);
        }
      }
    }

    callback(locals);
  });
};


/**
 * Private
 */

// Const
var dstatConf = {
  'total cpu usage': ['usr', 'sys', 'idl'],
  'load avg': ['1m', '5m', '15m'],
  'memory usage': ['used', 'free'],
  'dsk/total': ['read', 'writ'],
  'net/total': ['recv', 'send']
};


// create date instance at today that filled by zero
var createBeginningOfToday = function() {
  var d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  return d;
};

