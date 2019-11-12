import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';


const app = express();
const PORT = process.env.PORT || 5000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

const messages =[
    "@@@ is the QAer for the job",
    "@@@ It's your lucky day, time to do some QA!",
    "eenie meenie minie moe I choose @@@ to do some QA",
    "QA BOT HATH SPOKEN: @@@ shall do the QA",
    "@@@ is the QAer you're looking for",
    "I think @@@ seems in the mood to do some QA",
    "I spy with my little eye: @@@ is about to do some QA",
    "Could @@@ BE about to do any more QA?",
    "@@@ here's a present: Some QA!",
]

const rando = Math.floor(Math.random() * QAers.length);


app.post('/qa', (req, res) => {

    const sendingUserId = req.body.user_id;
    const filteredQa = QAers.filter(q => q.id !== sendingUserId);
    const randomNumber = Math.floor(Math.random() * filteredQa.length);
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const Qaer = filteredQa[randomNumber];
    const userId = `<@${Qaer.id}>`;
    const updatedMessage = randomMessage.replace('@@@', userId)
    const response = {
        response_type: "in_channel",
        text: updatedMessage
    };
    res.send(response);

})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
