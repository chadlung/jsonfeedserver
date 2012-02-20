// To run from the 'tests' folder: ../node_modules/nodeunit/bin/nodeunit entry-tests.js

var assert = require('assert')
    , Entry = require('../models/entry.js')
    , nodeUnit = require('../node_modules/nodeunit')
    , util = require('util')
    , TEST_OBJECT = {property1:1, property2:2}
    , TEST_BODY = JSON.stringify(TEST_OBJECT)
    , TEST_FEED = 'namespace/feed/'
    , TEST_SELF_HREF = 'http://localhost:8080/namespace/feed/';

var entry = new Entry('mongodb://localhost/jsonfeedserverTest');

exports.saveEntry = function(test){
    test.expect(2);

    entry.save({body: TEST_BODY,
            feed: TEST_FEED,
            selfHref: TEST_SELF_HREF},
        function(error, returnedEntry) {
            console.log(util.inspect(returnedEntry));
            assert.ok(!error);
            test.equal(returnedEntry.feed, TEST_FEED, 'Failure: Feed should match original data');
            test.equal(returnedEntry.selfHref, TEST_SELF_HREF + '?id=' + returnedEntry._id, 'Failure: Self Href should match original data');
            console.log(util.inspect(entry));
            // HACK: For some reason the connection will hang, pulled this code from here:
            // https://github.com/LearnBoost/mongoose/issues/330
            setTimeout( function () {
                entry.disconnect();
            }, 1000);
            test.done();
        });
};