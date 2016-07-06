exports.SUCCESS = "SUCCESS";
exports.FAILED = "FAILED";

exports.send = function(event, context, responseStatus, responseData, physicalResourceId) {

  responseData = responseData || {};
  if (typeof responseData !== 'object') {
    return context.done("'Data' must be a key/pair object");
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

  var responseBody = JSON.stringify(jsonBody);

  var https = require("https");
  var url = require("url");

  var parsedUrl = url.parse(event.ResponseURL);
  var options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.path,
    method: "PUT",
    headers: {
      "content-type": "",
      "content-length": responseBody.length
    }
  };

  var request = https.request(options, function(response) {
    if (response.statusCode === 200)
      return context.done(null, jsonBody);

    context.done("Failed to communicate to S3: " + response.statusCode,jsonBody);
  });

  request.on("error", function(error) {
    context.done("send(..) failed executing https.request(..): " + error);
  });

  request.write(responseBody);
  request.end();
}

