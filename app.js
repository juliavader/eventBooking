// state of advancement = 8
// goal = Adding the possibility to  book an event as an user 

// node framework
const express = require('express');
// middleware that reads json from incoming endpoints
const bodyParser = require('body-parser');
// mongoose library
const mongoose = require('mongoose');

// package that exports a function that helps funneling requests through the grapql query parser
const graphqlHttp = require('express-graphql');
const app = express();

// import schema 
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

app.use(bodyParser.json());


app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);



mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@eventbooking-ouibp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })


