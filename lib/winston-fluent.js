var util         = require('util');
var fluentLogger = require('fluent-logger');
var winston      = require('winston');

/**
 * Constructor function for the fluent transport
 * @param {Object} options Options for this instance.
 */
var Fluent = exports.Fluent = function (options) {
  options = options || {};

  if (!options.tag){
    throw "winston-fluent requires 'tag' property";
  }

  if (!options.label){
    throw "winston-fluent requires 'label' property";
  }

  // Merge the options for the target Fluent server.
  this.tag     = options.tag;
  this.label   = options.label;
  this.options = options.options;

  this.fluentSender = fluentLogger.createFluentSender(this.tag, this.options);
};

// Inherit from `winston.Transport`.
util.inherits(Fluent, winston.Transport);


// Define a getter so that `winston.transports.Fluent`
// is available and thus backwards compatible.
winston.transports.Fluent = Fluent;

// Expose the name of this Transport on the prototype
Fluent.prototype.name = 'fluent';

/**
 * Fluent log - Core logging method exposed to Winston
 * @param  {String}   level    Level at which to log the message.
 * @param  {String}   msg      Message to log
 * @param  {Object}   meta     Optionnal - Additional métadata to attach
 * @param  {Function} callback Continuation to respond to when complete.
 */
Fluent.prototype.log = function (level, msg, meta, callback) {
  var self = this;
  var data;

  if (typeof meta !== 'object' && meta != null) {
    meta = { meta: meta };
  }

  data          = clone(meta);
  data.level    = level;
  data.severity = level.toUpperCase();
  data.message  = msg;

  this.fluentSender.emit(this.label, data, function(err) {
    if (err) return self.emit('error', err);
    if (self.fluentSender._sendQueue.length === 0) return self.emit('logged');
  });

  callback(null, true);
};

/**
 * Helper method for deep cloning pure JSON objects
 * i.e. JSON objects that are either literals or objects (no Arrays, etc)
 * @param  {Object} obj Object to clone.
 * @return {Object}
 */
function clone (obj) {
  // we only need to clone refrence types (Object)
  if (!(obj instanceof Object)) {
    return obj;
  } else if (obj instanceof Date) {
    return obj;
  }

  var copy = {};
  for (var i in obj) {
    if (Array.isArray(obj[i])) {
      copy[i] = obj[i].slice(0);
    }
    else if (obj[i] instanceof Buffer) {
      copy[i] = obj[i].slice(0);
    }
    else if (typeof obj[i] != 'function' && obj[i] !== obj) {
      copy[i] = obj[i] instanceof Object ? clone(obj[i]) : obj[i];
    }
  }

  return copy;
};
