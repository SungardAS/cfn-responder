var assert = require('assert'),
  nock = require('nock'),
  responder = require('../');

describe("cfn-responder", function() {

  it("should fail if Data is not a key/pair object", function(cb) {

    var event = {
      ResponseURL: "https://fake.url"
    };

    var context = {
      done: function(err,obj) {
        assert(err);
        cb();
      }
    };
    responder.send(event,context,responder.SUCCESS,"string");
  });

  it("should return failure if no communication to S3", function(cb) {

    var event = {
      ResponseURL: "https://fake2.url"
    };

    var context = {
      done: function(err,obj) {
        assert(err);
        cb();
      }
    };
    responder.send(event,context,responder.SUCCESS);
  });

  it("should return failure if no communication to S3", function(cb) {

    var event = {
      ResponseURL: "https://fake2.url"
    };

    var context = {
      done: function(err,obj) {
        assert.ifError(err);
        cb();
      }
    };
    responder.send(event,context,responder.SUCCESS,null,null,{returnError: false});
  });


  it("should contain a PhysicalResourceId if the RequestType is Create and status is failed", function(cb) {

    nock('https://fake.url')
    .put('/', {"Status":"FAILED","Reason":"See the details in CloudWatch Log Stream: undefined","StackId":"arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid","RequestId":"unique id for this create request","LogicalResourceId":"name of resource in template","Data":{}})
    .reply(200, {});

    var event = {
      ResponseURL: "https://fake.url",
      RequestType: "Create",
      RequestId: "unique id for this create request",
      ResponseURL: "https://fake.url",
      ResourceType: "Custom::MyCustomResourceType",
      LogicalResourceId: "name of resource in template",
      StackId: "arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid"
    };

    var context = {
      done: function(err,obj) {
        assert.ifError(err);
        assert(obj.RequestId);
        assert.equal(obj.PhysicalResourceId,'FAILED');
        cb();
      }
    };
    responder.send(event,context,responder.FAILED,{});
  });

  it("should contain PhysicalResourceId if the RequestType is Create and status is success", function(cb) {

    nock('https://fake.url')
    .put('/', {"Status":"SUCCESS","Reason":"See the details in CloudWatch Log Stream: undefined","StackId":"arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid","RequestId":"unique id for this create request","LogicalResourceId":"name of resource in template","Data":{}})
    .reply(200, {});

    var event = {
      ResponseURL: "https://fake.url",
      RequestType: "Create",
      RequestId: "unique id for this create request",
      ResponseURL: "https://fake.url",
      ResourceType: "Custom::MyCustomResourceType",
      LogicalResourceId: "name of resource in template",
      StackId: "arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid"
    };

    var context = {
      done: function(err,obj) {
        assert.ifError(err);
        assert(obj.RequestId);
        assert(obj.PhysicalResourceId);
        cb();
      }
    };
    responder.send(event,context,responder.SUCCESS,{},1);
  });

  it("should return error if a non-200 is return from S3", function(cb) {

    nock('https://fake.url')
    .put('/', {"Status":"SUCCESS","Reason":"See the details in CloudWatch Log Stream: undefined","StackId":"arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid","RequestId":"unique id for this create request","LogicalResourceId":"name of resource in template","Data":{}})
    .reply(500, {});

    var event = {
      ResponseURL: "https://fake.url",
      RequestType: "Create",
      RequestId: "unique id for this create request",
      ResponseURL: "https://fake.url",
      ResourceType: "Custom::MyCustomResourceType",
      LogicalResourceId: "name of resource in template",
      StackId: "arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid"
    };

    var context = {
      done: function(err,obj) {
        assert(err);
        cb();
      }
    };
    responder.send(event,context,responder.SUCCESS,{},1);
  });

  it("should return success if a non-200 is return from S3 and returnError is false", function(cb) {

    nock('https://fake.url')
    .put('/', {"Status":"SUCCESS","Reason":"See the details in CloudWatch Log Stream: undefined","StackId":"arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid","RequestId":"unique id for this create request","LogicalResourceId":"name of resource in template","Data":{}})
    .reply(500, {});

    var event = {
      ResponseURL: "https://fake.url",
      RequestType: "Create",
      RequestId: "unique id for this create request",
      ResponseURL: "https://fake.url",
      ResourceType: "Custom::MyCustomResourceType",
      LogicalResourceId: "name of resource in template",
      StackId: "arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid"
    };

    var context = {
      done: function(err,obj) {
        assert.ifError(err);
        cb();
      }
    };
    responder.send(event,context,responder.SUCCESS,{},1,{returnError: false});
  });


});
