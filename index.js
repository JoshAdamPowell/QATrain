import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000

app.get('/helloWorld', (req, res) => {
    res.send('Hello world!');
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
