const path = require('path');
const dayjs = require('dayjs');
const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const compression = require('compression');
const twig = require('twig').twig; // ('twig')=Module, "().twig"=render function
const app = express();


// TODO: declare mongoose models
const mongoose = require('mongoose');
const schema = mongoose.Schema;

//definition du schema
const contentSchema = schema({
    date: Date,
    username: {type : String, default: "stephan"},
    content: String,
});

//Creation du Model en utilisant le Schema
const Contenu = mongoose.model('Contenu', contentSchema);
// TODO: connect to mongodb
mongoose.connect('mongodb://rencho:aze@localhost:27017/twitter',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {


    // const newContenu = new Contenu({
    //     date: Date.now(),
    //     content: "Bonjour comment ça va ?",
    // });
    // newContenu.save((err,document)=> {
    //     if (err) {console.log(err)};
    //     console.log(document);
    // });
    

    console.log('Connection à la base de donnée mongo OK');
    Contenu.find({})
           .exec()
           .then(docs => console.log(docs));
}).catch((err)=>{
    console.log(err);
})



app.use(compression())
    .use(bodyParser.json()) // support json encoded bodies
    .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
    .use('/static', express.static(path.join(__dirname, '/static')))
    .use(express.static(__dirname + '/views'))
    /* hard-coded served file: favicon.ico */
    .get('/favicon.ico', function(req, res){
        res.sendFile('favicon.ico', {root: path.join(__dirname, '/static')})
    })
    .get('/rooms', function(req, res){
        // TODO: fill an array with rooms found in database:
        res.json({result: ["globale", "dev", "msi 2020"]});
        // test: res.json({message: "Critical error"});
    })
    .get('/', function(req, res){
        res.render('index.twig', {
            message : "Bonjour je suis le test"
        });
    })
    .post('/room/:roomName/join', function (req, res, next) {
        let roomName = req.params.roomName;
        let userName = req.body.username;
        // TODO: check that roomName exists:
        // test: res.json({message: "Critical error"});
        // TODO: if userName doesn't exist, create it:
        if (!userName) {
            res.json({message: "Username is empty!"});
            return;
        }
        // TODO: replace by a real query to mongoose:
        res.json({
            result: [
                {
                    date: '2020-12-04 11:26:13',
                    username: 'olivier',
                    content: "bonjour",
                },
                {
                     date: '2020-12-04 11:26:13',
                     username: 'florent',
                     content: "bonjour olivier !",
                }
            ]
        });
    })
    .post('/room/:roomName/messages', function (req, res, next) {
        let roomName = req.params['roomName'];
        // TODO: replace by a real query to mongoose:
        res.json({
            result: [
                {
                    date: '2020-12-04 11:26:13',
                    username: 'olivier',
                    content: "bonjour",
                },
                {
                     date: '2020-12-04 11:26:13',
                     username: 'florent',
                     content: "bonjour olivier !",
                }
            ]
        });
    })
    .listen(port);
// ----------------------------------------------
// ----------------------------------------------
// const mongoose = require('mongoose');
// mongoose.connect(
//     'mongodb://localhost/test',
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     }
// );
// const Chien = mongoose.model('Chien', { name: String });
// let toutou = new Chien({ name: 'Arthur' });
// toutou.save(function (err) {
//     if (err) {
//         console.log('error !');
//         process.exit(1);
//     } else {
//         console.log('sauvegarde ok');
//         process.exit(0);
//     }
// });
// ----------------------------------------------
// const {MongoClient} = require('mongodb');
// 
// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };
// 
// async function main(){
//     const uri = "mongodb://localhost:27017/exampleDb";
//     const client = new MongoClient(uri, { useUnifiedTopology: true });
//     try {
//         await client.connect();
//         await listDatabases(client);
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }
// main().catch(console.error);
