// state of advancement = 6
// goal = adding relations between different tables


// node framework
const express = require('express');
// middleware that reads json from incoming endpoints
const bodyParser = require('body-parser');
// mongoose library
const mongoose = require('mongoose');
// bcrypt library 
const bcrypt = require('bcryptjs');
// package that exports a function that helps funneling requests through the grapql query parser
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

// retrieve Schema
const Event = require('./models/Event');
const User = require('./models/User');

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String! 
            price: Float!
            date : String!
        }
        type User {
            _id: ID!
            email: String!
            password: String
            
        }

        input eventInput{
            title: String!
            description: String!
            price: Float!
            date: String!    
        } 

        input userInput{
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: eventInput): Event
            createUser(userInput: userInput): User
        }
        schema {
            query : RootQuery
            mutation : RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc };
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "5ea5afb2bacb0a291e197e47"
            });
            let createdEvent;
            return event.save()
                .then(result => {
                    createdEvent = { ...result._doc, _id: result._doc._id.toString() };
                    return User.findById('5ea5afb2bacb0a291e197e47');
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User not found.');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        createUser: (args) => {
            return User.findOne({ email: args.userInput.email })
                .then(user => {
                    if (user) {
                        throw new Error('user exists already !');
                    }
                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save()
                        .then(result => {
                            return { ...result._doc, password: null };
                        })
                        .catch(err => {
                            throw err;
                        })
                })
                .catch(err => {
                    throw err
                });

        }
    },
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


