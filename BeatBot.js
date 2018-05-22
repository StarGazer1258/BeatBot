const tmi = require('tmi.js')
const request = require('request')
const pattern = require('./pattern.json')

const version = '0.1.0'

var options = {
	options: {
		debug: true
	},
	connection: {
		reconnect: true
	},
	identity: {
		username: 'BOT_USERNAME_HERE',
		password: 'BOT_TOKEN_HERE'
	},
    channels: ['#YOUR_CHANNEL_HERE']
}

function getPatternizedMessage(beatmapInfo) {
	var message = ''
	for(let i = 0; i < pattern.length; i++) {
		switch(pattern[i]) {
			//TODO Escape HTML codes
			case '$authorName':
				message += beatmapInfo['authorName']
				break
			case '$beatname':
				message += beatmapInfo['beatname']
				break
			case '$beatsPerMinute':
				message += beatmapInfo['beatsPerMinute']
				break
			case '$beatText':
				message += beatmapInfo['beattext']
				break
			case '$downloadLink':
				message += 'https://beatsaver.com/dl.php?id=' + beatmapInfo['id']
				break
			case '$downloads':
				message += beatmapInfo['downloads']
				break
			case '$id':
				message += beatmapInfo['id']
				break
			case '$ownerID':
				message += beatmapInfo['ownerid']
				break
			case '$plays':
				message += beatmapInfo['plays']
				break
			case '$songName':
				message += beatmapInfo['songName']
				break
			case '$songSubName':
				message += beatmapInfo['songSubName']
				break
			case '$uploadTime':
				//TODO Format epoch time to standard date format
				message += beatmapInfo['uploadtime']
				break
			case '$upvotes':
				message += beatmapInfo['upvotes']
				break
			case '$webLink':
				message += 'https://beatsaver.com/details.php?id=' + beatmapInfo['id']
				break
			default:
				message += pattern[i]
				break
		}
	}

	return message
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
						'User-Agent': 'BeatBot/' + version,
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
									'User-Agent': 'BeatBot/' + version,
									'Content-Type': 'application/json'
								}},
								function(err, res, body) {
									if(!err && res.statusCode == 200) {
										let beatmapInfo = JSON.parse(body)[0]
										client.say(channel, getPatternizedMessage(beatmapInfo))
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
})