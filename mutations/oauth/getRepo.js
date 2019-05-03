const userModel = require('../../model/userModel')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const noteModel = require('../../model/noteModel')

/**
 * @description : for getting the repository details 
 * @purpose : for getting the repository details and saving the details of the repositories as notes
 */
exports.getRepo = async (parent, args, context) => {
    //verifying the token to get the userID
    var payload = await jwt.verify(context.token,process.env.SECRET);
    var userID = payload.userID
    //finding the user by the userID to get the git token saved in the database
    var user = await userModel.find({ _id: userID })
    var accessToken = user[0].gitToken;
    console.log(user[0].gitToken);
    //http request to get the repository details
    axios({
        method: 'get',
        url: `https://api.github.com/user/repos?access_token=${accessToken}`,
        headers: {
            accept: 'application/json'
        }
    }).then(async (response) => {
        //looping through all the repositories present and saving them as notes in database
        for (let i = 0; i < response.data.length; i++) {
            var check = await noteModel.find({ title: response.data[i].name })
            //console.log(check)
            if (check.length==0) {
                console.log("repos", response.data[i].name);
                var note = new noteModel({
                    title: response.data[i].name,
                    description: response.data[i].description,
                    userID: userID
                })
                note.save();
            }
        }
        return {
            "message" : "repositories saved to the database successfully"
        }
    })

}