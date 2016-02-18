var assert = require('assert'),
  nock = require('nock'),
  responder = require('../');

//var event = {
//RequestType: "Create",
//RequestId: "unique id for this create request",
//ResponseURL: "https://fake.url",
//ResourceType: "Custom::MyCustomResourceType",
//LogicalResourceId: "name of resource in template",
//StackId: "arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid"
//};

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
    };

    var context = {
      done: function(err,obj) {
        assert(err);
        cb();
      }
    };
    responder.send(event,context,responder.SUCCESS);
  });

  it("should remove PhysicalResourceId if the RequestType is Create and status is failed", function(cb) {

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
        obj = JSON.parse(obj);
        assert.ifError(err);
        assert(obj.RequestId);
        assert.equal(obj.PhysicalResourceId,undefined);
        cb();
      }
    };
    responder.send(event,context,responder.FAILED,{});
  });

});