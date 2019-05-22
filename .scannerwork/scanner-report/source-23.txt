
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

exports.createBranch = async (parent, args, context) => {
    if (context.token) {
        console.log(context.token);
        const payload = await jwt.verify(context.token,process.env.SECRET)
        var user =await userModel.find({"_id" : payload.userID })
        const gitToken = user.gitToken;
        console.log(user.gitToken);
        //using axios to get the details about the particular repository like sha 
        axios({
            method: "get",
            url: `https://api.github.com/repos/${args.user}/${args.repositoryName}/git/refs?access_token=${gitToken}`,
            headers: {
                accept: 'application/json'
            }
        }).then(response => {
            console.log("Response => ", response.data[0].object.sha);
            createBranch(response.data[0].object.sha, args.name) //passing the required details for creating details
        })

        function createBranch(sha, name) {
            console.log("name", name)
            console.log("sha", sha)
            //using axios to post the create branch api by passing the name of the branch in ref
            axios({
                method: "post",
                url: `https://api.github.com/repos/${args.user}/${args.repositoryName}/git/refs?access_token=${gitToken}`,
                headers: {
                    accept: 'application/json'
                },
                data: {
                    "ref": `refs/heads/${args.branchName}`,
                    "sha": sha
                }
            }).then(res => {
                console.log("create branch res", res);
            }).catch(err => {
                console.log(err);
                
            })
        }
    }
    else {
        return { "message": "token not provided" }
    }
}

/**
 * @description : for deleting a branch
 * @purpose : for deleting a branch by taking the name of the user, repository name and the branch name as arguments
 */


exports.deleteBranch = async (parent, args, context) => {
    try {
        if (context.token) {
            console.log(context.token);
            const payload = jwt.verify(context.token,process.env.SECRET)
            var user = userModel.find({"_id" : payload.userID })
            const gitToken = user[0].gitToken;
            console.log(user[0].gitToken);
            
            //using axios to delete a branch by giving the name of the branch
            await axios({
                method: "delete",
                url: `https://api.github.com/repos/${args.user}/${args.repositoryName}/git/refs/heads/${args.branchName}?access_token=${gitToken}`,
                headers: {
                    accept: 'application/json'
                }
            })
            return {
                "message": "branch deleted successfully"
            }
        }
        else {
            return { "message": "token not provided" }
        }
    }
    catch (err) {
        return {
            "message": err
        }
    }
}
