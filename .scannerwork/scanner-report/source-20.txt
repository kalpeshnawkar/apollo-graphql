/**
* @description: requiring the neccessary files
*/

const axios = require('axios');
const jwt = require('jsonwebtoken');
const userModel = require('../../model/userModel');

/**
 * @description : for creating a branch
 * @purpose : for creating a branch by taking the name of the user, repository name and the branch name as arguments
 */

exports.watchRepository = async (parent, args, context) => {
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token,process.env.secret);
            var user = await userModel.find({_id : payload.userID});
            var gitToken = user[0].gitToken
            var watchers = await axios({
                method: "PUT",
                url: `https://api.github.com/user/subscriptions/${args.user}/${args.repositoryName}?access_token=${gitToken}`,
                headers: {
                    accept: 'application/json'
                }
            })
            if (watchers) {
                return {
                    "message": "watching the repository "+args.repositoryName
                }
            }
            else {
                return {
                    "message": "can not watch the repository "+args.repositoryName
                }
            }
        }
    } catch (err) {
        console.log("ERROR", err)
    }
}

exports.unwatchRepository = async (parent, args, context) => {
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token,process.env.secret);
            var user = await userModel.find({_id : payload.userID});
            var gitToken = user[0].gitToken
            var watchers = await axios({
                method: "DELETE",
                url: `https://api.github.com/user/subscriptions/${args.user}/${args.repositoryName}?access_token=${gitToken}`,
                headers: {
                    accept: 'application/json'
                }
            })
            if (watchers) {
                return {
                    "message": "unwatched the repository "+args.repositoryName
                }
            }
            else {
                return {
                    "message": "can not unwatch the repository "+args.repositoryName
                }
            }
        }
        else{
            return{
                "message" : "token not provided"
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