import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

app.get('/helloWorld', (req, res) => {
    res.send('Hello world!');
})

app.listen(port, () => console.log('listening on port 3000'))
