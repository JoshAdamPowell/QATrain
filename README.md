# QATrain

## How the slackbot works:

- It is a simple REST API service hosted somewhere. When someone uses a [slash command](https://api.slack.com/interactivity/slash-commands) then Slack will send a POST response to the URL you decide. You can set the URLs for various slack commands [here](https://api.slack.com/apps). 
- This post response has a payload which contains a lot of details, most of which we don't need. The things we do want are:
  - `text`: this is whatever is written after the slash command. For example if I did `/standup Thomas Josh` then `text` would equal `"Thomas Josh"`. 
  - `user_id`: This is the slack user ID of the person who invoked the command. Slack IDs look something like this: `UG3AZUDR9`. We use this principally to ensure that the slackbot won't choose the person who invoked the `/qa` command to QA their own work.

- The QA train then responds to this request with a response of 200 with a body of:
```
  {
    response_type: "in_channel",
    body: message
  }
```

## The Database

Slackbot uses a postgres database which has only one table: `Developers`. 

| ID | Name          | CanQa | isSoftwire | qaScore | standupScore | slackId  |
|----|---------------|-------|------------|---------|--------------|----------|
| 1  | Josh          | true  | true       | 4       |  0           | UG3AZUDR9|

- `Name`: The persons name, obviously
- `CanQA`: Some people (eg James, Konrad) can run standup but not QA. The QA train will only pick people for QA if canQA is true.
- `isSoftwire`: If this is set to true, then the train will not pick them for standups on Monday or Friday.
- `qaScore`: The greater this number, the more likely they are to be picked for QA. 
- `standupScore`: Like above but for standup
- `slackID`: the slack ID of the person. This is used to @ them and allow slackbot to notify them.

This Database is currently hosted on heroku by me. 

### FAQs

#### Getting a slackID

You can get a list of all slack users in the workspace by making a GET request to `	https://slack.com/api/users.list?token=<your token>`. your token can be found at: https://api.slack.com/apps , clicking on 'OAuth and Permissions', and selecting the `Bot User OAuth Access Token`. You can then ctrl+F in the response to find the user you want.

#### Sending a message as slackbot.

Similar to above you can use the bots token to send messages as the bot. Make a POST request to `https://slack.com/api/chat.postMessage`. This needs an Authorization header equal to `Bearer <token>`, and `content-type: Application/json`. The Body would be along the lines of:

```
{
	"channel": "C0109FLN6V6",
	"text": "Hello World!"
}
```

#### Getting a slack channel ID

For the above you will need a channel ID. The easiest way to get one of these is to right click a channel in the slack app and select copy link. You will have a link like: `https://roh-ddt.slack.com/archives/C0109FLN6V6`. The last bit is the channel ID.

# Future Work

## Moving to AWS

Both the bot itself and its postgres database are hosted by me in heroku. They would work very well as an AWS lambda however. All that would need changing would be the URL that the slash command would invoke (currently this is `https://opera-bot.herokuapp.com/qa` and `https://opera-bot.herokuapp.com/standup`). The `process.env.DATABASE_URL` would also need to be updated to match the new database location.