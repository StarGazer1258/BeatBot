# BeatBot
A Twitch.tv bot for BeatSa(b/v)er

## How to use
  1. [Download and install Node.js.](https://nodejs.org/en/download/)
  2. [Download this repository](https://github.com/StarGazer1258/BeatBot/archive/master.zip) and unzip it.
  3. [Create a Twitch.tv account for your bot.](https://www.twitch.tv/signup)
  4. Use [this tool](https://twitchapps.com/tmi/) to get an OAuth Token for your bot.
  5. Edit lines 15, 16, and 18 of *BeatBot.js* with your bot's username, token, and *your* channel name (preceded by a *#*.) **Don't forget to save!**
  6. Open a terminal/command line.
     * **Windows:** Press WIN+R, then type ``cmd`` and hit Enter.
     * **OSX:** Press CMD+Space, then type ``Terminal`` and hit Enter.
  7. Type ``cd``, hit Space, then drag the folder containing the script into the console and hit Enter.
  8. Type ``npm install`` and hit Enter. This installs all necessary modules.
  9. Type ``npm start`` and hit Enter to start the bot.

I'll keep working on simplifying these instructions and processes, but this is it for now.

## Message patterns
Message patterns are used to customize the information that is returned by the bot. The message pattern currently in use is stored in the *pattern.json* file. You can use custom text and a variety of variables to customize your returned message with the information that you want.

Here is an example patten:
```JSON
["♫ ", "$beatname", " | ", "$downloads", " downloads | ", "$upvotes", " upvotes | ", "$downloadLink", " ♫"]
```

For a song with id *27*, Outputs:
```
♫ a-ha - Take On Me | 13155 downloads | 35 upvotes | https://beatsaver.com/dl.php?id=27 ♫
```

Variables, marked with a `$`, are separated from plain text in a JSON array. It is very important that these variables are on their own. They **will not** work when in the same string as plain text.

Here is a list of supported variables (most of them are self-explanatory):
```
$authorName
$beatName
$beatsPerMinute
$beatText
$downloadLink
$downloads
$id
$ownerID
$plays
$songName
$songSubName
$uploadTime
$upvotes
$webLink
```