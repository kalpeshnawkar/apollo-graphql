
/**
* @description: requiring the neccessary files
*/

const axios = require('axios');
const jwt = require('jsonwebtoken');
const userModel = require('../../model/userModel');
const axiosService = require('../../services/axiosService').axiosService;
const verifyToken = require('../../services/verifyToken').verifyToken

/**
 * @description : for creating a branch
 * @purpose : for creating a branch by taking the name of the user, repository name and the branch name as arguments
 */

exports.createBranch = async (parent, args, context) => {
    try {
        if (context.token) {
            //console.log(context.token);
            const payload = await verifyToken(context.token)
            var user = await userModel.find({ "_id": payload.userID })
            const gitToken = user.gitToken;
            //console.log(user.gitToken);
            //using axios to get the details about the particular repository like sha 
            var method = "get"
            var url = `https://api.github.com/repos/${args.user}/${args.repositoryName}/git/refs?access_token=${gitToken}`
            var response = await axiosService(url, method, gitToken)
            if (response) {
                console.log("Response => ", response.data[0].object.sha);
                createBranch(response.data[0].object.sha, args.name) //passing the required details for creating details
            }
            else {
                return {
                    "message": response
                }
            }

            async function createBranch(sha, name) {
                console.log("name", name)
                console.log("sha", sha)
                //using axios to post the create branch api by passing the name of the branch in ref
                var method = "post"
                var url = `https://api.github.com/repos/${args.user}/${args.repositoryName}/git/refs?access_token=${gitToken}`
                var data = {
                    "ref": `refs/heads/${args.branchName}`,
                    "sha": sha
                }
                var res = await axiosService(url, method, gitToken, data)
                if (res) {
                    return {
                        "message": "branch created successfully"
                    }
                }
                else {
                    return { "message": "token not provided" }
                }
            }
        }
    }
    catch (err) {
            return {
                "message": "something went wrong",
                success : false
            }
        }
    }

/**
 * @description : for deleting a branch
 * @purpose : for deleting a branch by taking the name of the user, repository name and the branch name as arguments
 */


exports.deleteBranch = async (parent, args, context) => {
        try {
            //if (context.token) {
                //console.log(context.token);
                const payload = verifyToken(context.token)
                var user = userModel.find({ "_id": payload.userID })
                const gitToken = user[0].gitToken;
                //console.log(user[0].gitToken);

                //using axios to delete a branch by giving the name of the branch
            
                   var  method= "delete"
                   var url= `https://api.github.com/repos/${args.user}/${args.repositoryName}/git/refs/heads/${args.branchName}` 
                await axiosService(url,method,gitToken)
                return {
                    "message": "branch deleted successfully"
                }
            //}
           //
        }
        catch (err) {
            return {
                "message": `something went wrong ${err}`,
                "success": false
            }
        }
    }
