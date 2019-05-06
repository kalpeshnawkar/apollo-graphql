/** 
 * @desciption requiring the necessary files
 */

const userModel = require('../../model/userModel');
const jwt = require('jsonwebtoken');

/**
 * @description: Mutation for verfying the token and login 
 */

exports.verifyOauth = async (parent, args, context) => {
    try {
        var payload = await jwt.verify(context.token, "gitsecret"); //token verification
        if (!payload) {
            return {
                "message": "git verification unsuccessful"
            }
        }
        console.log(payload.gitUsername)
        console.log(payload.gitID)
        //updating the gitVerify field so that the user can login
        userUpdate = await userModel.updateOne({ "gitID": payload.gitID }, { $set: { "gitVerify": true } })  // finding the user for the email provided and updating the verification field in the database  
        if (userUpdate) {
            //finding the git user in the usermodel for logging in
            var user = await userModel.find({ "gitID": payload.gitID, "gitUsername": payload.gitUsername })
            if (!user) {
                return { "message": "id not found" }
            }
            //checking whether the git user verifcation is successful
            if (user[0].gitVerify === false) {
                return {
                    "message": "git verification unsuccessful"
                }
            }
            return {
                "message": "login successful"
            }
        }
        else {
            return {
                "message": " user not found !!! "
            }
        }
    }
    catch (err) {
        console.log("ERROR", err);

    }

}


