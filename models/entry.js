var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var JSONEntry = new Schema({
    body: { type: String },
    feed: { type: String, index: true },
    selfHref: { type: String, index: false },
    entryDate: { type: Date, default: Date.now }
});
var jsonEntryModel = mongoose.model('JSONEntry', JSONEntry);

var entry = exports = module.exports = function(connectionURL) {
    mongoose.connect(connectionURL);
};

entry.prototype.save = function(incomingJsonEntry, callback) {
    var jsonEntry = new jsonEntryModel();
    jsonEntry.body = JSON.stringify(incomingJsonEntry.body);
    jsonEntry.feed = incomingJsonEntry.feed;
    jsonEntry.selfHref = incomingJsonEntry.selfHref + '?id=' + jsonEntry._id;
    callback(jsonEntry.save(), jsonEntry);
}

entry.prototype.getId = function(id, callback) {
    jsonEntryModel.findOne({ _id: id.id }, callback);
}

entry.prototype.getFeed = function(obj, callback) {
    var query = jsonEntryModel.find({});
    query.where('feed', obj.feed).desc('entryDate').skip(obj.skip).limit(obj.limit).run(callback);
}

entry.prototype.disconnect = function() {
    mongoose.disconnect();
}