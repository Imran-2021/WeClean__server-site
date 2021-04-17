const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@imrancluster.1djvc.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const allServices = client.db("We-Clean").collection("We-Clean-services");
  const allReviews = client.db("We-Clean").collection("reviews");
  const selectedService = client.db("We-Clean").collection("selectedServices");
 console.log("database connected successfully");

    app.post('/addServices',(req,res)=>{
        const newServices = req.body;
        allServices.insertOne(newServices)
        .then(result=>{
            res.send(result.insertedCount>0);
            // console.log(res);
        })
        // console.log(newServices);

    })
    app.get('/services',(req,res)=>{
        allServices.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
    app.post('/addReviews',(req,res)=>{
        const review = req.body;
        allReviews.insertOne(review)
        .then(result=>{
            res.send(result.insertedCount>0);
        })

    })
    app.get('/reviews',(req,res)=>{
        allReviews.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
    app.post('/selectedServices',(req,res)=>{
        const service = req.body;
        selectedService.insertOne(service)
        .then(result=>{
            res.send(result.insertedCount>0);
        })

    })
    app.get('/selectedService',(req,res)=>{
        selectedService.find({userEmail:req.query.email})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)