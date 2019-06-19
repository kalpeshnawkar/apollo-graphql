/**
* @description: requiring the neccessary files
*/

const { createApolloFetch } = require('apollo-fetch');
const userModel = require('../../model/userModel');
const verifyToken = require('../../services/verifyToken').verifyToken

/**
 * @description : to retrieve a list of all public repositories from Github and their respective latest commits
 * @purpose : retrieve a list of all public repositories from Github and their respective latest commits
 */

exports.getAllUsers = async (parent, args, context) => {
    try {
        var payload = verifyToken(context.token)
        var user = await userModel.find({ _id: payload.userId})
        //var accessToken = user[0].gitToken;
        var gitToken = user[0].gitToken;
        //try {
        //const queryString = "is:public stars:>0 archived:false created:<2019-06-15 pushed:<2019-06-05"
        const fetch = createApolloFetch({
            uri: `https://api.github.com/graphql?access_token=${gitToken}`
        })

        const res = await fetch({
            query: 'query{search(first:10 query:"stars:>0" type: REPOSITORY) { repositoryCount edges{ node{ ... on Repository{ name commitComments(first:10){ totalCount nodes{ commit{ commitUrl}}}}}}}}'
        })
        console.log("response =>", res);
        return res.data.search
    }
    catch (err) {
        return {
            "message":err
        }
    }
}

