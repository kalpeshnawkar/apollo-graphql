/**
* @description: requiring the neccessary files
*/

require('dotenv').config();
//const { ApolloServer } = require('apollo-server');
const redis = require('async-redis');
const client = redis.createClient()

const { ApolloServer } = require('apollo-server-express');
const express = require('express')
const { typeDefs } = require('./src/schema');
const resolvers = require('./src/resolvers').resolvers
const redis1 = require('./config/redis');
const mongodb = require('./config/mongodb');
const upload = require('./util/awsS3');

//creating a express instance
const app = express();

app.use("*", upload.single('image'))


const server = new ApolloServer({
    typeDefs,
    resolvers, 
    context: ({ req }) => ({
        // to get the user token/code from the query
        token: req.query.token,
        code: req.query.code
    })
});

server.applyMiddleware({ app, path: '/graphql' });

// listening to port
app.listen({ port: process.env.PORT }, () => {
    console.log(`🚀 Server ready at ${process.env.PORT}`);
})