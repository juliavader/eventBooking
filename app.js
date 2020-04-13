// node framework
const express = require('express');
// middleware that reads json from incoming endpoints
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req,res,next)=>{
    res.send('hello world');
})

app.listen(3000);

