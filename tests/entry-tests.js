// To run from the 'whiskey/bin' folder: ./whiskey ../../../tests/entry-tests.js

var Entry = require('../models/entry.js')
    , util = require('util')
    , TEST_FEED = 'namespace/feed/'
    , TEST_SELF_HREF = 'http://localhost:8080/namespace/feed/';

var entry = new Entry('mongodb://localhost/jsonfeedserverTest');

var TEST_OBJECT = {
    property1:1
    , property2:2
}

var TEST_BODY = JSON.stringify(TEST_OBJECT);

exports['test_model_entry'] = function(test, assert) {
    entry.save({body: TEST_BODY,
            feed: TEST_FEED,
            selfHref: TEST_SELF_HREF},
        function(error, returnedEntry) {
            //console.log(util.inspect(returnedEntry));
            assert.ok(!error);
            assert.equal(returnedEntry.feed, TEST_FEED, 'Failure: Feed should match original data');
            assert.equal(returnedEntry.selfHref, TEST_SELF_HREF + '?id=' + returnedEntry._id, 'Failure: Self Href should match original data');

            entry.getId(returnedEntry._id, function (error, returnedIdEntry) {
                assert.ok(!error);
                assert.equal(returnedIdEntry._id.toString(), returnedEntry._id.toString(), 'Failure: Returned entry ID did not match saved ID');
                
                entry.getFeed({feed: TEST_FEED, limit: 25, skip: 0}, function (error, returnedIdEntries) {
                    assert.ok(!error);
                    assert.ok(returnedIdEntries.length > 0, 'Failure: Returned entries count should be 1 or greater');
                    test.finish();
                }); 
            });            
        });
}

exports['tearDown'] = function(test, assert) {
    // HACK: For some reason the connection will hang, pulled this code from here:
    // https://github.com/LearnBoost/mongoose/issues/330
    setTimeout( function () {
        entry.disconnect();
        test.finish();
    }, 1000);
}