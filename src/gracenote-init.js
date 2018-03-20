module.exports = function(gracenote){
const db = process.env.MONGODB_URI || require('./config.js').mongoKey;
	var clientId = process.env.GN_CLIENT_ID || require('./config.js').gracenoteClientId;
	var clientTag = process.env.GN_TAG || require('./config.js').gracenoteTag;
	var userId = process.env.GN_USER_ID || require('./config.js').gracenoteUserId;
	var api = new gracenote(clientId,clientTag,userId);

	api.searchTrack("Johnny Cash", "American IV: The Man Comes Around", "Hurt", function(err, result) {
		// Search Result as array
		console.log(result[0].tracks[0]);

	}, {matchMode: gracenote.BEST_MATCH_ONLY});
};
