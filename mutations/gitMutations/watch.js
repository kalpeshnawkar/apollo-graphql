/**
* @description: requiring the neccessary files
*/

const axios = require('axios');
const jwt = require('jsonwebtoken');
const userModel = require('../../model/userModel');
const axiosService = require('../../services/axiosService').axiosService
const verifyToken = require('../../services/verifyToken').verifyToken

/**
 * @description : for creating a branch
 * @purpose : for creating a branch by taking the name of the user, repository name and the branch name as arguments
 */

exports.watchRepository = async (parent, args, context) => {
    try {
        if (context.token) {
            console.log(context.token)
            var payload = await verifyToken(context.token);
            var user = await userModel.find({ _id: payload.userID });
            var gitToken = user[0].gitToken
            var method = "PUT"
            var url = `https://api.github.com/user/subscriptions/${args.user}/${args.repositoryName}`
            await axiosService(url, method,gitToken)
            return {
                "message": "watching the repository " + args.repositoryName
            }
        }
    } catch (err) {
        console.log("ERROR", err)
        return {
            "message": "can not watch the repository " + args.repositoryName
        }
    }
}

exports.unwatchRepository = async (parent, args, context) => {
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.SECRET);
            var user = await userModel.find({ _id: payload.userID });
            var gitToken = user[0].gitToken
                var method= "DELETE";
                var url= `https://api.github.com/user/subscriptions/${args.user}/${args.repositoryName}`;
                await axiosService(url, method,gitToken);
                return {
                    "message": "unwatched the repository " + args.repositoryName
                }
        }
        else {
            return {
                "message": "token not provided"
            }
        }
    } catch (err) {
        console.log("ERROR", err);
        return {
            "message": `something went wrong`,
            "success": false
        }
    }

}