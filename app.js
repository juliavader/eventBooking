// state of advancement = 16
// goal = Adding events endpoint to the front


// node framework
const express = require('express');
// middleware that reads json from incoming endpoints
const bodyParser = require('body-parser');
// mongoose library
const mongoose = require('mongoose');

// package that exports a function that helps funneling requests through the grapql query parser
const graphqlHttp = require('express-graphql');
const app = express();

// import schema and resolver
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

// Allow cross origin
app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if(req.method == 'OPTIONS'){
    return res.sendStatus(200);
  }
  next();
});

// add resolver
const isAuth = require('./middleware/is-auth'); 

app.use(bodyParser.json());
app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);



mongoose.connect(`mongodb+srv://julia:${process.env.MONGO_PASSWORD}@eventbooking-ouibp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    })


