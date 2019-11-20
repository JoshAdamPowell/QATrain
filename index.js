import express from 'express';
import bodyParser from 'body-parser';
import people from './people';
import messages from './QAmessages';
import standupMessages from './standupMessages';

const app = express();
const PORT = process.env.PORT || 5000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const getRandomEntryFromList = (arr) => {
    const randomNumber = Math.floor(Math.random() * arr.length);
    return arr[randomNumber];
}

const replaceMessage = (message, person) => {
    const userId = `<@${person.id}>`;
    return message.replace('@@@', userId);
}

const getMessage = (messages, people) => {
    const randomMessage = getRandomEntryFromList(messages)
    const randomPerson = getRandomEntryFromList(people);
    return replaceMessage(randomMessage, randomPerson);
}

app.get('/helloWorld', (req, res) => {
    console.log('hello');
    res.send('Hello world!');
})

app.post('/qa', (req, res) => {
    const text = req.body.text ? req.body.text.toLowerCase() : ""
    const sendingUserId = req.body.user_id;
    const filteredQa = people.filter(q => q.id !== sendingUserId && q.isQaer && !text.includes(q.name.toLowerCase()));
    const message = getMessage(messages, filteredQa)

    const response = {
        response_type: "in_channel",
        text: message
    };
    res.send(response);

})

app.post('/standup', (req, res) => {
    const text = req.body.text ? req.body.text.toLowerCase() : ""
    const dayOfWeek = new Date().getDay();
    const isItFridayOrMonday = dayOfWeek === 1 || dayOfWeek === 5;
    const standupers = people.filter(p => !(isItFridayOrMonday && p.isSoftwire) && !text.includes(p.name.toLowerCase()))
    const message = getMessage(standupMessages, standupers);

    const response = {
        response_type: "in_channel",
        text: message
    };
    res.send(response);
})



app.listen(PORT, () => console.log(`listening on port ${PORT}`))
