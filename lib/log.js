var winston = require("winston");

module.exports.getLogger = function() {
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        json: true,
        stringify: true,
        timestamp: true
      })
    ]
  });
  return logger;
};
