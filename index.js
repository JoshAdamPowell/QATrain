import express from 'express';
import bodyParser from 'body-parser';
import people from './people';
import messages from './QAmessages';
import standupMessages from './standupMessages';
import { Client } from 'pg'

const app = express();
const PORT = process.env.PORT || 5000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  
  client.connect();


app.get('/dbTest', (req, res) => {

    client.query('SELECT * FROM Developers WHERE id = 2').then(x => {
        console.log(x);
        
        res.send(x)})
})


const getRandomEntryFromList = (arr) => {
    const randomNumber = Math.floor(Math.random() * arr.length);
    return arr[randomNumber];
}

const replaceMessage = (message, person) => {
    const userId = `<@${person.slackid}>`;
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
    client.query('SELECT * FROM Developers WHERE canQa = TRUE').then(results => {
        const toQA = results.rows.filter(person => person.slackid !== sendingUserId && !text.includes(person.name.toLowerCase()));
        const actualList = [];
        toQA.forEach(q => {
            for(let i = q.qascore; i > 0; i--){
                actualList.push(q.id);
            }
        })
        const idToQa = getRandomEntryFromList(actualList)
        const qaEr = toQA.filter(p => p.id === idToQa)[0];
        const randomMessage = getRandomEntryFromList(messages)
        const message = replaceMessage(randomMessage, qaEr);
        const response = {
            response_type: "in_channel",
            text: message
        };
        res.send(response);
        console.log(qaEr.id)
            toQA.forEach(p => {
                if (p.id === qaEr.id){
                    client.query('UPDATE Developers SET QAScore = 0 WHERE id = $1', [qaEr.id])
                } else {
                    client.query('UPDATE Developers SET QAScore = $1 WHERE id = $2', [p.qascore + 1, p.id])
            }
        })
    })

})

app.post('/standup', (req, res) => {
    const text = req.body.text ? req.body.text.toLowerCase() : ""
    const dayOfWeek = new Date().getDay();
    const isItFridayOrMonday = dayOfWeek === 1 || dayOfWeek === 5;
    const query = isItFridayOrMonday ? 'WHERE issoftwire = FALSE' : '';

    client.query(`SELECT * FROM Developers ${query}`).then(results => {
        const toQA = results.rows.filter(person => !text.includes(person.name.toLowerCase()));
        const actualList = [];
        toQA.forEach(q => {
            for(let i = q.standupscore; i > 0; i--){
                actualList.push(q.id);
            }
        })
        console.log(actualList);
        const idToQa = getRandomEntryFromList(actualList)
        const qaEr = toQA.filter(p => p.id === idToQa)[0];
        const randomMessage = getRandomEntryFromList(standupMessages)
        const message = replaceMessage(randomMessage, qaEr);
        const response = {
            response_type: "in_channel",
            text: message
        };
        res.send(response);
            toQA.forEach(p => {
                if (p.id === qaEr.id){
                    client.query('UPDATE Developers SET standupscore = 0 WHERE id = $1', [qaEr.id])
                } else {
                    client.query('UPDATE Developers SET standupscore = $1 WHERE id = $2', [p.standupscore + 1, p.id])
            }
        })
    })
})

app.post('/debug', (req, res) => {
    const text = req.body.text ? req.body.text.toLowerCase() : ""
    const dayOfWeek = new Date().getDay();
    const isItFridayOrMonday = dayOfWeek === 1 || dayOfWeek === 5;
    const standupers = people.filter(p => !(isItFridayOrMonday && p.isSoftwire) && !text.includes(p.name.toLowerCase()))
    const randomPerson = getRandomEntryFromList(standupers);

    const response = {
        response_type: "in_channel",
        text: randomPerson.name
    };
    res.send(response);
})


app.listen(PORT, () => console.log(`listening on port ${PORT}`))
