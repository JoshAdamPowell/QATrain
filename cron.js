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
    results.rows.forEach(q => {
        for(let i = q.standupscore; i > 0; i--){
            actualList.push(q.id);
        }
    })
    const idToQa = getRandomEntryFromList(actualList)
    const qaEr = toQA.filter(p => p.id === idToQa)[0];
    const randomMessage = 'Picking someone for standup... It\'s: @@@'; 
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
            Authorization: `Bearer ${process.env.SLACK_KEY}`,
        },
        data: response
    })
})



