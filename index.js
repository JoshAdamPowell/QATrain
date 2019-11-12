import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';


const app = express();
const PORT = process.env.PORT || 5000
app.use(bodyParser.json());

app.get('/helloWorld', (req, res) => {
    console.log('hello');
    res.send('Hello world!');
})

const QAers = [
    {
        name: "Josh",
        id: "UG3AZUDR9"
    },
    {
        name: "Robin",
        id: "UNZJ1235L"
    },
    {
        name: "Nathan",
        id: "UPB3V5EN7"
    },
    {
        name: "Ray",
        id: "UF87QFDAL"
    },
    {
        name: "Esam",
        id: "UF8BM027K"
    },
    {
        name: "Konrad",
        id: "UN6RMRXB3"
    },
    {
        name: "Thomas",
        id: "U2XH996F3"
    }
];

const rando = Math.floor(Math.random() * QAers.length);


app.post('/qa', (req, res) => {
    console.log(req.body);
    console.log(req.body.user_id)
    const response = {
        response_type: "in_channel",
        text: `<@${QAers[0].id}> is the guy for you, also ${JSON.stringify(req.query)}`
    };
    console.log(response);
    res.send(response);
    //axios.post(req.body.response_url, {text: `${developers[rando]} is the guy for you`})

})


app.listen(PORT, () => console.log(`listening on port ${PORT}`))
