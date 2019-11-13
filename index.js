import express from 'express';
import bodyParser from 'body-parser';


const app = express();
const PORT = process.env.PORT || 5000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/helloWorld', (req, res) => {
    console.log('hello');
    res.send('Hello world!');
})

const people = [
    {
        name: "Josh",
        id: "UG3AZUDR9",
        isQaer: true,
        isSoftwire: true
    },
    {
        name: "Robin",
        id: "UNZJ1235L",
        isQaer: true,
        isSoftwire: true
    },
    {
        name: "Nathan",
        id: "UPB3V5EN7",
        isQaer: true,
        isSoftwire: true
    },
    {
        name: "Ray",
        id: "UF87QFDAL",
        isQaer: true,
        isSoftwire: false
    },
    {
        name: "Esam",
        id: "UF8BM027K",
        isQaer: true,
        isSoftwire: false
    },
    {
        name: "Konrad",
        id: "UN6RMRXB3",
        isQaer: true,
        isSoftwire: false
    },
    {
        name: "Thomas",
        id: "U2XH996F3",
        isQaer: true,
        isSoftwire: false
    },
    {
        name: "Pramila",
        id: "U3CUJ3Q56",
        isQaer: false,
        isSoftwire: false
    },
    {
        name: "James",
        id: "U8U9U7588",
        isQaer: false,
        isSoftwire: false
    }
];

const messages =[
    "@@@ is the QAer for the job",
    "@@@ It's your lucky day, time to do some QA!",
    "eenie meenie minie moe I choose @@@ to do some QA",
    "QA BOT HATH SPOKEN: @@@ shalt do the QA",
    "@@@ is the QAer you're looking for",
    "I think @@@ seems in the mood to do some QA",
    "I spy with my little eye: @@@ is about to do some QA",
    "Could @@@ BE about to do any more QA?",
    "@@@ here's a present: Some QA!",
    "Choo Choo! @@@ is all aboard the QA train!"
];

const standupMessages = [
    "@@@ will be walking the board today",
    "Rejoice! @@@ is about to walk us through the board",
    "The board is about to be walked by @@@",
];

const rando = Math.floor(Math.random() * people.length);


app.post('/qa', (req, res) => {
    let text = "";
    if (req.body.text){
        text = req.body.text.toLowerCase()
    };
    const sendingUserId = req.body.user_id;
    const filteredQa = people.filter(q => q.id !== sendingUserId && q.isQaer && !text.includes(q.name.toLowerCase()));
    const randomNumber = Math.floor(Math.random() * filteredQa.length);
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const Qaer = filteredQa[randomNumber];
    const userId = `<@${Qaer.id}>`;
    const updatedMessage = randomMessage.replace('@@@', userId);
    const response = {
        response_type: "in_channel",
        text: updatedMessage
    };
    res.send(response);

})

app.post('/standup', (req, res) => {
    const dayOfWeek = new Date().getDay();
    const isItFridayOrMonday = dayOfWeek === 1 || dayOfWeek === 5;
    const standupers = people.filter(p => !isItFridayOrMonday || !p.isSoftwire)
    const randomNumber = Math.floor(Math.random() * standupers.length);
    const standuper = standupers[randomNumber];
    const userId = `<@${standuper.id}>`;
    const randomMessage = standupMessages[Math.floor(Math.random() * standupMessages.length)];
    const updatedMessage = randomMessage.replace('@@@', userId);
    const response = {
        response_type: "in_channel",
        text: updatedMessage
    };
    res.send(response);
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
