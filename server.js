require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./src/schema');
const resolvers = require('./src/resolvers').resolvers
const redis = require('./config/redis');
const mongodb = require('./config/mongodb')


const server = new ApolloServer({
    typeDefs, resolvers, context: ({ req }) => ({
        // get the user token from the headers
        token: req.query.token,
        code :req.query.code
    })
});

server.listen({ port: 4000 })
    .then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });