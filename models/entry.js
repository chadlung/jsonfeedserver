var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var JSONEntry = new Schema({
    body: { type: String },
    feed: { type: String, index: true },
    selfHref: { type: String, index: false },
    entryDate: { type: Date, default: Date.now, index: true }
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
};

entry.prototype.getId = function(id, callback) {
    jsonEntryModel.findOne({ _id: id }, callback);
};

entry.prototype.getFeed = function(obj, callback) {
    jsonEntryModel.find({}).where('feed', obj.feed).sort({ entryDate: 'asc'}).skip(obj.skip).limit(obj.limit).exec(callback);
};

entry.prototype.disconnect = function() {
    mongoose.disconnect();
};