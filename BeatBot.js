const tmi = require('tmi.js')
const request = require('request')

var options = {
	options: {
		debug: true
	},
	connection: {
		reconnect: true
	},
	identity: {
		username: 'YOUR_USERNAME_HERE',
		password: 'YOUR_TOKEN_HERE'
	},
    channels: ['#YOUR_CHANNEL_HERE']
}

var client = new tmi.client(options)

client.connect()

client.on('chat', function(channel, userstate, message, self) {
	if(self) return

	let prefix = '!'

	switch(message.split(' ')[0]) {
		case prefix + 'beatrequest':
			if(message.split(' ').length > 1) {
				var q = ''
				for(let i = 1; i < message.split(' ').length; i++) {
					q += message.split(' ')[i] + '%20'
				}
				request({
					url: 'https://beatsaver.com/search.php?q=' + q,
					method: 'GET',
					headers: {
						'User-Agent': 'BeatBot/0.0.1',
						'Content-Type': 'application/json'
					}},
					function(err, res, body) {
						if(!err && res.statusCode == 200) {
							let searchResults = JSON.parse(body)
							let id = searchResults['hits']['hits'][0]['_id'] 
							request({
								url: 'https://beatsaver.com/api.php?mode=details&id=' + id,
								method: 'GET',
								headers: {
									'User-Agent': 'BeatBot/0.0.1',
									'Content-Type': 'application/json'
								}},
								function(err, res, body) {
									if(!err && res.statusCode == 200) {
										let beatmapInfo = JSON.parse(body)[0]
										client.say(channel, '♫ ' + beatmapInfo['beatname'] + ' | ' + beatmapInfo['downloads'] + ' Downloads | ' + beatmapInfo['upvotes'] + ' upvotes | https://beatsaver.com/dl.php?id=' + id + ' ♫')
									} else {
										console.log('Error ' + res.statusCode)
									}
								}
							)
						} else {
							console.log('Error ' + res.statusCode)
						}
					}
				)
			} else {
				client.say(channel, userstate['display-name'] + ': Please specify a search query!')
			}
			break
		default:
			break
	}
});