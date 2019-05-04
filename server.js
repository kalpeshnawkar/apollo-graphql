

require('dotenv').config();
//const { ApolloServer } = require('apollo-server');
const { ApolloServer } = require('apollo-server-express');
const express = require('express')
const { typeDefs } = require('./src/schema');
const resolvers = require('./src/resolvers').resolvers
const redis = require('./config/redis');
const mongodb = require('./config/mongodb');
const upload = require('./util/awsS3')

const app = express();

app.use("*",upload.single('image'))


const server = new ApolloServer({
    typeDefs, resolvers, context: ({ req }) => ({
        // get the user token from the headers
        token: req.query.token,
        code :req.query.code
    })
});

server.applyMiddleware({app ,path: '/graphql'});

app.listen({ port: 4000 } ,() => {
        console.log(`🚀 Server ready at `);
    })