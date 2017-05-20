'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _arrayFlatten = require('array-flatten');

var _arrayFlatten2 = _interopRequireDefault(_arrayFlatten);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _defaultBindings = require('./defaultBindings');

var _defaultBindings2 = _interopRequireDefault(_defaultBindings);

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _constitute = require('constitute');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NODE_PORT = process.env.NODE_PORT || _settings2.default.EXPRESS_SERVER_CONFIG.PORT;

process.on('uncaughtException', function (exception) {
  _logger2.default.error('uncaughtException', { message: exception.message, stack: exception.stack }); // logging with MetaData
  process.exit(1); // exit with failure
});

/* This is the container used app-wide for dependency injection. If you want to
 * override any of the implementations, create your module with the new
 * implementation and use:
 *
 * container.bindAlias(DefaultImplementation, MyNewImplementation);
 *
 * You can also set a new value
 * container.bindAlias(DefaultValue, 12345);
 *
 * See https://github.com/justmoon/constitute for more info
 */
var container = new _constitute.Container();
(0, _defaultBindings2.default)(container, _settings2.default);

var deviceServer = container.constitute('DeviceServer');
deviceServer.start();

var app = (0, _app2.default)(container, _settings2.default);

var onServerStartListen = function onServerStartListen() {
  return console.log('express server started on port ' + NODE_PORT);
};

if (_settings2.default.EXPRESS_SERVER_CONFIG.USE_SSL) {
  var options = {
    cert: _fs2.default.readFileSync((0, _nullthrows2.default)(_settings2.default.EXPRESS_SERVER_CONFIG.SSL_CERTIFICATE_FILEPATH)),
    key: _fs2.default.readFileSync((0, _nullthrows2.default)(_settings2.default.EXPRESS_SERVER_CONFIG.SSL_PRIVATE_KEY_FILEPATH))
  };

  _https2.default.createServer(options, app).listen(NODE_PORT, onServerStartListen);
} else {
  _http2.default.createServer(app).listen(NODE_PORT, onServerStartListen);
}

var addresses = (0, _arrayFlatten2.default)((0, _entries2.default)(_os2.default.networkInterfaces()).map(
// eslint-disable-next-line no-unused-vars
function (_ref) {
  var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
      name = _ref2[0],
      nic = _ref2[1];

  return nic.filter(function (address) {
    return address.family === 'IPv4' && address.address !== '127.0.0.1';
  }).map(function (address) {
    return address.address;
  });
}));
addresses.forEach(function (address) {
  return console.log('Your device server IP address is: ' + address);
});