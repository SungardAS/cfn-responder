var rc = require("rc");
var log = require("loglevel");

exports.SUCCESS = "SUCCESS";
exports.FAILED = "FAILED";



exports.send = function(event, context, responseStatus, responseData, physicalResourceId, options) {

  // rc mutates defaults, so we define them here
  var DEFAULTS = {
    returnError: true,
    logLevel: "info"
  };

  options = options || {};

  var cfg = rc("cfn_responder",DEFAULTS,options);
  var doneCallback = context.done;
  log.setLevel(cfg.logLevel);

  responseData = responseData || {};
  if (typeof responseData !== 'object') {
    if (cfg.returnError) {
      return doneCallback("'Data' must be a key/pair object");
    }
    else {
      responseData = {};
      log.info("'Data' was set to an empty object because it was not a valid key/pair object");
    }
  }

  var jsonBody = {
    Status: responseStatus,
    Reason: event.Reason || "See the details in CloudWatch Log Stream: " + context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: responseData
  };

  jsonBody.PhysicalResourceId = physicalResourceId || context.logStreamName;

  // If this lambda function does not have permissions to CloudWatch Logs
  // a PhysicalResourceId is still needed to send to CloudFormation.
  if (event.RequestType === 'Create' && responseStatus === exports.FAILED && !jsonBody.PhysicalResourceId) {
    jsonBody.PhysicalResourceId = exports.FAILED;
  }

  log.debug(jsonBody);
  var responseBody = JSON.stringify(jsonBody);

  var https = require("https");
  var url = require("url");

  var parsedUrl = url.parse(event.ResponseURL);
  var httpOptions = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.path,
    method: "PUT",
    headers: {
      "content-type": "",
      "content-length": responseBody.length
    }
  };
  log.debug("httpOptions",httpOptions);

  var request = https.request(httpOptions, function(response) {
    if (response.statusCode === 200)
      return doneCallback(null, jsonBody);

    var errMsg = "Failed to communicate to S3: " + response.statusCode;
    if (cfg.returnError) {
      return doneCallback(errMsg,jsonBody);
    }
    else {
      log.info(errMsg);
      return doneCallback(null);
    }
  });

  request.on("error", function(error) {
    var errMsg = "send(..) failed executing https.request(..): " + error;
    if (cfg.returnError) {
      doneCallback(errMsg);
    }
    else {
      log.info(errMsg);
      doneCallback(null);
    }
  });

  request.write(responseBody);
  request.end();
}

