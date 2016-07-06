#cfn-responder

[![Build
Status](https://travis-ci.org/SungardAS/cfn-responder.svg?branch=master)](https://travis-ci.org/SungardAS/cfn-responder?branch=master)
[![Code
Climate](https://codeclimate.com/github/SungardAS/cfn-responder/badges/gpa.svg?branch=master)](https://codeclimate.com/github/SungardAS/cfn-responder?branch=master)
[![Coverage
Status](https://coveralls.io/repos/SungardAS/cfn-responder/badge.svg?branch=master)](https://coveralls.io/r/SungardAS/cfn-responder?branch=master)
[![Dependency
Status](https://david-dm.org/SungardAS/cfn-responder.svg?branch=master)](https://david-dm.org/SungardAS/cfn-responder?branch=master)

This module contains functions that respond on behalf of custom resources you create using AWS CloudFormation and was orignally forked from [LukeMizuhashi/cfn-response](https://github.com/LukeMizuhashi/cfn-response).

This module makes the following enhancements:

* Added check to ensure Data is a key/pair object.  Prevents silent
  failures after submitting to S3
* Will ensure a PhysicalResourceId is always present even if the lambda
  function does not have permissions to CloudWatch Logs
* For security console.log statements are removed to prevent leaking any
  sensitive data.  Request errors and return objects are sent context.done only

Any Lambda function using this module stops running after executing the module's send method.

For more information, read the AWS documentation [here][1]

[1]: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-cfnresponsemodule
