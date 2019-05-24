/**
* @description: requiring the neccessary files
*/

const { createApolloFetch } = require('apollo-fetch');

/**
 * @description : for starring the repository
 */

exports.addStar = async (parent, args, context) => {
    try {
       // verifying the token to get the userID
        var payload = await jwt.verify(context.token, process.env.SECRET);
        var userID = payload.userID
        //finding the user by the userID to get the git token saved in the database
        var user = await userModel.find({ _id: userID })
        //var accessToken = user[0].gitToken;
        var gitToken = user[0].gitToken;
        
        const fetch = createApolloFetch({
            uri: `https://api.github.com/graphql?access_token=${gitToken}`,
        });
        const res = await fetch({
            query: 'mutation {addStar(input: {starrableId: "MDEwOlJlcG9zaXRvcnkxODQ1OTE5NzM=", clientMutationId:"MDQ6VXNlcjQ3NzQ5OTgz"}) { clientMutationId}}',
        })
        console.log("Response", res);
        return {
            "message": "repository starred"
        }
    }catch(err) {
        console.log("ERROR", err);
        return {
            "message": `something went wrong`,
            "success": false
        }
    }
}

/**
 * @description : for unstarring the repository
 */

exports.removeStar = async (parent, args, context) => {
    try {
        //verifying the token to get the userID
        var payload = await jwt.verify(context.token, process.env.SECRET);
        var userID = payload.userID
        //finding the user by the userID to get the git token saved in the database
        var user = await userModel.find({ _id: userID })
        //var accessToken = user[0].gitToken;
        var gitToken = user[0].gitToken;
        
        const fetch = createApolloFetch({
            uri: `https://api.github.com/graphql?access_token=${gitToken}`,
        });

        const res = await fetch({
            query: 'mutation {removeStar(input: {starrableId: "MDEwOlJlcG9zaXRvcnkxODQ1OTE5NzM=", clientMutationId:"MDQ6VXNlcjQ3NzQ5OTgz"}) { clientMutationId}}',
        })
        console.log("Response", res);
        return {
            "message": "repository unstarred"
        }
    }catch(err) {
        console.log("ERROR", err);
        return {
            "message": `something went wrong`,
            "success": false
        }
    }
}