/**
 * @fileoverview The middleware of logger using winston.
 */


/**
 * Required modules.
 */

var winston = require('winston')
  , loggerTransports = require('../logger').loggerTransports;


/**
 * Private
 */

// create logger
var logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console(loggerTransports.console),
    new winston.transports.File(loggerTransports.access)
  ],
  exitOnError: false,
  exceptionHandlers: [
    new winston.transports.File(loggerTransports.exception)
  ]
});


/**
 * Public
 */

/*
 * Compatible with connect.logger
 *
 * @param {String|Function|Object} format or options
 * @return {Function}
 * @api public
 * @See connect/lib/middleware/logger.js
 */
module.exports = function(options) {
  if ('object' == typeof options) {
    options = options || {};
  } else if (options) {
    options = { format: options };
  } else {
    options = {};
  }

  // format name
  var fmt = exports[options.format] || options.format || exports.default;
  // compile format
  if ('function' != typeof fmt) {
    fmt = compile(fmt);
  }

  /**
   * @return {Function} .
   */
  return function winstonLogger(req, res, next) {
    req._startTime = new Date;

    // proxy end to output logging
    var end = res.end;
    res.end = function(chunk, encoding) {
      res.end = end;
      res.end(chunk, encoding);
      var line = fmt(exports, req, res);
      if (null == line) return;
      logger.info(line);
    };

    next();
  };
};


/**
 * Compile `fmt` into a function.
 *
 * @param {String} fmt
 * @return {Function}
 * @api private
 */

function compile(fmt) {
  fmt = fmt.replace(/"/g, '\\"');
  var js = '  return "' + fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function(_, name, arg){
    return '"\n    + (tokens["' + name + '"](req, res, "' + arg + '") || "-") + "';
  }) + '";'
  return new Function('tokens, req, res', js);
};

/**
 * Define a token function with the given `name`,
 * and callback `fn(req, res)`.
 *
 * @param {String} name
 * @param {Function} fn
 * @return {Object} exports for chaining
 * @api public
 */

exports.token = function(name, fn) {
  exports[name] = fn;
  return this;
};

/**
 * Define a `fmt` with the given `name`.
 *
 * @param {String} name
 * @param {String|Function} fmt
 * @return {Object} exports for chaining
 * @api public
 */

exports.format = function(name, str){
  exports[name] = str;
  return this;
};

/**
 * Default format.
 */

exports.format('default', ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');

/**
 * Short format.
 */

exports.format('short', ':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms');

/**
 * Tiny format.
 */

exports.format('tiny', ':method :url :status :res[content-length] - :response-time ms');

/**
 * dev (colored)
 */

exports.format('dev', function(tokens, req, res){
  var status = res.statusCode
    , len = parseInt(res.getHeader('Content-Length'), 10)
    , color = 32;

  if (status >= 500) color = 31
  else if (status >= 400) color = 33
  else if (status >= 300) color = 36;

  len = isNaN(len)
    ? ''
    : len = ' - ' + bytes(len);

  return '\033[90m' + req.method
    + ' ' + req.originalUrl + ' '
    + '\033[' + color + 'm' + res.statusCode
    + ' \033[90m'
    + (new Date - req._startTime)
    + 'ms' + len
    + '\033[0m';
});

/**
 * request url
 */

exports.token('url', function(req){
  return req.originalUrl || req.url;
});

/**
 * request method
 */

exports.token('method', function(req){
  return req.method;
});

/**
 * response time in milliseconds
 */

exports.token('response-time', function(req){
  return new Date - req._startTime;
});

/**
 * UTC date
 */

exports.token('date', function(){
  return new Date().toUTCString();
});

/**
 * response status code
 */

exports.token('status', function(req, res){
  return res.statusCode;
});

/**
 * normalized referrer
 */

exports.token('referrer', function(req){
  return req.headers['referer'] || req.headers['referrer'];
});

/**
 * remote address
 */

exports.token('remote-addr', function(req){
  if (req.ip) return req.ip;
  var sock = req.socket;
  if (sock.socket) return sock.socket.remoteAddress;
  return sock.remoteAddress;
});

/**
 * HTTP version
 */

exports.token('http-version', function(req){
  return req.httpVersionMajor + '.' + req.httpVersionMinor;
});

/**
 * UA string
 */

exports.token('user-agent', function(req){
  return req.headers['user-agent'];
});

/**
 * request header
 */

exports.token('req', function(req, res, field){
  return req.headers[field.toLowerCase()];
});

/**
 * response header
 */

exports.token('res', function(req, res, field){
  return (res._headers || {})[field.toLowerCase()];
});

