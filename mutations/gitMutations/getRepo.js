/**
* @description: requiring the neccessary files
*/

const userModel = require('../../model/userModel')
const jwt = require('jsonwebtoken')
const noteModel = require('../../model/noteModel')
const { createApolloFetch } = require('apollo-fetch');
const verifyToken = require('../../services/verifyToken').verifyToken

/**
 * @description : for getting the repository details 
 * @purpose : for getting the repository details and saving the details of the repositories as notes
 */

exports.getRepo = async (parent, args, context) => {
    try {
        // verifying the token to get the userID
        var payload = await verifyToken(context.token);
        var userID = payload.userID
        //finding the user by the userID to get the git token saved in the database
        var user = await userModel.find({ _id: userID })
        var accessToken = user[0].gitToken;
        console.log(user[0].gitToken);
        const fetch = createApolloFetch({
            uri: `https://api.github.com/graphql?access_token=${accessToken}`,
        });

        const res = await fetch({
            query: `{repositoryOwner(login:"${args.user}") { id login avatarUrl repositories(first:5){ nodes{ isPrivate name } } } }`,
        })
        //looping through all the repositories present and saving them as notes in database
        console.log("Response", res);
        for (let i = 0; i < res.data.repositoryOwner.repositories.nodes.length; i++) {
            var check = await noteModel.find({ title: res.data.repositoryOwner.repositories.nodes[i].name })
            //console.log(check)
            if (check.length == 0) {
                console.log("repos", res.data.repositoryOwner.repositories.nodes[i].name);
                var note = new noteModel({
                    title: res.data.repositoryOwner.repositories.nodes[i].name,
                    userID: userID
                })
                await note.save();
            }
        }
        return {
            "message": "repositories saved to the database successfully"
        }
    }catch(err) {
        console.log("ERROR", err);
        return {
            "message": `something went wrong`,
            "success": false
        }
    }

}
