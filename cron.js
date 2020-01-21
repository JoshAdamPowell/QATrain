import axios from 'axios';
import { Client } from 'pg';
import standupMessages from './standupMessages';

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  
client.connect();

const getRandomEntryFromList = (arr) => {
    const randomNumber = Math.floor(Math.random() * arr.length);
    return arr[randomNumber];
}

const dayOfWeek = new Date().getDay();
const isItFridayOrMonday = dayOfWeek === 1 || dayOfWeek === 5;
const query = isItFridayOrMonday ? 'WHERE issoftwire = FALSE' : '';

client.query(`SELECT * FROM Developers ${query}`).then(results => {
    const actualList = [];
    results.forEach(q => {
        for(let i = q.standupscore; i > 0; i--){
            actualList.push(q.id);
        }
    })
    const idToQa = getRandomEntryFromList(actualList)
    const qaEr = toQA.filter(p => p.id === idToQa)[0];
    const randomMessage = getRandomEntryFromList(standupMessages)
    const message = replaceMessage(randomMessage, qaEr);
    const response = {
        channel: "C9P7QQEH0",
        text: message
    };
        toQA.forEach(p => {
            if (p.id === qaEr.id){
                client.query('UPDATE Developers SET standupscore = 0 WHERE id = $1', [qaEr.id])
            } else {
                client.query('UPDATE Developers SET standupscore = $1 WHERE id = $2', [p.standupscore + 1, p.id])
        }
    })
    axios({
        method: 'post',
        url: 'https://slack.com/api/chat.postMessage',
        headers: {
            Authorization: "Bearer xoxp-99552704240-547373965859-831463387632-b5c585991485b373ac98eda5a7858b2f",
        },
        data: {
            channel: "C9P7QQEH0",
            text: "Time to pick someone for standup!"
        }
    })
})



