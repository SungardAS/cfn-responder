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
* Will remove PhysicalResourceId when the `ResourceType` is `Create` and
  the status is `FAILED` per the AWS [documentation](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requesttypes-create.html).
* Removes console.log statements in favor of forwarding request errors
  to context.done directly

Any Lambda function using this module stops running after executing the module's send method.

For more information, read the AWS documentation [here][1]

[1]: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-cfnresponsemodule
