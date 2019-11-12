import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';


const app = express();
const PORT = process.env.PORT || 5000
app.use(bodyParser);

app.get('/helloWorld', (req, res) => {
    res.send('Hello world!');
})

const developers = [
    "Josh",
    "Robin",
    "Nathan"
];
const rando = Math.floor(Math.random() * developers.length);


app.post('/qa', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
    axios.post(req.body.response_url, {text: `${developers[rando]} is the guy for you`})

})


app.listen(PORT, () => console.log(`listening on port ${PORT}`))
